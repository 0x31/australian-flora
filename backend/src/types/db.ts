type NameType = | 'common' | 'scientific' | 'named hybrid' | 'autonym' | 'phrase name' | 'cultivar' | 'hybrid formula parents known' | 'cultivar hybrid' | 'intergrade' | 'vernacular' | 'hybrid formula unknown 2nd parent' | 'graft/chimera' | 'named hybrid autonym';
type TaxonomicStatus = 'unplaced' | 'included' | 'accepted' | 'excluded';
type NomenclaturalStatus = '[n/a]' | '' | 'nom. inval., nom. nud.' | 'nom. inval.' | 'orth. var.' | 'nom. illeg., nom. superfl.' | 'nom. inval., opera utique oppressa' | 'nom. cons.' | 'isonym' | 'manuscript' | 'nom. illeg.' | 'nom. inval., pro syn.' | 'nom. inval., nom. subnud.' | 'nomina utique rejicienda' | 'nom. superfl.' | 'nom. rej.' | 'nom. alt.' | 'nom. inval., nom. prov.' | 'nom. illeg., nom. rej.' | 'nom. et orth. cons.' | 'orth. cons.' | 'nom. inval., nom. alt.' | 'nom. alt., nom. illeg' | 'nom. et typ. cons.' | 'nom. cons., nom. alt.' | 'nom. inval., tautonym' | 'nom. cons., orth. cons.';
type Autonym = 'f' | 't';
type Hybrid = 'f' | 't';
type Cultivar = 'f' | 't';
type Formula = 'f' | 't';
type Scientific = 'f' | 't';
type NomInval = 'f' | 't';
type NomIlleg = 'f' | 't';
type NamePublishedInYear = 0 | number;
type NameInstanceType = '' | 'tax. nov.' | 'primary reference' | 'comb. nov.' | 'autonym' | 'nom. nov.' | 'comb. et stat. nov.' | 'nom. et stat. nov.' | 'implicit autonym' | 'explicit autonym' | 'stat. nov.';
type Kingdom = '' | 'Plantae';
type InfraspecificEpithet = '';
type TaxonRank = '[n/a]' | 'Genus' | 'Species' | 'Forma' | 'Varietas' | 'Subspecies' | 'Familia' | 'Ordo' | 'Sectio' | 'Subgenus' | '[unranked]' | 'Subseries' | 'Series' | 'Subsectio' | '[infragenus]' | '[infraspecies]' | 'Subvarietas' | 'Subtribus' | 'Superordo' | 'Subfamilia' | 'Tribus' | 'Subordo' | 'Subclassis' | 'Subforma' | 'morphological var.' | 'Superspecies' | 'Division' | 'Nothovarietas' | 'Classis' | 'Regio' | 'Regnum';
type TaxonRankSortOrder = '500' | '120' | '190' | '230' | '210' | '200' | '80' | '60' | '140' | '130' | '170' | '160' | '150' | '220' | '110' | '50' | '90' | '100' | '70' | '40' | '240' | '260' | '180' | '20' | '30' | '8' | '10';
type TaxonRankAbbreviation = '[n/a]' | 'gen.' | 'sp.' | 'f.' | 'var.' | 'subsp.' | 'fam.' | 'ordo' | 'sect.' | 'subg.' | '[unranked]' | 'subser.' | 'ser.' | 'subsect.' | '[infragenus]' | '[infrasp.]' | 'subvar.' | 'subtrib.' | 'superordo' | 'subfam.' | 'trib.' | 'subordo' | 'subcl.' | 'subf.' | 'morph.' | 'supersp.' | 'div.' | 'nothovar.' | 'cl.' | 'regio' | 'reg.';
type NomenclaturalCode = 'ICN' | string;
type DatasetName = 'APNI' | string;
type License = 'http://creativecommons.org/licenses/by/3.0/' | string;

export interface Datapoint {
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

export interface CommonName {
    common_name_id: string,
    common_name: string,
    instance_id: string,
    citation: string,
    scientific_name_id: string,
    scientific_name: string,
    datasetName: string,
    license: string,
    ccAttributionIRI: string,
}

// export enum ExactType {
//     Genus = "genus",
//     Species = "species",
//     Subspecies = "subspecies",
//     Cultivar = "cultivar",
//     Other = "other"
// }

export interface DatapointExtra extends Datapoint {
    extra: {
        florabase: {
            timestamp: number,
            id: number,
            profile: string,
            image: string,
        }
    }
}

export interface Result {
    // type: ExactType,
    item: DatapointExtra | null,
    contains: DatapointExtra[],
}
