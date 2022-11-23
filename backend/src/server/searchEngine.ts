import levenshtein from "fast-levenshtein";
import { List, OrderedMap } from "immutable";

import { Database } from "../db/loadDB";
import { addToQueue } from "../scrape/scrapeQueue";
import { ApniName, Taxonomy, taxonRankChildren, TaxonRankSortOrderMap } from "../types/apni";
import { DatapointExtra, DatapointSmall, Result } from "../types/result";

/** Resolve the accepted ApniName for a given ApniName (specified in) */
export const getAccepted = (
    db: Database,
    originalDatapoint: ApniName
): ApniName => {
    const apc = db.taxaMap.get(originalDatapoint.scientificName);
    return (apc && db.namesMap.get(apc.acceptedNameUsage)) || originalDatapoint;
};

/**
 * If the results for a common name contain a genus in addition to other taxa
 * within that genus, only return the genus.
 * @example
 * // When searching for "Wattle":
 * filterSubresults(db, [Acacia, Acacia cognata, Acacia podalyriifolia, ...])
 * > [Acacia]
 */
const filterSubresults = (names: DatapointExtra[]): DatapointExtra[] => {
    const genuses = names
        .filter((taxon) => taxon.apniName.taxonRank === "Genus")
        .map((taxon) => taxon.apniName.canonicalName);
    const filteredTaxa = names.filter(
        (taxon) =>
            taxon.apniName.taxonRank === "Genus" ||
            !genuses.includes(taxon.apniName.genericName)
    );

    return filteredTaxa;
};

/**
 * Remove duplicates from an array of DatapointExtra, including considering
 * accepted synonyms and an optinal parent taxon.
 */
const filterDuplicates = (
    results: DatapointExtra[],
    parent?: ApniName
): DatapointExtra[] => {
    const scientificNames = results.map((row) => row.apniName.scientificName);

    let toReturn = OrderedMap<string, DatapointExtra>();
    for (let result of results) {
        if (
            // Not already added, or added but result is accepted.
            (!toReturn.has(result.apniName.scientificName) ||
                result.apniName.taxonomicStatus === "accepted") &&
            // Accepted version isn't/won't be added
            (!result.accepted ||
                !scientificNames.includes(
                    result.accepted.apniName.scientificName
                )) &&
            // Isn't the parent
            (!parent ||
                result.apniName.scientificName !== parent.scientificName)
        ) {
            toReturn = toReturn.set(result.apniName.scientificName, result);
        }
    }

    return filterSubresults(toReturn.valueSeq().toArray());
};

const getTaxonomy = (
    db: Database,
    apniName: ApniName
): Taxonomy | undefined => {
    const firstHybridParent = apniName.firstHybridParentName
        ? db.namesMap.get(apniName.firstHybridParentName)
        : undefined;
    const secondHybridParent = apniName.secondHybridParentName
        ? db.namesMap.get(apniName.secondHybridParentName)
        : undefined;

    return (
        // Exact matches
        db.taxonomyMap.get(apniName.canonicalName) ||
        // Cultivars
        db.taxonomyMap.get(apniName.canonicalName.replace(/ '.*'/, "")) ||
        // Hybrids
        (firstHybridParent &&
            db.taxonomyMap.get(firstHybridParent.canonicalName)) ||
        (secondHybridParent &&
            db.taxonomyMap.get(secondHybridParent.canonicalName)) ||
        // Other
        db.taxonomyMap.get(
            apniName.genericName + " " + apniName.specificEpithet
        )
    );
};

/**
 * Load any additional information about an ApniName row, including common names,
 * the APC table row and information fetched from various sources.
 */
export const withExtra = (
    db: Database,
    apniName: ApniName,
    fetch = false
): DatapointExtra => {
    const extra = db.extended[apniName.scientificName];

    const commonNames = db.commonMap.get(apniName.scientificName);
    const apcMatch = db.taxaMap.get(apniName.scientificName);

    const accepted: ApniName | undefined =
        apcMatch && apcMatch.acceptedNameUsage !== apcMatch.scientificName
            ? db.namesMap.get(apcMatch.acceptedNameUsage)
            : undefined;

    const taxonomy = getTaxonomy(db, apniName);

    const firstHybridParent = apniName.firstHybridParentName
        ? db.namesMap.get(apniName.firstHybridParentName)
        : undefined;
    const secondHybridParent = apniName.secondHybridParentName
        ? db.namesMap.get(apniName.secondHybridParentName)
        : undefined;

    const extended: DatapointExtra = {
        apniName: apniName,
        extra: extra || {},
        commonNames,
        matchedName: (commonNames || [])[0],
        apcTaxon: apcMatch,
        accepted: accepted ? withExtra(db, accepted) : undefined,
        distributionRegions: db.isNativeMap.get(apniName.scientificName),
        taxonomy,
        firstHybridParent: firstHybridParent
            ? withExtra(db, firstHybridParent)
            : undefined,
        secondHybridParent: secondHybridParent
            ? withExtra(db, secondHybridParent)
            : undefined,
    };

    if (fetch) {
        addToQueue(extended);
    }

    return extended;
};

