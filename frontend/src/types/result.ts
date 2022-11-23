type NameType =
    | "scientific"
    | "autonym"
    | "phrase-name"
    | "cultivar"
    | "hybrid-formula-parents-known"
    | "named-hybrid"
    | "cultivar-hybrid"
    | "intergrade"
    | "named-hybrid-autonym"
    | "hybrid-formula-unknown-2nd-parent"
    | "graft-chimera";
type TaxonomicStatus = "accepted" | "unplaced" | "included" | "excluded";
type NomenclaturalStatus =
    | ""
    | "nom. inval."
    | "orth. var."
    | "nom. alt."
    | "isonym"
    | "[n/a]"
    | "nom. inval., pro syn."
    | "nom. illeg."
    | "nom. inval., nom. nud."
    | "nom. cons."
    | "nom. illeg., nom. superfl."
    | "nom. superfl."
    | "nom. inval., nom. prov."
    | "nom. rej."
    | "manuscript"
    | "nom. inval., nom. subnud."
    | "nom. inval., opera utique oppressa"
    | "nom. illeg., nom. rej."
    | "nom. et typ. cons."
    | "nom. et orth. cons."
    | "nom. inval., nom. alt."
    | "nom. inval., tautonym"
    | "nom. inval., nom. confus."
    | "nomina utique rejicienda"
    | "orth. cons."
    | "nom. alt., nom. illeg"
    | "nom. cons., nom. alt.";
type Autonym = "f" | "t";
type Hybrid = "f" | "t";
type Cultivar = "f" | "t";
type Formula = "f" | "t";
type Scientific = "t" | "f";
type NomInval = "f" | "t";
type NomIlleg = "f" | "t";
type NamePublishedInYear = number;
type NameInstanceType =
    | "tax. nov."
    | "autonym"
    | "primary reference"
    | "comb. nov."
    | "comb. et stat. nov."
    | ""
    | "nom. nov."
    | "nom. et stat. nov."
    | "explicit autonym"
    | "implicit autonym"
    | "stat. nov.";
type Kingdom = "Plantae";
type InfraspecificEpithet = string;
export type TaxonRank =
    | "Subspecies"
    | "Species"
    | "Varietas"
    | "Genus"
    | "Sectio"
    | "Forma"
    | "Subgenus"
    | "[unranked]"
    | "Subsectio"
    | "Subfamilia"
    | "[infraspecies]"
    | "Series"
    | "Tribus"
    | "Subvarietas"
    | "Subforma"
    | "[infragenus]"
    | "Superspecies"
    | "Subseries"
    | "Subtribus"
    | "Nothovarietas"
    | "Familia"
    | "Subordo"
    | "Ordo"
    | "Superordo"
    | "Subclassis"
    | "Division"
    | "Classis"
    | "Regio"
    | "Regnum";
type TaxonRankSortOrder =
    | "200"
    | "190"
    | "210"
    | "120"
    | "140"
    | "230"
    | "130"
    | "500"
    | "150"
    | "90"
    | "160"
    | "100"
    | "220"
    | "240"
    | "180"
    | "170"
    | "110"
    | "80"
    | "70"
    | "60"
    | "50"
    | "40"
    | "20"
    | "30"
    | "8"
    | "10";
type TaxonRankAbbreviation =
    | "subsp."
    | "sp."
    | "var."
    | "gen."
    | "sect."
    | "f."
    | "subg."
    | "[unranked]"
    | "subsect."
    | "subfam."
    | "[infrasp.]"
    | "ser."
    | "trib."
    | "subvar."
    | "subf."
    | "[infragenus]"
    | "supersp."
    | "subser."
    | "subtrib."
    | "nothovar."
    | "fam."
    | "subordo"
    | "ordo"
    | "superordo"
    | "subcl."
    | "div."
    | "cl."
    | "regio"
    | "reg.";
