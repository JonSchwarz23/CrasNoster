import { client } from "../client";
import { toNumber } from "../parsing/csvConverters";
import { CsvParseInfo } from "../parsing/csvParser";
import { Player } from "../entities/Player";
import { Team } from "../entities/Team";
import { ArrayContains } from "typeorm";

export type PlayerCSV = {
    id: string;
    name: string;
    team: string;
    position: string;
    rankOverall: number;
    fantasyTeam: string;
    age: number;
    opponent: string;
    salary: number;
    contract: number;
    score: string;
    draftPercentage: string;
    averageDraftPercentage: string;
    rosterPercentage: string;
};

const playerParseInfo: CsvParseInfo<PlayerCSV> = {
    path: "/app/data/fantraxPlayers.csv",
    headers: [
        "id",
        "name",
        "team",
        "position",
        "rankOverall",
        "fantasyTeam",
        "age",
        "opponent",
        "salary",
        "contract",
        "score",
        "draftPercentage",
        "averageDraftPercentage",
        "rosterPercentage",
    ],
    castingFunctions: {
        rankOverall: toNumber,
        age: toNumber,
        salary: toNumber,
        contract: (value) => (value === "1st" ? 2025 : toNumber(value)),
        name: (value) => {
            let result = value.replaceAll("ñ", "n");
            result = value.replaceAll("ó", "o");
            result = value.replaceAll("é", "e");
            result = value.replaceAll("í", "i");
            result = value.replaceAll("ú", "u");
            result = value.replaceAll("á", "a");
            return result;
        },
    },
    handlePayloads: async (payloads: PlayerCSV[]) => {
        const teams = await client.database.manager.find(Team);

        for (const payload of payloads) {
            const fantasyTeam = await client.database.getFantasyTeam(payload.fantasyTeam);
            const team = await client.database.manager.findOne(Team, {
                where: {
                    abbreviations: ArrayContains([payload.team]),
                },
            });
            const player = new Player(
                payload.id,
                payload.name,
                team,
                payload.position,
                payload.rankOverall,
                fantasyTeam,
                payload.age,
                payload.salary,
                payload.contract
            );
            client.database.save(player);
        }
    },
};

export { playerParseInfo };
