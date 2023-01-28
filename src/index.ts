import "reflect-metadata";
import { DataSource } from "typeorm";
import { Test } from "./entities/Test";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "database",
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: [Test],
});

const main = async () => {
    await AppDataSource.initialize();
    const test = new Test("Test message");
    await AppDataSource.manager.save(test);
    const tests = await AppDataSource.manager.find(Test);
    for(const test of tests) {
        console.log(`The message for ${test.id} is ${test.message}`);
    }
}

main();
