import { Database } from "./loadDB";
import { EXTENDED_FILE, readJSON, scrapeFlorabase } from "./scrape/florabase";
import { CommonName, Datapoint, DatapointExtra, Result } from "./types/db";

const getItems = (db: Database, query: string): Datapoint[] => {
    const filter = db.names.filter(item => item.scientificName === query);
    return filter;
}

const getCommonItems = (db: Database, query: string): CommonName[] => {
    const filter = db.common.filter(item => item.common_name === query);
    return filter;
}

const findAccepted = (db: Database, originalDatapoint: Datapoint): Datapoint => {
    const toSearch = [originalDatapoint.scientificName];
    let searchIndex = 0;
    const addToSearch = (name: string) => {
        if (name && name !== "" && !toSearch.includes(name)) {
            toSearch.push(name);
        }
    }

    while (searchIndex < toSearch.length) {
        const datapoints = getItems(db, toSearch[searchIndex]);
        for (const datapoint of datapoints) {
            if (datapoint.taxonomicStatus === "accepted") {
                return datapoint;
            }
            if (datapoint.nameType === "common") {
                const commons = getCommonItems(db, datapoint.scientificName);
                for (const common of commons) {
                    addToSearch(common.scientific_name);
                }
            } else {
                addToSearch(datapoint.originalNameUsage);
                for (const nextName of db.names.filter(item => item.originalNameUsage === datapoint.scientificName)) {
                    addToSearch(nextName.scientificName);
                }
            }
        }
        searchIndex++;
    }

    return originalDatapoint;
}

const findAllAccepted = (db: Database, items: Datapoint[]): Datapoint[] => {
    const matches = [];
    for (const item of items) {
        matches.push(findAccepted(db, item));
    }
    return removeDuplicates(matches);
}

const removeDuplicates = (items: Datapoint[]): Datapoint[] => {
    const matches = [];
    const matchesScientific = [];
    for (const item of items) {
        if (!matchesScientific.includes(item.scientificName)) {
            matches.push(item);
            matchesScientific.push(item.scientificName);
        }
    }
    return matches;
}

const withExtra = async (datapoint: Datapoint, fetch = false, json = undefined): Promise<DatapointExtra> => {
    json = json || await readJSON(EXTENDED_FILE);
    return { ...datapoint, extra: json[datapoint.scientificName] || {} } as DatapointExtra;
}

const withExtras = async (datapoints: Datapoint[]): Promise<DatapointExtra[]> => {
    const json = await readJSON(EXTENDED_FILE);
    return Promise.all(datapoints.map((datapoint) => withExtra(datapoint, false, json)));
}

export const generateResult = async (db: Database, queryRaw: string): Promise<Result> => {
    const query = queryRaw.toLowerCase();

    let exactMatches = db.names.filter(species => species.canonicalName.toLowerCase() === query.toLowerCase());

    let exactMatch: Datapoint | undefined;
    for (const match of exactMatches) {
        if (match.nameType === "scientific") {
            exactMatch = match;
        }
    }
    exactMatch = exactMatch || exactMatches[0];

    let matches = [];

    if (exactMatch && exactMatch.nameType === "common") {
        const commons = getCommonItems(db, exactMatch.scientificName);
        if (commons.length === 1) {
            exactMatch = getItems(db, commons[0].scientific_name)[0];
        } else {
            matches = [];
            for (const common of commons) {
                const items = getItems(db, common.scientific_name);
                for (const item of items) {
                    matches.push(item);
                }
            }
            matches = removeDuplicates(matches);
            if (matches.length === 1) {
                exactMatch = matches[0];
            } else {
                return {
                    item: null,
                    contains: await withExtras(findAllAccepted(db, matches)),
                }
            }
        }
    }

    exactMatch = exactMatch ? findAccepted(db, exactMatch) : exactMatch;

    if (exactMatch && exactMatch.taxonRank === "Genus") {
        // For Genus, return members of the genus
        matches = db.names
            .filter(species => species.genericName === exactMatch.canonicalName && species.canonicalName !== exactMatch.canonicalName)
            .filter(species => (species.nameType === "scientific" && species.taxonomicStatus === "accepted") || species.nameType === "cultivar")
    } else {
        matches = db.names.filter(species => species.canonicalName.toLowerCase().includes(exactMatch ? exactMatch.canonicalName.toLowerCase() : query)).filter(species => !exactMatch || species.scientificName !== exactMatch.scientificName);
    }


    let exactMatchExtra = null

    if (exactMatch) {

        let json = await readJSON(EXTENDED_FILE);


        if (exactMatch && !json[exactMatch.scientificName] && exactMatch.nameType === "scientific") {
            try {
                await scrapeFlorabase(exactMatch.scientificName);
            } catch (error) {
                console.error(error);
            }

            json = await readJSON(EXTENDED_FILE);
        }

        exactMatchExtra = exactMatch ? { ...exactMatch, extra: json[exactMatch.scientificName] || {} } : null;
    }
    // matches = db.names.filter(species => species.canonicalName.toLowerCase().includes(query.toLowerCase())).filter(species => !exactMatch || species.scientificName !== exactMatch.scientificName);

    const result: Result = {
        item: exactMatchExtra,
        contains: await withExtras(matches),
    };

    return result;
}