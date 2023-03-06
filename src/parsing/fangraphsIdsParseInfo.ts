import { client } from "../client";
import { CsvParseInfo } from "./csvParser";
import { Player } from "../entities/Player";
import { ArrayContains, IsNull } from "typeorm";
import { distance } from "fastest-levenshtein";

export type FangraphsBattersIdsParseCSV = {
    name: string;
    team: string;
    playerId: string;
};

export class FangraphsIdsParseInfo implements CsvParseInfo<FangraphsBattersIdsParseCSV> {
    constructor(public path: string) {}
    headers = ["name", "team", "playerId"];
    castingFunctions = {
        team: (value: string) => (value === "" ? null : value),
    };

    async handlePayloads(payloads: FangraphsBattersIdsParseCSV[]) {
        const allPlayers = await client.database.manager.find(Player, {
            relations: {
                team: true,
            },
        });

        for (const payload of payloads) {
            let players: Player[] = [];
            if (!payload.team) {
                players = await client.database.manager.find(Player, {
                    relations: {
                        team: true,
                    },
                    where: {
                        name: payload.name,
                        team: {
                            abbreviations: IsNull(),
                        },
                    },
                });
            } else {
                players = await client.database.manager.find(Player, {
                    relations: {
                        team: true,
                    },
                    where: {
                        name: payload.name,
                        team: {
                            abbreviations: ArrayContains([payload.team]),
                        },
                    },
                });
            }

            if (players.length === 0) {
                console.log("Could not find match for ", payload);
                continue;

                const playersOnTeam = allPlayers.filter((player) => (!player.team && !payload.team) || player.team?.abbreviations.includes(payload.team));

                let closePlayers: Player[] = [];
                let minLDistance = Infinity;

                for (const player of playersOnTeam) {
                    let lDistance = distance(player.name, payload.name);
                    if (lDistance < minLDistance) {
                        minLDistance = lDistance;
                        closePlayers = [player];
                    } else if (lDistance === minLDistance) {
                        closePlayers.push(player);
                    }
                }

                if (closePlayers.length > 1) {
                    continue;
                }

                const closest = closePlayers[0];

                const matches = await client.database.manager.find(Player, {
                    relations: {
                        team: true,
                    },
                    where: {
                        name: payload.name,
                    },
                });

                if (matches.length > 0) {
                    continue;
                }

                if (closest.fangraphsId && minLDistance > closest.impreciseFangraphsMatch!) {
                    continue;
                }

                closest.fangraphsId = payload.playerId;
                closest.impreciseFangraphsMatch = minLDistance;
                await client.database.save(closest);

                continue;
            }

            for (const player of players) {
                player.impreciseFangraphsMatch = 0;
                player.fangraphsId = payload.playerId;
                allPlayers.find((p) => p.id === player.id)!.fangraphsId = payload.playerId;
                await client.database.save(player);
            }
        }
    }
}
