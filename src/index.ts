import "reflect-metadata";
import { FantasyTeam } from "./entities/FantasyTeam";
import fantasyTeams from "../data/fantasyTeams.json";
import { client } from "./client";
import { CSVParser } from "./parsing/csvParser";
import { playerParseInfo } from "./parsing/playerParseInfo";
import mlbTeams from "../data/mlbTeams.json";
import { Team } from "./entities/Team";
import { FangraphsOffProjParseInfo, FangraphsPitProjParseInfo, HistoricalFangraphsPitProjParseInfo } from "./parsing/fangraphsProjParseInfo";
import express from "express";
import cors from "cors";
import { PlayerRequest } from "@jonschwarz23/cras-noster-client";
import { buildPlayerResponse } from "./columns/playerColumns";
import { FangraphsIdsParseInfo } from "./parsing/fangraphsIdsParseInfo";

const main = async () => {
    await client.init();
    for (const team of fantasyTeams.teams) {
        const newTeam = new FantasyTeam(team.name, team.owner, team.acronym);
        await client.database.save(newTeam);
    }

    console.log("Fantasy teams saved");

    for (const team of mlbTeams.teams) {
        const newTeam = new Team(team.name, team.abbreviations);
        await client.database.save(newTeam);
    }

    console.log("MLB teams saved");

    const parser = new CSVParser(playerParseInfo);
    await parser.run();

    console.log("Players saved");

    const fangraphsBattersIdsParser = new CSVParser(new FangraphsIdsParseInfo("/app/data/fangraphsBattersIds.csv"));
    await fangraphsBattersIdsParser.run();

    const fangraphsPitchersIdsParser = new CSVParser(new FangraphsIdsParseInfo("/app/data/fangraphsPitchersIds.csv"));
    await fangraphsPitchersIdsParser.run();

    console.log("Fangraphs IDs saved");

    const steamerProjectionsBattersParser = new CSVParser(new FangraphsOffProjParseInfo("/app/data/steamerProjectionsBatters.csv", "Steamer"));
    await steamerProjectionsBattersParser.run();

    const steamerProjectionsPitchersParser = new CSVParser(new FangraphsPitProjParseInfo("/app/data/steamerProjectionsPitchers.csv", "Steamer"));
    await steamerProjectionsPitchersParser.run();

    console.log("Steamer projections saved");

    const projectionsBattersParser2022 = new CSVParser(new FangraphsOffProjParseInfo("/app/data/2022ProjectionsBatters.csv", "2022"));
    await projectionsBattersParser2022.run();

    const projectionsPitchersParser2022 = new CSVParser(new HistoricalFangraphsPitProjParseInfo("/app/data/2022ProjectionsPitchers.csv", "2022"));
    await projectionsPitchersParser2022.run();

    console.log("2022 projections saved");

    const atcProjectionsBattersParser = new CSVParser(new FangraphsOffProjParseInfo("/app/data/atcProjectionsBatters.csv", "ATC"));
    await atcProjectionsBattersParser.run();

    const atcProjectionsPitchersParser = new CSVParser(new FangraphsPitProjParseInfo("/app/data/atcProjectionsPitchers.csv", "ATC"));
    await atcProjectionsPitchersParser.run();

    console.log("ATC projections saved");

    const batXProjectionsBattersParser = new CSVParser(new FangraphsOffProjParseInfo("/app/data/batXProjectionsBatters.csv", "BATX"));
    await batXProjectionsBattersParser.run();

    const batXProjectionsPitchersParser = new CSVParser(new FangraphsPitProjParseInfo("/app/data/batXProjectionsPitchers.csv", "BATX"));
    await batXProjectionsPitchersParser.run();

    console.log("BATX projections saved");

    console.log("Complete");

    await new Promise((resolve) => setTimeout(resolve, 600000));
};

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/player/request", async (req, res) => {
    const request = req.body as PlayerRequest;
    console.log(request);
    const response = await buildPlayerResponse(request);
    res.send(response);
});

app.post("/test", (req, res) => {
    console.log(req.body);
    res.send(req.body);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

main();
