import { readFile } from "fs/promises";
import { OrderedMap } from "immutable";
import neatCsv from "neat-csv";

import { APC_TAXON, APNI_COMMON, APNI_NAMES, EXTENDED_FILE } from "../config";
import { readJSON, titleCase, writeToJSON } from "../scrape/scrapeUtils";
import { loadWikipedia } from "../scrape/wikipedia";
import { ApcTaxon, ApniCommonName, ApniName, DistributionMap, Taxonomy } from "../types/apni";
import { ExtraLayout } from "../types/result";
import { parseDistributionStatus, parseTaxonomy } from "./parseApcData";

// The backend currently creates in-memory maps from various CSV and JSON files,
// instead of using a proper SQL database. This was a fast way to get the
// backend up and running to test the frontend, but is not efficient or
// extensible, so will be refactored at some point.
export class Database {
    public extended: { [scientificName: string]: ExtraLayout } = {};
    public names: ApniName[] = [];
    public nativeNames: ApniName[] = [];
    // Map from scientific names to APNI row.
    public namesMap: OrderedMap<string, ApniName> = OrderedMap();
    public common: ApniCommonName[] = [];
    // Map from scientific names to list of common names.
    public commonMap: OrderedMap<string, string[]> = OrderedMap();
    public taxa: ApcTaxon[] = [];
    // Map from APNI scientific names to APC rows.
    public taxaMap: OrderedMap<string, ApcTaxon> = OrderedMap();
    public taxaCanonicalMap: OrderedMap<string, ApcTaxon> = OrderedMap();
    public isNativeMap: OrderedMap<string, DistributionMap> = OrderedMap();

    // Map from canonical name to taxonomy.
    public taxonomyMap: OrderedMap<string, Taxonomy> = OrderedMap();

    public wikipediaArticles: OrderedMap<string, string> = OrderedMap();

    public load = async () => {
        console.log(`Loading database`);
        this.names = await neatCsv(await readFile(APNI_NAMES));
        this.common = await neatCsv(await readFile(APNI_COMMON));
        this.taxa = await neatCsv(await readFile(APC_TAXON));
        this.extended = await readJSON(EXTENDED_FILE);

        await writeToJSON(EXTENDED_FILE, this.extended);

        this.wikipediaArticles = await loadWikipedia();

        // Create map from scientific names to a list of tidied common names
        // ordered by number of times the name appears.
        this.commonMap = this.common
            .reduce(
                (acc, row) =>
                    acc.set(row.scientific_name, [
                        ...(acc.get(row.scientific_name) || []),
                        titleCase(row.common_name),
                    ]),
                OrderedMap<string, string[]>()
            )
            // Check for hyphen duplicates (e.g. "Long-leaved Gum" and
            // "Long Leaved Gum"), favouring the hyphenated version.
            .map((commonNames: string[]): string[] => {
                const toRemove: string[] = [];
                for (const commonName of commonNames) {
                    const withoutHyphen = titleCase(
                        commonName.replace("-", " ")
                    );
                    if (
                        commonName.includes("-") &&
                        commonNames.includes(withoutHyphen)
                    ) {
                        toRemove.push(withoutHyphen);
                    }
                }
                return commonNames.filter(
                    (commonName) => !toRemove.includes(commonName)
                );
            })
            .map((commonNames: string[]): string[] => {
                // Sort by each name's frequency
                return commonNames
                    .reduce(
                        (acc, name) => acc.set(name, (acc.get(name) || 0) + 1),
                        OrderedMap<string, number>()
                    )
                    .sort()
                    .reverse()
                    .keySeq()
                    .toArray();
            });

        this.namesMap = this.names.reduce((acc, row) => {
            const existing = acc.get(row.scientificName) || row;
            return acc.set(
                row.scientificName,
                // Prioritise accepted rows.
                row.taxonomicStatus === "accepted" ? row : existing
            );
        }, OrderedMap<string, ApniName>());

        this.taxaMap = this.taxa.reduce((acc, row) => {
            const existing = acc.get(row.scientificName) || row;
            return acc.set(
                row.scientificName,
                // Prioritise accepted rows.
                row.taxonomicStatus === "accepted" ? row : existing
            );
        }, OrderedMap<string, ApcTaxon>());

        this.taxaCanonicalMap = this.taxa.reduce(
            (acc, row) =>
                acc.set(
                    row.canonicalName,
                    // Prioritise accepted rows.
                    row.taxonomicStatus === "accepted"
                        ? row
                        : acc.get(row.canonicalName) || row
                ),
            OrderedMap<string, ApcTaxon>()
        );

        this.isNativeMap = this.taxa.reduce((acc, row) => {
            const existing = acc.get(row.scientificName) || undefined;
            const value =
                row.taxonomicStatus === "accepted"
                    ? parseDistributionStatus(row.taxonDistribution)
                    : existing;
            return value ? acc.set(row.scientificName, value) : acc;
        }, OrderedMap<string, DistributionMap>());

        this.nativeNames = this.names.filter(
            (taxon) =>
                this.isNativeMap.get(taxon.scientificName, {
                    Australia: { native: true },
                } as DistributionMap).Australia?.native
        );

        this.taxonomyMap = this.taxa.reduce((acc, taxon) => {
            return acc.set(
                taxon.canonicalName,
                // If the taxon isn't accepted, prioritise previous values, falling back to this taxon
                (taxon.taxonomicStatus !== "accepted"
                    ? acc.get(taxon.canonicalName)
                    : undefined) ||
                    parseTaxonomy(
                        this,
                        taxon.higherClassification,
                        taxon.taxonRank
                    )
            );
        }, OrderedMap<string, Taxonomy>());

        return this;
    };
}

// const makeThumbnails = async () => {
//     const wikipediaImages = join(IMAGES_ORIGINAL_DIR, "wikipedia");
//     const wikipediaThumbnails = join(IMAGES_THUMBNAILS_DIR, "wikipedia");
//     const images = await readdir(wikipediaImages);

//     for (let i = 0; i < images.length; i++) {
//         const image = images[i];
//         const imagePath = join(wikipediaImages, image);
//         const thumbnailPath = join(wikipediaThumbnails, image);
//         console.log(
//             `${i} of ${images.length} (${Math.floor(
//                 (100 * i) / images.length + 1
//             )}) - ${image}`
//         );

//         // Save thumbnail.
//         await new Promise<void>((resolve, reject) =>
//             ImageMagick.resize(
//                 {
//                     srcPath: imagePath,
//                     dstPath: thumbnailPath,
//                     quality: 0.8,
//                     strip: true,
//                     width: 250,
//                     height: 250,
//                 },
//                 (error, _result) => {
//                     if (error) {
//                         return reject(error);
//                     }
//                     resolve();
//                 }
//             )
//         );
//     }
// };
