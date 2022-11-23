import {
    DistributionMap,
    DistributionRegion,
    DistributionStatus,
    DistributionStatusSingle,
    Taxonomy,
    TaxonRank,
} from "../types/apni";
import { Database } from "./loadDB";

// Parse a distribution status string into a `DistributionMap` object.
// @example
// parseDistributionStatus("ACT (naturalised), NSW (native and naturalised)")
// {
//   ACT: { naturalised: true },
//   NSW: { native: true, naturalised: true },
//   Australia: { native: true, naturalised: true },
// }
export const parseDistributionStatus = (
    distributionStatus: string
): DistributionMap => {
    // Get map of status for each region.
    const regionStatuses = distributionStatus
        .split(", ")
        .filter((s) => s !== "")
        .sort()
        .map((location) => {
            const [, region, , statusString] =
                location.match(/([A-Za-z]*)( \((.*)\))?/) || [];

            const statuses = (
                statusString
                    ? statusString.split(" and ")
                    : (["native"] as DistributionStatus[])
            ).reduce(
                (acc, status) => ({ ...acc, [status]: true }),
                {} as {
                    [status in DistributionStatusSingle]: boolean;
                }
            );

            return {
                region: region as DistributionRegion,
                statuses,
            };
        })
        .reduce(
            (acc, { region, statuses }) => ({
                ...acc,
                [region]: statuses,
            }),
            {} as DistributionMap
        );

    // Get list of statuses across each region. If the distributionStatus is empty,
    // assume that it is native in Australia.
    const statusesList =
        distributionStatus === ""
            ? ["native"]
            : ([] as string[]).concat(
                  ...Object.values(regionStatuses).map((region) =>
                      Object.keys(region).filter(
                          (status) => region[status as DistributionStatusSingle]
                      )
                  )
              );

    const combinedDistribution = statusesList.reduce(
        (acc, status) => ({ ...acc, [status]: true }),
        {} as DistributionMap["Australia"]
    );

    return {
        ...regionStatuses,
        ["Australia"]: {
            ...combinedDistribution,
            native:
                combinedDistribution?.native ||
                combinedDistribution?.["presumed extinct"],
        },
    };
};

// subspecies?: string;
// varietas?: string;
// subvarietas?: string;
// forma?: string;
// subforma?: string;

// sectio?: string;
// subsectio?: string;
// series?: string;
// tribus?: string;
// superspecies?: string;
// subseries?: string;
// subtribus?: string;
// nothovarietas?: string;

export const parseTaxonomy = (
    db: Database,
    higherClassification: string,
    taxonRank: TaxonRank
): Taxonomy => {
    const split = higherClassification.split("|");

    const taxonomy: Taxonomy = {};

    for (let i = 0; i < split.length; i++) {
        const taxonName = split[i];

        if (i === split.length - 1 && taxonRank === "Varietas") {
            taxonomy.Varietas = taxonName;
        } else if (i === split.length - 1 && taxonRank === "Subspecies") {
            taxonomy.Subspecies = taxonName;
        } else {
            const taxon = db.taxaCanonicalMap.get(taxonName);
            if (!taxon) {
                continue;
            }
            taxonomy[taxon.taxonRank] = taxonName;
        }
    }

    if (taxonRank === "Varietas") {
        taxonomy.Varietas = split[9];
    } else if (taxonRank === "Subspecies") {
        taxonomy.Subspecies = split[9];
    }

    return taxonomy;
};
