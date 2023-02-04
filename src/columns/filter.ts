import { ContainsParameters, EqualsParameters, FilterRequest, Value } from "@jonschwarz23/cras-noster-client";

//Filters

interface Filter<FilterParameters> {
    isValid: (value: Value, parameters: FilterParameters) => boolean;
}

interface ComplexFilter {
    isValid: (results: boolean[]) => boolean;
}

interface UnaryComplexFilter {
    isValid: (result: boolean) => boolean;
}

const EqualsFilter: Filter<EqualsParameters> = {
    isValid: <Entity, ColumnParameters, ColumnType>(value: Value, parameters: EqualsParameters): boolean => {
        return value === parameters.value;
    },
};

const ContainsFilter: Filter<ContainsParameters> = {
    isValid: <Entity, ColumnParameters, ColumnType>(value: Value, parameters: ContainsParameters): boolean => {
        return (value as String).includes(parameters.value);
    },
};

const AndFilter: ComplexFilter = {
    isValid(results) {
        for (const result of results) {
            if (!result) return false;
        }

        return true;
    },
};

const OrFilter: ComplexFilter = {
    isValid(results) {
        for (const result of results) {
            if (result) return true;
        }

        return false;
    },
};

const NotFilter: UnaryComplexFilter = {
    isValid(result) {
        return !result;
    },
};

//Main run function

export const runFilter = <ColumnType>(filterRequest: FilterRequest, value: Value): boolean => {
    if (filterRequest.name === "Equals") {
        return EqualsFilter.isValid(value, filterRequest.parameters);
    }

    if (filterRequest.name === "Contains") {
        return ContainsFilter.isValid(value, filterRequest.parameters);
    }

    if (filterRequest.name === "Not") {
        return NotFilter.isValid(runFilter(filterRequest.request, value));
    }

    const results = filterRequest.requests.map((request) => runFilter(request, value));

    if (filterRequest.name === "And") {
        return AndFilter.isValid(results);
    }

    if (filterRequest.name === "Or") {
        return OrFilter.isValid(results);
    }

    return true;
};