export const toDatapointSmall = (datapoint: DatapointExtra): DatapointSmall => {
    return {
        scientificName: datapoint.apniName.scientificName,
        canonicalName: datapoint.apniName.canonicalName,
        taxonRank: datapoint.apniName.taxonRank,
        taxonomicStatus: datapoint.apniName.taxonomicStatus,
        cultivar: datapoint.apniName.cultivar === "t",
        hybrid: datapoint.apniName.hybrid === "t",
        native:
            !datapoint.distributionRegions ||
            datapoint.distributionRegions?.Australia?.native === true,
        acceptedName: datapoint.accepted?.apniName.canonicalName,
        pageviews: datapoint.extra.wikipedia?.pageviews,
        matchedName: datapoint.matchedName,
        // Priotirise Florabase for larger
        thumbnail:
            TaxonRankSortOrderMap[datapoint.apniName.taxonRank] <
            TaxonRankSortOrderMap.Species
                ? datapoint.extra.florabase?.image?.thumbnail ||
                  datapoint.accepted?.extra.florabase?.image?.thumbnail ||
                  datapoint.extra.wikipedia?.image?.thumbnail ||
                  datapoint.accepted?.extra.wikipedia?.image?.thumbnail
                : datapoint.extra.wikipedia?.image?.thumbnail ||
                  datapoint.accepted?.extra.wikipedia?.image?.thumbnail ||
                  datapoint.extra.florabase?.image?.thumbnail ||
                  datapoint.accepted?.extra.florabase?.image?.thumbnail,
    };
};

/** Call withExtra for an ApniName and its related ApniNames. */
const withExtraRelated = (
    db: Database,
    match: ApniName,
    related: ApniName[]
) => {
    return {
        ...withExtra(db, match, true),
        related: filterDuplicates(
            related.map((taxon) => withExtra(db, taxon)),
            match
        ).map((taxon) => toDatapointSmall(taxon)),
    };
};

/**
 * Compare a query to APNI names and common names using the levenshtein string
 * comparion heuristic.
 */
export const findByLevenshtein = (db: Database, query: string): ApniName[] => {
    // Compare distance to floor(log2(query.length)), to allow further distances
    // for longer names.
    const distanceCutoff = (query: string) =>
        Math.floor(Math.log(query.length) / Math.log(2));

    let similarApniNames = db.names
        .filter(
            (taxon) =>
                levenshtein.get(
                    taxon.canonicalName.toLowerCase(),
                    query.toLowerCase()
                ) <= distanceCutoff(query)
        )
        .map((taxon) => getAccepted(db, taxon));

    let similarApniCommonNames = db.common
        .filter(
            (taxon) =>
                levenshtein.get(
                    taxon.common_name.toLowerCase(),
                    query.toLowerCase()
                ) <= distanceCutoff(query)
        )
        .map((common) => db.namesMap.get(common.scientific_name))
        .filter(Boolean)
        .map((taxon) => getAccepted(db, taxon!));

    // Sort by levenshtein distance to the query.
    return List([...similarApniNames, ...similarApniCommonNames])
        .map((taxon): [ApniName, number] => [
            taxon,
            levenshtein.get(
                taxon.canonicalName.toLowerCase(),
                query.toLowerCase()
            ),
        ])
        .sortBy(([taxon, distance]) => distance)
        .map(([taxon, distance]) => taxon)
        .toArray();
};

/**
 * Handle returning a single taxum.
 * TODO: Refactor this function to not hard-code each taxon rank.
 */
