import { Sequential } from "./strategy/sequential.js";
import { RoundRobin } from "./strategy/roundrobin.js";
import { Random } from "./strategy/random.js";
import { Connection } from "@solana/web3.js";
export default class AdvancedConnection extends Connection {
    connections;
    strategy;
    overrides;
    constructor(endpoints, commitmentOrConfig, advancedConfig) {
        super(endpoints[0] || "", commitmentOrConfig); // Ignore super
        this.connections = endpoints.map((url) => new Connection(url, commitmentOrConfig));
        switch (advancedConfig?.strategy ?? 'sequential') {
            case "round-robin":
                this.strategy = new RoundRobin(this.connections);
                break;
            case "random":
                this.strategy = new Random(this.connections);
                break;
            default:
                this.strategy = new Sequential(this.connections);
                break;
        }
        this.overrides = new Map();
        for (const route of advancedConfig?.routes ?? []) {
            let foundConnection = this.connections.find((con) => con.rpcEndpoint === route.endpoint);
            if (!foundConnection) {
                foundConnection = new Connection(route.endpoint, commitmentOrConfig);
            }
            this.overrides.set(route.method, { allowFallback: route.allowFallback, connection: foundConnection });
        }
        for (const property of Object.getOwnPropertyNames(Connection.prototype)) {
            // @ts-ignore
            if (typeof Connection.prototype[property] !== 'function') {
                continue;
            }
            // Remap all functions with a proxy function that does the exact same thing,
            // except it adds a fallback for when something goes wrong
            // @ts-ignore
            if (this[property].constructor.name === 'AsyncFunction') {
                // @ts-ignore
                this[property] = async (...args) => {
                    return await this.executeWithCallback((con) => {
                        // @ts-ignore
                        return con[property].apply(con, args);
                    }, property);
                };
                continue;
            }
            // Do the same for non async functions
            // @ts-ignore
            this[property] = (...args) => {
                let lastError;
                // Overrides come first, if set
                if (this.overrides.has(property)) {
                    const override = this.overrides.get(property);
                    if (override) {
                        try {
                            // @ts-ignore
                            return override.connection[property].apply(override.connection, args);
                        }
                        catch (e) {
                            lastError = e;
                        }
                        if (!override.allowFallback) {
                            if (lastError) {
                                throw lastError;
                            }
                        }
                    }
                }
                this.strategy.start();
                for (const conn of this.strategy.getConnection()) {
                    try {
                        // @ts-ignore
                        return conn[property].apply(conn, args);
                    }
                    catch (e) {
                        lastError = e;
                    }
                }
                if (lastError) {
                    throw lastError;
                }
            };
        }
    }
    executeWithCallback = async (callback, property) => {
        // Start with main connection, then iterate through all backups
        let lastError;
        // Overrides come first, if set
        if (this.overrides.has(property)) {
            const override = this.overrides.get(property);
            if (override) {
                try {
                    return await callback(override.connection);
                }
                catch (e) {
                    lastError = e;
                }
                if (!override.allowFallback) {
                    if (lastError) {
                        throw lastError;
                    }
                }
            }
        }
        this.strategy.start();
        for (const conn of this.strategy.getConnection()) {
            try {
                return await callback(conn);
            }
            catch (e) {
                lastError = e;
            }
        }
        throw lastError;
    };
}
//# sourceMappingURL=index.js.map