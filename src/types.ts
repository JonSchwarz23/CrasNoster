export type CastingFunctions = {
    [key: string]: (value: string) => any;
};

export type ColumnDefinition = {
    name: string;
    sortable: boolean;
};
