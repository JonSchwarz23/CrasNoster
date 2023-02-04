import { Database } from "./database";

class Client {
    database: Database;

    constructor() {
        console.log("Building new client");
        this.database = new Database();
    }

    async init() {
        await this.database.initialize();
    }
}

const client = new Client();
export { client };
