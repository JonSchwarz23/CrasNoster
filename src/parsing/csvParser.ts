import * as fs from "fs";
import { parse } from "csv-parse";
import { CastingFunctions } from "../types";

export interface CsvParseInfo<T> {
    headers: string[];
    castingFunctions: CastingFunctions;
    path: string;
    handlePayloads: (payloads: T[]) => Promise<void>;
}

export class CSVParser<T> {
    private info: CsvParseInfo<T>;

    constructor(info: CsvParseInfo<T>) {
        this.info = info;
    }

    private parse(): Promise<T[]> {
        const fileContent = fs.readFileSync(this.info.path, { encoding: "utf-8" });
        const castingFunctions = this.info.castingFunctions;
        return new Promise<T[]>((resolve, reject) => {
            parse(
                fileContent,
                {
                    delimiter: ",",
                    relaxQuotes: true,
                    columns: this.info.headers,
                    fromLine: 2,
                    cast: (value, context) => {
                        if (castingFunctions[context.column]) {
                            return castingFunctions[context.column](value);
                        } else if (castingFunctions["default"]) {
                            return castingFunctions["default"](value);
                        }
                        return value;
                    },
                },
                (error, result: T[]) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                }
            );
        });
    }

    public async run() {
        let parsedPayloads = await this.parse();
        await this.info.handlePayloads(parsedPayloads);
    }
}
