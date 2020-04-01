
// import { explore } from "./explore";
import { Database } from "./loadDB";
// import { scrapeFlorabase } from "./scrape/florabase";
import { startServer } from "./server";

// import { Datapoint } from "./types/db";

const main = async () => {

    // console.log(
    //     await scrapeFlorabase("Thysanotus multiflorus R.Br.")
    // );

    // Load database (takes ~10 seconds)
    const db = new Database();
    await db.load();
    console.log(`Loaded ${db.names.length} items`);

    // explore(db);
    startServer(db);
}

main().then(console.log).catch(console.error)