import type Strategy from "../strategy.js";
import type { Connection } from "@solana/web3.js";

export class Sequential implements Strategy {
  private connections: Connection[];
  private next = 0;

  constructor(connections: Connection[]) {
    this.connections = connections;
  }

  start() {
    this.next = 0;
  }

  *getConnection(): IterableIterator<Connection> {
    while (true) {
      if (this.next > this.connections.length - 1) {
        return null;
      }

      const connection = this.connections[this.next];
      if (!connection) throw new Error("Invalid connection found");
      this.next++;

      yield connection;
    }
  }
}
