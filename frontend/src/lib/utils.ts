import { DatapointExtra, DatapointSmall, TaxonRankSortOrderMap } from "../types/result";

/**
 * Concatenate an array of HTML classes, filtering out null classes to allow for
 * boolean or ternary operators to be used.
 *
 * @examples
 * ```ts
 * classNames("red", "blue") // "red blue"
 * classNames(true ? "red" : null) // "red"
 * classNames(true && "red") // "red"
 * ```
 *
 * @param classes An array of class names or non-truthy values
 *
 * @returns A single class name string.
 */
export const classNames = (
    ...classes: Array<NonNullable<string> | undefined | null | false>
): string => classes.filter((x) => !!x).join(" ");

export const titleCase = (title: string): string =>
    title
        .split(" ")
        .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
        .join(" ");

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
            datapoint.distributionRegions?.Australia?.native,
        acceptedName: datapoint.accepted?.apniName.canonicalName,
        pageviews: datapoint.extra.wikipedia?.pageviews,
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
