// export interface SortController<Entity> {
//     sort: (order: SortOrder, entities: Entity[]) => Entity[];
// }

import { SortOrder, Value } from "@jonschwarz23/cras-noster-client";

// export function isSortable<Entity>(object: any): object is SortController<Entity> {
//     return "sort" in object;
// }

// export const simpleSort = <Entity>(field: keyof Entity) => {
//     return (order: SortOrder, entities: Entity[]) => {
//         entities.sort((a, b) => {
//             if (a[field] > b[field]) return 1;
//             if (a[field] < b[field]) return -1;
//             return 0;
//         });
//         return entities;
//     };
// };

// export const simpleSortGetValue = <Entity>(getValue: (entity: Entity) => any) => {
//     return (order: SortOrder, entities: Entity[]) => {
//         entities.sort((a, b) => {
//             if (getValue(a) > getValue(b)) return 1;
//             if (getValue(a) < getValue(b)) return -1;
//             return 0;
//         });
//         return entities;
//     };
// };

export const sort = (index: number, data: Value[][], sortOrder: SortOrder = SortOrder.Asc) => {
    data.sort((aRow, bRow) => {
        const a = aRow[index];
        const b = bRow[index];

        if (a > b) return 1 * sortOrder;
        if (b > a) return -1 * sortOrder;
        else return 0;
    });
};