type NomenclaturalCode = "ICN";
type DatasetName = "APNI";
type License = "https://creativecommons.org/licenses/by/3.0/";

export type DistributionStatusSingle =
    | "native"
    | "naturalised"
    | "doubtfully naturalised"
    | "uncertain origin"
    | "formerly naturalised"
    | "presumed extinct";

export type DistributionStatus =
    | DistributionStatusSingle
    | `${DistributionStatusSingle} and ${DistributionStatusSingle}`
    | `${DistributionStatusSingle} and ${DistributionStatusSingle} and ${DistributionStatusSingle}`;

export enum DistributionRegion {
    CaI = "CaI",
    MDI = "MDI",
    HI = "HI",
    CSI = "CSI",
    AR = "AR",
    MI = "MI",
    CoI = "CoI",
    ChI = "ChI",
    LHI = "LHI",
    NI = "NI",
    ACT = "ACT",
    Tas = "Tas",
    SA = "SA",
    NT = "NT",
    Vic = "Vic",
    NSW = "NSW",
    Qld = "Qld",
    WA = "WA",
}

// type DistributionPair =
//     | DistributionRegion
//     | `${DistributionRegion} (${DistributionStatus})`;
// type Distribution = "" | DistributionPair | `${DistributionPair}, ${Distribution}`;

export type DistributionMap = {
    [region in DistributionRegion | "Australia"]?: {
        [status in DistributionStatusSingle]?: boolean;
    };
};

export interface ApniName {
    image?: string;
    scientificName: string; // "Anemone-leaved Isopogon",
    scientificNameHTML: string; // "<common><name data-id='451532'><element>Anemone-leaved Isopogon</element></name></common>",
    canonicalName: string; // "Anemone-leaved Isopogon",
    canonicalNameHTML: string; // "<common><name data-id='451532'><element>Anemone-leaved Isopogon</element></name></common>",
    nameElement: string; // "Anemone-leaved Isopogon",
    scientificNameID: string; // "https://id.biodiversity.org.au/name/apni/451532",
    nameType: NameType; // "common",
    taxonomicStatus: TaxonomicStatus; // "unplaced",
    nomenclaturalStatus: NomenclaturalStatus; // "[n/a]",
    scientificNameAuthorship: string; // "",
    cultivarEpithet: string; // "",
    autonym: Autonym; // "f",
    hybrid: Hybrid; // "f",
    cultivar: Cultivar; // "f",
    formula: Formula; // "f",
    scientific: Scientific; // "f",
    nomInval: NomInval; // "f",
    nomIlleg: NomIlleg; // "f",
    namePublishedIn: string; // "unknown",
    namePublishedInYear: NamePublishedInYear; // 0,
    nameInstanceType: NameInstanceType; // "",
    originalNameUsage: string; // "",
    originalNameUsageID: string; // "",
    typeCitation: string; // "",
    kingdom: Kingdom; // "",
    family: string; // "",
    genericName: string; // "",
    specificEpithet: string; // "",
    infraspecificEpithet: InfraspecificEpithet; // "",
    taxonRank: TaxonRank; // "[n/a]",
    taxonRankSortOrder: TaxonRankSortOrder; // 500,
    taxonRankAbbreviation: TaxonRankAbbreviation; // "[n/a]",
    firstHybridParentName: string; // "",
    firstHybridParentNameID: string; // "",
    secondHybridParentName: string; // "",
    secondHybridParentNameID: string; // "",
    created: string; // "2012-05-18 00:00:00+10",
    modified: string; // "2012-05-18 00:00:00+10",
    nomenclaturalCode: NomenclaturalCode; // "ICN",
    datasetName: DatasetName; // "APNI",
    license: License; // "http://creativecommons.org/licenses/by/3.0/",
    ccAttributionIRI: string; // "https://id.biodiversity.org.au/name/apni/451532"

    nameAccordingTo?: String;
}

