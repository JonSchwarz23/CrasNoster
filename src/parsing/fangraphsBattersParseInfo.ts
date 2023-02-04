// import { client } from "../client";
// import { fromPercentageToNumber, keepString, toNumber } from "./csvConverters";
// import { csvParseInfo } from "./csvParser";
// import { Player } from "../entities/Player";

// export type fangraphsBattersParseCSV = {
//     name: string;
//     team: string;
//     games: number;
//     plateAppearances: number;
//     homeRuns: number;
//     runs: number;
//     runsBatterIn: number;
//     stolenBases: number;
//     walkRate: number;
//     strikeoutRate: number;
//     isolatedPower: number;
//     battingAverageOnBallsInPlay: number;
//     average: number;
//     onBasePercentage: number;
//     sluggingPercentage: number;
//     weightedOnBaseAverage: number;
//     expectedWeightedOnBaseAverage: number;
//     weightedRunsCreatedPlus: number;
//     baseRuns: number;
//     offense: number;
//     defense: number;
//     winsAboveReplacement: number;
//     playerId: string;
// };

// const fangraphsBattersParseInfo: csvParseInfo<fangraphsBattersParseCSV> = {
//     path: "/app/data/fangraphsBatters.csv",
//     headers: [
//         "name",
//         "team",
//         "games",
//         "plateAppearances",
//         "homeRuns",
//         "runs",
//         "runsBatterIn",
//         "stolenBases",
//         "walkRate",
//         "strikeoutRate",
//         "isolatedPower",
//         "battingAverageOnBallsInPlay",
//         "average",
//         "onBasePercentage",
//         "sluggingPercentage",
//         "weightedOnBaseAverage",
//         "expectedWeightedOnBaseAverage",
//         "weightedRunsCreatedPlus",
//         "baseRuns",
//         "offense",
//         "defense",
//         "winsAboveReplacement",
//         "playerId",
//     ],
//     castingFunctions: {
//         default: toNumber,
//         name: keepString,
//         team: keepString,
//         walkRate: fromPercentageToNumber,
//         strikeoutRate: fromPercentageToNumber,
//         playerId: keepString,
//     },
//     handlePayload: async (csv: fangraphsBattersParseCSV) => {
//         const players = await client.database.manager.find(Player, {
//             where: {
//                 name: csv.name,
//                 team: csv.team,
//             },
//         });

//         if (players.length > 1) {
//             console.log("Too many players");
//             console.log("csv: ", csv);
//             console.log("players: ", players);
//         } else if (players.length === 0) {
//             console.log("No players found");
//             console.log("csv: ", csv);
//         } else {
//             const player = players[0];
//             player.fangraphsId = csv.playerId;
//             await client.database.save(player);
//         }
//     },
// };

// export { fangraphsBattersParseInfo };
