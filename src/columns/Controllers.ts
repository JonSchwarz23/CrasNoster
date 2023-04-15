import { Value } from "@jonschwarz23/cras-noster-client";
import { Player } from "../entities/Player";

const parameters = {
    string: "string",
    number: "number",
} as const;

type MyParameters<T extends string = string> = Readonly<Record<T, typeof parameters[keyof typeof parameters]>>;
const MyParameters: MyParameters = {
    test: parameters.string,
} as const;

MyParameters.test;
MyParameters.hello = parameters.number;

type ParametersWithDataOfMyParameters = ParametersWithData<typeof MyParameters>;

type ParametersWithData<T extends MyParameters<string>> = {
    [key in keyof T]: T[key] extends "string" ? string : T[key] extends "number" ? number : never;
};

const test: MyParameters<string> = {
    name: parameters.string,
};

type Controller<T extends MyParameters<string>, U> = {
    parameters: T;
    resolver: (entity: U, parameters: ParametersWithData<T>) => Value;
};

const buildController = <T extends MyParameters<string>, U>(parameters: T, resolver: (entity: U, parameters: ParametersWithData<T>) => Value) => {
    return {
        parameters,
        resolver,
    };
};

type Controllers<T, U extends string> = Record<U, Controller<MyParameters<string>, T>>;
type test = ParametersWithData<MyParameters<string>>;
type whatIWant = Record<string, number>;
type test2 = ParametersWithData<{ age: "number" }>;
const age = buildController({ age: parameters.number }, (player: Player, parameters) => player.name + parameters.age);
type age = typeof age;
//   ^?

const controllers: Controllers<Player, string> = {
    name: buildController({}, (player: Player, parameters) => player.name),
    age: buildController({ age: parameters.number }, (player: Player, parameters) => player.name + parameters.age),
    test: buildController({ age: parameters.number, name: parameters.string }, (player: Player, parameters) => player.name + parameters.age + parameters.name),
};

type t = typeof controllers;
//   ^?

type Requests<T extends Controllers<any, string>> = {
    [key in keyof T]: {
        name: key;
        parameters: Parameters<T[key]["resolver"]>[1];
    };
}[keyof T];

type playerControllers = Controllers<Player, string>;
type requests = Requests<playerControllers>;

class ColumnBuilder<U, T extends Controllers<U, string> = Controllers<U, string>> {
    constructor(private controllers: T) {}

    run(entities: U[], requests: Requests<T>[]) {
        for (const entity of entities) {
            for (const request of requests) {
                const value = this.controllers[request.name].resolver(entity, request.parameters);
            }
        }
    }

    getRequests(): Record<string, MyParameters<string>> {
        const requests: Record<string, MyParameters<string>> = {};
        for (const [name, controller] of Object.entries(this.controllers)) {
            requests[name] = controller.parameters;
        }
        return requests;
    }
}

const cb = new ColumnBuilder<Player, typeof controllers>(controllers);

cb.run(
    [],
    [
        { name: "age", parameters: { age: 5 } },
        { name: "name", parameters: {} },
    ]
);