export interface ApniCommonName {
    common_name_id: string;
    common_name: string;
    instance_id: string;
    citation: string;
    scientific_name_id: string;
    scientific_name: string;
    datasetName: string;
    license: string;
    ccAttributionIRI: string;
}

export interface ApcTaxon {
    taxonID: string; // "https://id.biodiversity.org.au/node/apni/2896366";
    nameType: string; // "scientific";
    acceptedNameUsageID: string; // "https://id.biodiversity.org.au/node/apni/2896366";
    acceptedNameUsage: string; // "Isopogon anemonifolius (Salisb.) Knight";
    nomenclaturalStatus: string; // "";
    taxonomicStatus: string; // "f";
    proParte: string; // "f";
    scientificName: string; // "accepted";
    scientificNameID: string; // "f";
    canonicalName: string; // "Isopogon anemonifolius (Salisb.) Knight";
    scientificNameAuthorship: string; // "https://id.biodiversity.org.au/name/apni/83372";
    parentNameUsageID: string; // "Isopogon anemonifolius";
    taxonRank: string; // "(Salisb.) Knight";
    taxonRankSortOrder: string; // "https://id.biodiversity.org.au/taxon/apni/51445473";
    kingdom: string; // "Species";
    class: number; // 190;
    subclass: string; // "Plantae";
    family: string; // "Equisetopsida";
    created: string; // "Magnoliidae";
    modified: string; // "Proteaceae";
    datasetName: string; // "https://id.biodiversity.org.au/instance/apni/782176";
    taxonConceptID: string; // "CHAH (2014), Australian Plant Census";
    nameAccordingTo: string; // "https://id.biodiversity.org.au/reference/apni/53841";
    nameAccordingToID: string; // "";
    taxonRemarks: string; // "NSW";
    taxonDistribution: string; // "Plantae|Charophyta|Equisetopsida|Magnoliidae|Proteanae|Proteales|Proteaceae|Isopogon|anemonifolius";
    higherClassification: string; // "";
    firstHybridParentName: string; // "";
    firstHybridParentNameID: string; // "";
    secondHybridParentName: string; // "";
    secondHybridParentNameID: string; // "ICN";
    nomenclaturalCode: string; // "2005-11-08 12:32:44+11";
    license: string; // "2005-11-08 12:32:44+11";
    ccAttributionIRI: string; // "APC";
}

export const TaxonRankSortOrderMap: {
    [taxonRank in TaxonRank]: number;
} = {
    Regio: 8,
    Regnum: 10,
    Division: 20,
    Classis: 30,
    Subclassis: 40,
    Superordo: 50,
    Ordo: 60,
    Subordo: 70,
    Familia: 80,
    Subfamilia: 90,
    Tribus: 100,
    Subtribus: 110,
    Genus: 120,
    Subgenus: 130,
    Sectio: 140,
    Subsectio: 150,
    Series: 160,
    Subseries: 170,
    Superspecies: 180,
    Species: 190,
    Subspecies: 200,
    Nothovarietas: 210,
    Varietas: 210,
    Subvarietas: 220,
    Forma: 230,
    Subforma: 240,
    "[infragenus]": 500,
    "[infraspecies]": 500,
    "[unranked]": 500,
};

// export enum ExactType {
//     Genus = "genus",
//     Species = "species",
//     Subspecies = "subspecies",
//     Cultivar = "cultivar",
//     Other = "other"
// }

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
    apniCommonNames?: ApniCommonName[];
    apcTaxon?: ApcTaxon;
    extra: ExtraLayout;
    related?: DatapointSmall[];
    accepted?: DatapointExtra;
    commonNames?: string[];
    matchedName?: string;
    distributionRegions?: DistributionMap;
    firstHybridParent?: DatapointExtra;
    secondHybridParent?: DatapointExtra;
}

export interface DatapointSmall {
    scientificName: string;
    canonicalName: string;
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
