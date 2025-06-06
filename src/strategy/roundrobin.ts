import type Strategy from "../strategy.js";
import type { Connection } from "@solana/web3.js";

export class RoundRobin implements Strategy {
  private connections: Connection[];
  private next = 0;
  private triedConnections = 0;

  constructor(connections: Connection[]) {
    this.connections = connections;
  }

  start() {
    this.triedConnections = 0;
  }

  *getConnection(): IterableIterator<Connection> {
    while (true) {
      // just cycles back to start when all connections are tried
      if (this.next > this.connections.length - 1) {
        this.next = 0;
      }

      if (this.triedConnections > this.connections.length - 1) {
        return null;
      }

      const connection = this.connections[this.next];
      if (!connection) throw new Error("Invalid connection found");
      this.next++;
      this.triedConnections++;

      yield connection;
    }
  }
}
