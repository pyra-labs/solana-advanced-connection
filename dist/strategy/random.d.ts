import type Strategy from "../strategy.js";
import type { Connection } from "@solana/web3.js";
export declare class Random implements Strategy {
    private connections;
    private available;
    constructor(connections: Connection[]);
    start(): void;
    getConnection(): IterableIterator<Connection>;
}
//# sourceMappingURL=random.d.ts.map