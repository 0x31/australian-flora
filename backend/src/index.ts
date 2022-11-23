import chalk from "chalk";

import { Database } from "./db/loadDB";
import { scrapeFlorabase } from "./scrape/florabase";
import { scrapeProcess } from "./scrape/scrapeQueue";
import { freeLock, sleep } from "./scrape/scrapeUtils";
import { scrapeWikipedia } from "./scrape/wikipedia";
import { searchEngine, withExtra } from "./server/searchEngine";
import { startServer } from "./server/server";

// The main entrypoint. Expects the `TYPE` environment variable to be one of
// "server", "scrape" or "profile".
// "server" starts listening
const main = async () => {
    // Free the extended data filelock if required.
    freeLock();

    // Load database (takes ~10 seconds)
    const db = await new Database().load();
    console.log(
        `Loaded ${chalk.blue(
            db.names.length + db.common.length + db.taxa.length
        )} items`
    );

    const RUN_SCRAPER: boolean = process.env.TYPE === "scrape";
    const PROFILE: boolean = process.env.TYPE === "profile";

    if (RUN_SCRAPER) {
        // Loop through a list of taxa for scraping.

        let toProcess = db.names
            .map((x) => withExtra(db, x))
            .filter(
                (name) =>
                    (name.apniName.nameType === "scientific" ||
                        name.apniName.nameType === "autonym") &&
                    (!name.extra.wikipedia?.timestamp ||
                        !name.extra.wikipedia.timestamp)
            );

        for (let i = 0; i < toProcess.length; i++) {
            const extended = toProcess[i];

            console.log(
                `Handling ${extended.apniName.taxonRank} ${chalk.blue(
                    extended.apniName.canonicalName
                )} - ${i + 1}/${toProcess.length} (${Math.floor(
                    100 * ((i + 1) / toProcess.length)
                )}%)`
            );

            let networkRequestMade = false;

            try {
                networkRequestMade =
                    (await scrapeFlorabase(
                        db,
                        extended.apniName.scientificName
                    )) || networkRequestMade;
                networkRequestMade =
                    (await scrapeWikipedia(
                        db,
                        extended.apniName.scientificName,
                        extended.apniName.canonicalName
                    )) || networkRequestMade;
            } catch (error) {
                console.error(error);
            }

            if (networkRequestMade) {
                console.log(`Sleeping for 1 second...`);
                await sleep(1000);
            }
        }
    } else if (PROFILE) {
        // Run a search for profiling.
        searchEngine(db, "Acacia");
    } else {
        // Start the HTTP server and the scraper queue.
        // If either of the server or the scraper stop, exit the program.
        scrapeProcess(db).catch((error) => {
            console.error(error);
            process.exit(1);
        });

        startServer(db).catch((error) => {
            console.error(error);
            process.exit(1);
        });
    }
};

main().catch((error) => {
    // Unhandled error.
    console.error(error);
    process.exit(1);
});
