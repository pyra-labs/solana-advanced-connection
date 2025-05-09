import type Strategy from "../strategy.js";
import type { Connection } from "@solana/web3.js";
export declare class Sequential implements Strategy {
    private connections;
    private next;
    constructor(connections: Connection[]);
    start(): void;
    getConnection(): IterableIterator<Connection>;
}
//# sourceMappingURL=sequential.d.ts.map