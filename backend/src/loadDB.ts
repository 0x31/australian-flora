import neatCsv from "neat-csv";
import fs from "fs";

import { CommonName, Datapoint } from "./types/db";

const NAMES_PATH = "../../APNI-names-2020-03-30-3736.csv"
const COMMON_PATH = "../../APNI-common-names-2020-03-30-3750.csv"

const loadFile = (fileName: string) => new Promise<string>((resolve, reject) => {
    fs.readFile(__dirname + '/' + fileName, (err: Error, data: Buffer) => {
        if (err) {
            return reject(err);
        }
        resolve(data.toString());
    });
})

export class Database {

    public names: Datapoint[];
    public common: CommonName[];

    public load = async () => {
        this.names = await neatCsv(await loadFile(NAMES_PATH));
        this.common = await neatCsv(await loadFile(COMMON_PATH));
    }
}