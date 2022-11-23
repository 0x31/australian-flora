// prettier-ignore

export type NameType = "scientific" | "autonym" | "phrase-name" | "cultivar" | "hybrid-formula-parents-known" | "named-hybrid" | "cultivar-hybrid" | "intergrade" | "named-hybrid-autonym" | "hybrid-formula-unknown-2nd-parent" | "graft-chimera"
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
    | "8"
    | "10"
    | "20"
    | "30"
    | "40"
    | "50"
    | "60"
    | "70"
    | "80"
    | "90"
    | "100"
    | "110"
    | "120"
    | "130"
    | "140"
    | "150"
    | "160"
    | "170"
    | "180"
    | "190"
    | "200"
    | "210"
    | "220"
    | "230"
    | "240"
    | "500";
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
type DatasetName = "APNI" | "APC";
type License = "https://creativecommons.org/licenses/by/3.0/";

export enum DistributionStatusSingle {
    ["native"] = "native",
    ["naturalised"] = "naturalised",
    ["doubtfully naturalised"] = "doubtfully naturalised",
    ["uncertain origin"] = "uncertain origin",
    ["formerly naturalised"] = "formerly naturalised",
    ["presumed extinct"] = "presumed extinct",
}

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

type DistributionPair =
    | DistributionRegion
    | `${DistributionRegion} (${DistributionStatus})`;
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
    taxonID: string; // https://id.biodiversity.org.au/node/apni/2896366
    nameType: string; // scientific
    acceptedNameUsageID: string; // https://id.biodiversity.org.au/node/apni/2896366
    acceptedNameUsage: string; // Isopogon anemonifolius (Salisb.) Knight
    nomenclaturalStatus: string; //
    nomIlleg: string; // f
    nomInval: string; // f
    taxonomicStatus: string; // accepted
    proParte: string; // f
    scientificName: string; // Isopogon anemonifolius (Salisb.) Knight
    scientificNameID: string; // https://id.biodiversity.org.au/name/apni/83372
    canonicalName: string; // Isopogon anemonifolius
    scientificNameAuthorship: string; // (Salisb.) Knight
    parentNameUsageID: string; // https://id.biodiversity.org.au/taxon/apni/51445473
    taxonRank: TaxonRank; // Species
    taxonRankSortOrder: number; // 190
    kingdom: string; // Plantae
    class: string; // Equisetopsida
    subclass: string; // Magnoliidae
    family: string; // Proteaceae
    taxonConceptID: string; // https://id.biodiversity.org.au/instance/apni/782176
    nameAccordingTo: string; // "CHAH (2014), Australian Plant Census"
    nameAccordingToID: string; // https://id.biodiversity.org.au/reference/apni/53841
    taxonRemarks: string; //
    taxonDistribution: string; // NSW
    higherClassification: string; // Plantae|Charophyta|Equisetopsida|Magnoliidae|Proteanae|Proteales|Proteaceae|Isopogon|anemonifolius
    firstHybridParentName: string; //
    firstHybridParentNameID: string; //
    secondHybridParentName: string; //
    secondHybridParentNameID: string; //
    nomenclaturalCode: string; // ICN
    created: string; // 2005-11-08 12:32:44+11
    modified: string; // 2005-11-08 12:32:44+11
    datasetName: DatasetName; // APC
    dataSetID: string; // https://id.biodiversity.org.au/tree/51696737
    license: License; // http://creativecommons.org/licenses/by/3.0/
    ccAttributionIRI: string; // https://id.biodiversity.org.au/node/apni/289636
}

export type Taxonomy = { [rank in TaxonRank]?: string };

/**
 * A map of which results sholud be shown for each rank. Hard-coded so that it
 * can be tweaked, instead of comparing `TaxonRankSortOrder`.
 */
export const taxonRankChildren: {
    [taxonRank in TaxonRank]: TaxonRank[];
} = {
    Regio: ["Regnum"],
    Regnum: [
        "Division",
        "Classis",
        "Subclassis",
        "Superordo",
        "Ordo",
        "Subordo",
        "Familia",
    ],
    Division: [
        "Classis",
        "Subclassis",
        "Superordo",
        "Ordo",
        "Subordo",
        "Familia",
    ],
    Classis: ["Subclassis", "Superordo", "Ordo", "Subordo", "Familia"],
    Subclassis: ["Superordo", "Ordo", "Subordo", "Familia"],
    Superordo: ["Ordo", "Subordo", "Familia"],
    Ordo: ["Subordo", "Familia"],
    Subordo: ["Familia"],
    Familia: ["Subfamilia", "Tribus", "Subtribus", "Genus", "[infragenus]"],
    Subfamilia: ["Tribus", "Subtribus", "Genus", "[infragenus]"],
    Tribus: ["Subtribus", "Genus", "[infragenus]"],
    Subtribus: ["Genus", "[infragenus]"],
    Genus: [
        "Subgenus",
        "Sectio",
        "Subsectio",
        "Series",
        "Subseries",
        "Superspecies",
        "Species",
        "[infraspecies]",
        "[unranked]",
    ],
    Subgenus: [
        "Sectio",
        "Subsectio",
        "Series",
        "Subseries",
        "Superspecies",
        "Species",
        "[infraspecies]",
        "[unranked]",
    ],
    Sectio: [
        "Subsectio",
        "Series",
        "Subseries",
        "Superspecies",
        "Species",
        "[infraspecies]",
        "[unranked]",
    ],
    Subsectio: [
        "Series",
        "Subseries",
        "Superspecies",
        "Species",
        "[infraspecies]",
        "[unranked]",
    ],
    Series: [
        "Subseries",
        "Superspecies",
        "Species",
        "[infraspecies]",
        "[unranked]",
    ],
    Subseries: ["Superspecies", "Species", "[infraspecies]", "[unranked]"],
    Superspecies: ["Species", "[infraspecies]", "[unranked]"],
    Species: [
        "Subspecies",
        "Nothovarietas",
        "Varietas",
        "Subvarietas",
        "Forma",
        "Subforma",
        "[unranked]",
    ],
    Subspecies: ["Nothovarietas", "[unranked]"],
    Nothovarietas: ["Varietas", "[unranked]"],
    Varietas: ["Subvarietas", "[unranked]"],
    Subvarietas: ["Forma", "[unranked]"],
    Forma: ["Subforma", "[unranked]"],
    Subforma: ["[unranked]"],
    "[infragenus]": [],
    "[infraspecies]": [],
    "[unranked]": [],
};

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
