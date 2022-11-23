import { ApcTaxon, ApniName, DistributionMap, Taxonomy, TaxonRank } from "./apni";

export interface ExtraLayout {
    florabase?: {
        timestamp?: number;

        image?: {
            original: string;
            thumbnail: string;
            large: string;
        };
        link?: string;
        florabaseId?: string | number;
    };
    gardeningWithAngus?: {
        timestamp?: number;

        title?: string;
        link?: string;
        plaintext?: string;
    };
    wikipedia?: {
        timestamp?: number;

        link?: string;
        image?: {
            original: string;
            thumbnail: string;
            large: string;
        };
        imageCaption?: string;
        title?: string;
        plaintext?: string;
        pageviews?: number;
    };
}

export interface DatapointExtra {
    apniName: ApniName;
    apcTaxon?: ApcTaxon;
    extra: ExtraLayout;
    related?: DatapointSmall[];
    accepted?: DatapointExtra;
    commonNames?: string[];
    matchedName?: string;
    distributionRegions?: DistributionMap;
    taxonomy?: Taxonomy;
    firstHybridParent?: DatapointExtra;
    secondHybridParent?: DatapointExtra;
}

export interface DatapointSmall {
    scientificName?: string;
    canonicalName?: string;
    thumbnail?: string;
    acceptedName?: string;
    taxonRank: TaxonRank;
    taxonomicStatus: string;
    cultivar?: boolean;
    hybrid?: boolean;
    native?: boolean;
    pageviews?: number;
    matchedName?: string;
}

export type Result = {
    resultType: "scientific" | "common" | "synonym" | "similar";
    result: DatapointExtra | DatapointSmall[];
};
