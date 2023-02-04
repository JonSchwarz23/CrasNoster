import {
    EmptyParameters,
    PlayerColumnRequest,
    PlayerColumnType,
    PlayerRequest,
    YearParameters,
    Response,
    SourceParameters,
} from "@jonschwarz23/cras-noster-client";
import { client } from "../client";
import { Player } from "../entities/Player";
import { buildResponse, ColumnController, GetValue } from "./columns";

const NameController: ColumnController<Player, EmptyParameters, PlayerColumnType> = {
    name: "Name",
    getValue: (player: Player, _: EmptyParameters) => player.name,
};

const AbbreviationController: ColumnController<Player, EmptyParameters, PlayerColumnType> = {
    name: "Abbreviation",
    getValue: (player: Player, _: EmptyParameters) => player.team?.abbreviations[0] || "FA",
};

const SalaryController: ColumnController<Player, EmptyParameters, PlayerColumnType> = {
    name: "Salary",
    getValue: (player: Player, _: EmptyParameters) => player.salary,
};

const AgeController: ColumnController<Player, EmptyParameters, PlayerColumnType> = {
    name: "Salary",
    getValue: (player: Player, _: EmptyParameters) => player.age,
};

const BattingAverageController: ColumnController<Player, YearParameters, PlayerColumnType> = {
    name: "BattingAverage",
    getValue: (player: Player, parameters: YearParameters) => parameters.year,
};

const ContractController: ColumnController<Player, EmptyParameters, PlayerColumnType> = {
    name: "Contract",
    getValue: (player: Player, _: EmptyParameters) => player.contract,
};

const FantasyTeamController: ColumnController<Player, EmptyParameters, PlayerColumnType> = {
    name: "FantasyTeam",
    getValue: (player: Player, _: EmptyParameters) => player.fantasyTeam?.acronym || "FA",
};

const PositionController: ColumnController<Player, EmptyParameters, PlayerColumnType> = {
    name: "Position",
    getValue: (player: Player, _: EmptyParameters) => player.position,
};

const RankController: ColumnController<Player, EmptyParameters, PlayerColumnType> = {
    name: "Rank",
    getValue: (player: Player, _: EmptyParameters) => player.rankOverall,
};

const BatterTotalProjValueController: ColumnController<Player, SourceParameters, PlayerColumnType> = {
    name: "BatterTotalProjValue",
    getValue: (player: Player, parameters: SourceParameters) =>
        player.offensiveProjectionValues?.find((value) => value.source === parameters.source)?.total || 0,
};

const PitcherTotalProjValueController: ColumnController<Player, SourceParameters, PlayerColumnType> = {
    name: "PitcherTotalProjValue",
    getValue: (player: Player, parameters: SourceParameters) => player.pitcherProjectionValues?.find((value) => value.source === parameters.source)?.total || 0,
};

const getValue: GetValue<Player, PlayerColumnRequest> = (player: Player, columnRequest: PlayerColumnRequest) => {
    switch (columnRequest.name) {
        case "Name":
            return NameController.getValue(player, columnRequest.parameters);
        case "BattingAverage":
            return BattingAverageController.getValue(player, columnRequest.parameters);
        case "Abbreviation":
            return AbbreviationController.getValue(player, columnRequest.parameters);
        case "Salary":
            return SalaryController.getValue(player, columnRequest.parameters);
        case "Age":
            return AgeController.getValue(player, columnRequest.parameters);
        case "Contract":
            return ContractController.getValue(player, columnRequest.parameters);
        case "FantasyTeam":
            return FantasyTeamController.getValue(player, columnRequest.parameters);
        case "Position":
            return PositionController.getValue(player, columnRequest.parameters);
        case "Rank":
            return RankController.getValue(player, columnRequest.parameters);
        case "BatterTotalProjValue":
            return BatterTotalProjValueController.getValue(player, columnRequest.parameters);
        case "PitcherTotalProjValue":
            return PitcherTotalProjValueController.getValue(player, columnRequest.parameters);
    }
};

export async function buildPlayerResponse(request: PlayerRequest): Promise<Response> {
    let players: Player[] = await client.database.getAllPlayers();
    console.log(players.length);
    return buildResponse(players, request, getValue);
}
