import { DataSource } from "typeorm";
import { FantasyTeam } from "./entities/FantasyTeam";
import { Player } from "./entities/Player";
import { OffensiveProjectionValue, PitcherProjectionValue } from "./entities/Projections";
import { Team } from "./entities/Team";

export class Database {
    private dataSource: DataSource;

    constructor() {
        this.dataSource = new DataSource({
            type: "postgres",
            host: "database",
            port: 5432,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            synchronize: true,
            logging: false,
            entities: [Player, FantasyTeam, Team, OffensiveProjectionValue, PitcherProjectionValue],
            dropSchema: true,
        });
    }

    public async initialize() {
        await this.dataSource.initialize();
    }

    public async getFantasyTeam(acronym: string) {
        return this.dataSource.getRepository(FantasyTeam).findOne({
            where: {
                acronym,
            },
        });
    }

    public async getAllPlayers() {
        return this.manager.find(Player, {
            relations: {
                team: true,
                fantasyTeam: true,
                offensiveProjectionValues: true,
                pitcherProjectionValues: true,
            },
        });
    }

    public async saveFantasyTeam(team: FantasyTeam) {
        return this.dataSource.getRepository(FantasyTeam).save(team);
    }

    public async save<T>(entity: T) {
        return this.dataSource.manager.save(entity);
    }

    get manager() {
        return this.dataSource.manager;
    }
}
