import { Value, ColumnRequest, Request, Response, SortOrder } from "@jonschwarz23/cras-noster-client";
import { runFilter } from "./filter";
import { sort } from "./sort";

export interface ColumnController<Entity, Parameters, ColumnType> {
    name: ColumnType;
    getValue: (entity: Entity, parameters: Parameters) => Value;
}

export type GetValue<Entity, ColumnRequestType> = (entity: Entity, columnRequest: ColumnRequestType) => Value;

export function buildResponse<Entity, Parameters, ColumnType extends string, ColumnRequestType extends ColumnRequest<Parameters, ColumnType, ColumnType>>(
    entities: Entity[],
    request: Request<ColumnRequestType>,
    getValue: GetValue<Entity, ColumnRequestType>
): Response {
    const headers: string[] = [];
    let data: Value[][] = [];

    for (const column of request.columnRequests) {
        headers.push(column.headerOverride || column.name);
    }

    for (const entity of entities) {
        const currentData: Value[] = [];
        let isFiltered = false;
        for (const column of request.columnRequests) {
            const value = getValue(entity, column);
            if (column.filter) {
                if (!runFilter(column.filter, value)) {
                    isFiltered = true;
                    break;
                }
            }
            currentData.push(value);
        }
        if (!isFiltered) {
            data.push(currentData);
        }
    }

    let sortIndex: number | undefined;
    let sortOrder: SortOrder | undefined;

    for (const [i, column] of request.columnRequests.entries()) {
        if (column.sort) {
            sortIndex = i;
            sortOrder = column.sort;
            break;
        }
    }

    if (sortIndex !== undefined) {
        console.log("here");
        sort(sortIndex, data, sortOrder);
    }

    if (request.amount) {
        const page = (request.page || 1) - 1;
        let start = 0 + page * request.amount;
        data = data.slice(start, start + request.amount);
    }

    return {
        headers,
        data,
    };
}
