export class RoundRobin {
    connections;
    next = 0;
    triedConnections = 0;
    constructor(connections) {
        this.connections = connections;
    }
    start() {
        this.triedConnections = 0;
    }
    *getConnection() {
        while (true) {
            // just cycles back to start when all connections are tried
            if (this.next > this.connections.length - 1) {
                this.next = 0;
            }
            if (this.triedConnections > this.connections.length - 1) {
                return null;
            }
            const connection = this.connections[this.next];
            if (!connection)
                throw new Error("Invalid connection found");
            this.next++;
            this.triedConnections++;
            yield connection;
        }
    }
}
//# sourceMappingURL=roundrobin.js.map