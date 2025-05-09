import type Strategy from "../strategy.js";
import type { Connection } from "@solana/web3.js";
export declare class RoundRobin implements Strategy {
    private connections;
    private next;
    private triedConnections;
    constructor(connections: Connection[]);
    start(): void;
    getConnection(): IterableIterator<Connection>;
}
//# sourceMappingURL=roundrobin.d.ts.map