export const handleExactMatch = (db: Database, exactMatch: ApniName) => {
    const matchTaxonomy = getTaxonomy(db, exactMatch);

    if (!matchTaxonomy) {
        return withExtra(db, exactMatch);
    }

    // Find the taxa that should be shown as belonging to the matched taxon,
    // by comparing taxonomies and ranks.
    return withExtraRelated(
        db,
        exactMatch,
        db.names.filter((taxon) => {
            const taxonomy = getTaxonomy(db, taxon);
            return (
                taxonomy &&
                // Only inluclude accepted/scientific/cultivars
                (((taxon.taxonomicStatus === "accepted" ||
                    taxon.taxonomicStatus === exactMatch.taxonomicStatus) &&
                    (taxon.nameType === "scientific" ||
                        taxon.nameType === "autonym" ||
                        taxon.hybrid === "t" ||
                        taxon.formula === "t")) ||
                    taxon.cultivar === "t") &&
                // If the exact match is a species, compare genus and specific epithet.
                (taxonRankChildren[exactMatch.taxonRank] ===
                taxonRankChildren["Species"]
                    ? taxon.specificEpithet === exactMatch.specificEpithet &&
                      taxonomy["Genus"] === matchTaxonomy["Genus"]
                    : // Otherwise compare the taxonomy at the exact match's rank
                      matchTaxonomy[exactMatch.taxonRank] &&
                      taxonomy[exactMatch.taxonRank] ===
                          matchTaxonomy[exactMatch.taxonRank]) &&
                // Hard-coded maps of what subranks should be included
                taxonRankChildren[exactMatch.taxonRank].includes(
                    taxon.taxonRank
                )
            );
        })
    );
};

/** Handle returning a result for either a single ApniName or for an array. */
const createResult = (
    db: Database,
    results: ApniName | ApniName[],
    resultType: Result["resultType"] = "scientific"
): Result => {
    if (Array.isArray(results)) {
        return {
            resultType,
            result: filterDuplicates(
                results.map((taxon) => withExtra(db, taxon))
            ).map((taxon) => toDatapointSmall(taxon)),
        };
    } else {
        return {
            resultType,
            result: handleExactMatch(db, results),
        };
    }
};

/**
 * Return the search results for the provided query, performing a number of
 * various search methods.
 *
 * @param db A Database instance
 * @param userQuery The query to return search results for.
 * @returns A Result instance containing either a single datapoint or an array.
 */
export const searchEngine = (db: Database, userQuery: string): Result => {
    const query = userQuery.toLowerCase();

    let exactMatches = db.names.filter(
        (taxon) =>
            taxon.canonicalName.toLowerCase() === query.toLowerCase() ||
            taxon.scientificName.toLowerCase() === query.toLowerCase()
    );

    // If there's one exact match, return it.
    if (exactMatches.length === 1) {
        return createResult(db, exactMatches[0]);
    }

    // If there's one accepted exact match, return it.
    const acceptedExactMatches = exactMatches.filter(
        (match) => match.taxonomicStatus === "accepted"
    );

    if (acceptedExactMatches.length === 1) {
        return createResult(db, acceptedExactMatches[0]);
    }

    // If there's one included exact match, return it.
    const includedExactMatches = exactMatches.filter(
        (match) => match.taxonomicStatus === "included"
    );

    if (includedExactMatches.length === 1) {
        return createResult(db, includedExactMatches[0]);
    }

    // If there are multiple exact matches, return them.
    if (exactMatches.length > 0) {
        return createResult(db, exactMatches);
    }

    // Restrict additional searches to queries with more than two characters,
    // to avoid large and slow searches.
    if (query.length > 2) {
        // Check for matches against common names.
        const commonExactMatches = db.common
            .filter((name) => {
                const commonName = name.common_name.toLowerCase();
                return (
                    // e.g. "Wattle" -> "Acacia"
                    commonName === query ||
                    commonName.includes(query + " ") ||
                    commonName.includes(" " + query) ||
                    commonName.includes(query + "-") ||
                    commonName.includes("-" + query)
                );
            })
            .map((name) => db.namesMap.get(name.scientific_name))
            .filter(Boolean) as ApniName[];

        // Check for taxa names containing the query in any part of the result.
        let apniNameContains = db.names
            .filter((taxon) =>
                taxon.canonicalName.toLowerCase().includes(query)
            )
            .map((taxon) => getAccepted(db, taxon));

        // Return combined result.
        const matches = [...commonExactMatches, ...apniNameContains];
        if (matches.length) {
            return createResult(db, matches, "common");
        }

        // Common name containing the query in any part of the result.
        const commonMatches = db.common
            .filter((name) => name.common_name.toLowerCase().includes(query))
            .map((name) => db.namesMap.get(name.scientific_name))
            .filter(Boolean) as ApniName[];

        if (commonMatches.length) {
            return createResult(db, commonMatches, "common");
        }

        // Names similar to the query, accounting for typos/mispellings.
        const levenshteinMatches = findByLevenshtein(db, query);
        if (levenshteinMatches.length) {
            return createResult(db, levenshteinMatches, "similar");
        }
    }

    // No results.
    return { resultType: "scientific", result: [] };
};
