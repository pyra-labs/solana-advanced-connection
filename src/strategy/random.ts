import type Strategy from "../strategy.js";
import type { Connection } from "@solana/web3.js";

export class Random implements Strategy {
  private connections: Connection[];
  private available: number[] = [];

  constructor(connections: Connection[]) {
    this.connections = connections;
  }

  start() {
    this.available = Array.from(Array(this.connections.length).keys());
  }

  *getConnection(): IterableIterator<Connection> {
    while (true) {
      if (this.available.length === 0) {
        return null;
      }

      const rand = Math.floor(Math.random() * this.available.length)
      const randomKey = this.available[rand];
      if (!randomKey) throw new Error("Invalid random key found");

      const connection = this.connections[randomKey];
      if (!connection) throw new Error("Invalid connection found");

      this.available.splice(rand, 1);

      yield connection;
    }
  }
}
