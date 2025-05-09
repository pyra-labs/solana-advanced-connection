import { Connection, type Commitment, type ConnectionConfig } from "@solana/web3.js";
interface AdvancedConnectionConfig {
    strategy?: 'sequential' | 'round-robin' | 'random';
    routes?: {
        allowFallback: boolean;
        method: string;
        endpoint: string;
    }[];
}
export default class AdvancedConnection extends Connection {
    private readonly connections;
    private readonly strategy;
    private readonly overrides;
    constructor(endpoints: string[], commitmentOrConfig?: Commitment | ConnectionConfig, advancedConfig?: AdvancedConnectionConfig);
    private executeWithCallback;
}
export {};
//# sourceMappingURL=index.d.ts.map