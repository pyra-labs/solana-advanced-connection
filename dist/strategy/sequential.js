export class Sequential {
    connections;
    next = 0;
    constructor(connections) {
        this.connections = connections;
    }
    start() {
        this.next = 0;
    }
    *getConnection() {
        while (true) {
            if (this.next > this.connections.length - 1) {
                return null;
            }
            const connection = this.connections[this.next];
            if (!connection)
                throw new Error("Invalid connection found");
            this.next++;
            yield connection;
        }
    }
}
//# sourceMappingURL=sequential.js.map