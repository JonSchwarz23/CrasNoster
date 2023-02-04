import { client } from "../client";
import { toNumber } from "./csvConverters";
import { CsvParseInfo } from "./csvParser";
import { Player } from "../entities/Player";
import { OffensiveProjectionValue, PitcherProjectionValue } from "../entities/Projections";

type OffProjCSV = {
    name: string;
    team: string;
    position: string;
    adp: number;
    pa: number;
    avg: number;
    rbi: number;
    sb: number;
    ops: number;
    tb: number;
    beforePositionalAdjustment: number;
    positionalAdjustment: number;
    total: number;
    fangraphsId: string;
};

export class FangraphsOffProjParseInfo implements CsvParseInfo<OffProjCSV> {
    constructor(public path: string, private source: string) {}

    public readonly headers = [
        "name",
        "team",
        "position",
        "adp",
        "pa",
        "avg",
        "rbi",
        "sb",
        "ops",
        "tb",
        "beforePositionalAdjustment",
        "positionalAdjustment",
        "total",
        "fangraphsId",
    ];

    public readonly castingFunctions = {
        default: toNumber,
        name: (value: string) => value,
        team: (value: string) => value,
        position: (value: string) => value,
        fangraphsId: (value: string) => value,
    };

    async handlePayloads(payloads: OffProjCSV[]) {
        for (const payload of payloads) {
            const players = await client.database.manager.find(Player, {
                where: {
                    fangraphsId: payload.fangraphsId,
                },
                relations: {
                    offensiveProjectionValues: true,
                },
            });

            if (players.length === 0) {
                console.log("Player not found: " + payload.name);
                console.log("Fangraphs ID: " + payload.fangraphsId);
                continue;
            }

            const projections = new OffensiveProjectionValue(
                this.source,
                payload.avg,
                payload.rbi,
                payload.sb,
                payload.ops,
                payload.tb,
                payload.beforePositionalAdjustment,
                payload.positionalAdjustment,
                payload.total
            );

            await client.database.save(projections);

            for (const player of players) {
                if (!player.offensiveProjectionValues) {
                    player.offensiveProjectionValues = [];
                }
                player.offensiveProjectionValues.push(projections);
                await client.database.save(player);
            }
        }
    }
}

type PitProjCSV = {
    name: string;
    team: string;
    position: string;
    adp: number;
    ip: number;
    era: number;
    whip: number;
    so: number;
    qs: number;
    svhld: number;
    beforePositionalAdjustment: number;
    positionalAdjustment: number;
    total: number;
    fangraphsId: string;
};

export class FangraphsPitProjParseInfo implements CsvParseInfo<PitProjCSV> {
    constructor(public path: string, private source: string) {}
    public readonly headers = [
        "name",
        "team",
        "position",
        "adp",
        "ip",
        "era",
        "whip",
        "so",
        "qs",
        "svhld",
        "beforePositionalAdjustment",
        "positionalAdjustment",
        "total",
        "fangraphsId",
    ];

    public readonly castingFunctions = {
        default: toNumber,
        name: (value: string) => value,
        team: (value: string) => value,
        position: (value: string) => value,
        fangraphsId: (value: string) => value,
    };

    async handlePayloads(payloads: PitProjCSV[]) {
        let totalFailures = 0;

        for (const payload of payloads) {
            const players = await client.database.manager.find(Player, {
                where: {
                    fangraphsId: payload.fangraphsId,
                },
                relations: {
                    pitcherProjectionValues: true,
                },
            });

            if (players.length === 0) {
                totalFailures++;
                console.log("Player not found: " + payload.name);
                console.log("Fangraphs ID: " + payload.fangraphsId);
                continue;
            }

            const projections = new PitcherProjectionValue(
                this.source,
                payload.era,
                payload.whip,
                payload.so,
                payload.qs,
                payload.svhld,
                payload.beforePositionalAdjustment,
                payload.positionalAdjustment,
                payload.total
            );

            await client.database.save(projections);

            for (const player of players) {
                if (!player.pitcherProjectionValues) {
                    player.pitcherProjectionValues = [];
                }
                player.pitcherProjectionValues.push(projections);
                await client.database.save(player);
            }
        }

        console.log("Total failures: " + totalFailures);
    }
}

type HistoricalPitProjCSV = Omit<PitProjCSV, "qs">;

export class HistoricalFangraphsPitProjParseInfo implements CsvParseInfo<HistoricalPitProjCSV> {
    constructor(public path: string, private source: string) {}
    public readonly headers = [
        "name",
        "team",
        "position",
        "adp",
        "ip",
        "era",
        "whip",
        "so",
        "svhld",
        "beforePositionalAdjustment",
        "positionalAdjustment",
        "total",
        "fangraphsId",
    ];

    public readonly castingFunctions = {
        default: toNumber,
        name: (value: string) => value,
        team: (value: string) => value,
        position: (value: string) => value,
        fangraphsId: (value: string) => value,
    };

    async handlePayloads(payloads: HistoricalPitProjCSV[]) {
        for (const payload of payloads) {
            const players = await client.database.manager.find(Player, {
                where: {
                    fangraphsId: payload.fangraphsId,
                },
                relations: {
                    pitcherProjectionValues: true,
                },
            });

            if (players.length === 0) {
                console.log("Player not found: " + payload.name);
                console.log("Fangraphs ID: " + payload.fangraphsId);
                continue;
            }

            const projections = new PitcherProjectionValue(
                this.source,
                payload.era,
                payload.whip,
                payload.so,
                0, // historical data doesn't have QS
                payload.svhld,
                payload.beforePositionalAdjustment,
                payload.positionalAdjustment,
                payload.total
            );

            await client.database.save(projections);

            for (const player of players) {
                if (!player.pitcherProjectionValues) {
                    player.pitcherProjectionValues = [];
                }
                player.pitcherProjectionValues.push(projections);
                await client.database.save(player);
            }
        }
    }
}
