import chalk from "chalk";

import { Database } from "../db/loadDB";
import { DatapointExtra } from "../types/result";
import { scrapeFlorabase } from "./florabase";
import { sleep } from "./scrapeUtils";
import { scrapeWikipedia } from "./wikipedia";

// Hacky global queue.
const queue: DatapointExtra[] = [];

export const addToQueue = (element: DatapointExtra) => {
    // Skip common names to avoid scraping unrelated pages.
    // TODO: Check the below name types.

    if (!element.extra.wikipedia?.link || !element.extra.florabase?.timestamp) {
        console.log(`Queue: adding ${element.apniName.canonicalName}`);
        queue.push(element);
    }
};

export const scrapeProcess = async (db: Database) => {
    while (true) {
        const result = queue.pop();

        if (result) {
            if (
                result.extra.wikipedia?.link &&
                result.extra.florabase?.timestamp
            ) {
                continue;
            }

            console.log(
                `Handling ${chalk.blue(result.apniName.canonicalName)} - ${
                    queue.length
                } items remaining in queue)`
            );

            let networkRequestMade = false;

            try {
                networkRequestMade =
                    (await scrapeFlorabase(
                        db,
                        result.apniName.scientificName
                    )) || networkRequestMade;
            } catch (error) {
                console.error(error);
            }

            try {
                networkRequestMade =
                    (await scrapeWikipedia(
                        db,
                        result.apniName.scientificName,
                        result.apniName.canonicalName
                    )) || networkRequestMade;
            } catch (error) {
                console.error(error);
            }

            if (networkRequestMade) {
                console.log(`Sleeping...`);
                await sleep(1000);
            }
        }

        await sleep(1000);
    }
};
