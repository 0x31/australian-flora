import { Datapoint } from "./types/db";

export const explore = (db: Datapoint[]) => {
    console.log(db[0]);

    const set_scientificName = new Map<string, number>();
    const set_scientificNameHTML = new Map<string, number>();
    const set_canonicalName = new Map<string, number>();
    const set_canonicalNameHTML = new Map<string, number>();
    const set_nameElement = new Map<string, number>();
    const set_scientificNameID = new Map<string, number>();
    const set_nameType = new Map<string, number>();
    const set_taxonomicStatus = new Map<string, number>();
    const set_nomenclaturalStatus = new Map<string, number>();
    const set_scientificNameAuthorship = new Map<string, number>();
    const set_cultivarEpithet = new Map<string, number>();
    const set_autonym = new Map<string, number>();
    const set_hybrid = new Map<string, number>();
    const set_cultivar = new Map<string, number>();
    const set_formula = new Map<string, number>();
    const set_scientific = new Map<string, number>();
    const set_nomInval = new Map<string, number>();
    const set_nomIlleg = new Map<string, number>();
    const set_namePublishedIn = new Map<string, number>();
    const set_namePublishedInYear = new Map<number, number>();
    const set_nameInstanceType = new Map<string, number>();
    const set_originalNameUsage = new Map<string, number>();
    const set_originalNameUsageID = new Map<string, number>();
    const set_typeCitation = new Map<string, number>();
    const set_kingdom = new Map<string, number>();
    const set_family = new Map<string, number>();
    const set_genericName = new Map<string, number>();
    const set_specificEpithet = new Map<string, number>();
    const set_infraspecificEpithet = new Map<string, number>();
    const set_taxonRank = new Map<string, number>();
    const set_taxonRankSortOrder = new Map<string, number>();
    const set_taxonRankAbbreviation = new Map<string, number>();
    const set_firstHybridParentName = new Map<string, number>();
    const set_firstHybridParentNameID = new Map<string, number>();
    const set_secondHybridParentName = new Map<string, number>();
    const set_secondHybridParentNameID = new Map<string, number>();
    const set_nomenclaturalCode = new Map<string, number>();
    const set_datasetName = new Map<string, number>();
    const set_license = new Map<string, number>();

    for (const entry of db) {
        if (entry.nameType === "graft/chimera") {
            console.log(entry);
        }
        if (set_scientificName.get(entry.scientificName) > 1) {
            console.log(entry.scientificName);
        }
        set_scientificName.set(entry.scientificName, set_scientificName.get(entry.scientificName) + 1 || 1);
        set_scientificNameHTML.set(entry.scientificNameHTML, set_scientificNameHTML.get(entry.scientificNameHTML) + 1 || 1);
        set_canonicalName.set(entry.canonicalName, set_canonicalName.get(entry.canonicalName) + 1 || 1);
        set_canonicalNameHTML.set(entry.canonicalNameHTML, set_canonicalNameHTML.get(entry.canonicalNameHTML) + 1 || 1);
        set_nameElement.set(entry.nameElement, set_nameElement.get(entry.nameElement) + 1 || 1);
        set_scientificNameID.set(entry.scientificNameID, set_scientificNameID.get(entry.scientificNameID) + 1 || 1);
        set_nameType.set(entry.nameType, set_nameType.get(entry.nameType) + 1 || 1); // "common",
        set_taxonomicStatus.set(entry.taxonomicStatus, set_taxonomicStatus.get(entry.taxonomicStatus) + 1 || 1); // "unplaced",
        set_nomenclaturalStatus.set(entry.nomenclaturalStatus, set_nomenclaturalStatus.get(entry.nomenclaturalStatus) + 1 || 1); // "[n/a]",
        set_scientificNameAuthorship.set(entry.scientificNameAuthorship, set_scientificNameAuthorship.get(entry.scientificNameAuthorship) + 1 || 1); // "",
        set_cultivarEpithet.set(entry.cultivarEpithet, set_cultivarEpithet.get(entry.cultivarEpithet) + 1 || 1); // "",
        set_autonym.set(entry.autonym, set_autonym.get(entry.autonym) + 1 || 1); // "f",
        set_hybrid.set(entry.hybrid, set_hybrid.get(entry.hybrid) + 1 || 1); // "f",
        set_cultivar.set(entry.cultivar, set_cultivar.get(entry.cultivar) + 1 || 1); // "f",
        set_formula.set(entry.formula, set_formula.get(entry.formula) + 1 || 1); // "f",
        set_scientific.set(entry.scientific, set_scientific.get(entry.scientific) + 1 || 1); // "f",
        set_nomInval.set(entry.nomInval, set_nomInval.get(entry.nomInval) + 1 || 1); // "f",
        set_nomIlleg.set(entry.nomIlleg, set_nomIlleg.get(entry.nomIlleg) + 1 || 1); // "f",
        set_namePublishedIn.set(entry.namePublishedIn, set_namePublishedIn.get(entry.namePublishedIn) + 1 || 1); // "unknown",
        set_namePublishedInYear.set(entry.namePublishedInYear, set_namePublishedInYear.get(entry.namePublishedInYear) + 1 || 1); // 0,
        set_nameInstanceType.set(entry.nameInstanceType, set_nameInstanceType.get(entry.nameInstanceType) + 1 || 1); // "",
        set_originalNameUsage.set(entry.originalNameUsage, set_originalNameUsage.get(entry.originalNameUsage) + 1 || 1); // "",
        set_originalNameUsageID.set(entry.originalNameUsageID, set_originalNameUsageID.get(entry.originalNameUsageID) + 1 || 1); // "",
        set_typeCitation.set(entry.typeCitation, set_typeCitation.get(entry.typeCitation) + 1 || 1); // "",
        set_kingdom.set(entry.kingdom, set_kingdom.get(entry.kingdom) + 1 || 1); // "",
        set_family.set(entry.family, set_family.get(entry.family) + 1 || 1); // "",
        set_genericName.set(entry.genericName, set_genericName.get(entry.genericName) + 1 || 1); // "",
        set_specificEpithet.set(entry.specificEpithet, set_specificEpithet.get(entry.specificEpithet) + 1 || 1); // "",
        set_infraspecificEpithet.set(entry.infraspecificEpithet, set_infraspecificEpithet.get(entry.infraspecificEpithet) + 1 || 1); // "",
        set_taxonRank.set(entry.taxonRank, set_taxonRank.get(entry.taxonRank) + 1 || 1); // "[n/a]",
        set_taxonRankSortOrder.set(entry.taxonRankSortOrder, set_taxonRankSortOrder.get(entry.taxonRankSortOrder) + 1 || 1); // 500,
        set_taxonRankAbbreviation.set(entry.taxonRankAbbreviation, set_taxonRankAbbreviation.get(entry.taxonRankAbbreviation) + 1 || 1); // "[n/a]",
        set_firstHybridParentName.set(entry.firstHybridParentName, set_firstHybridParentName.get(entry.firstHybridParentName) + 1 || 1); // "",
        set_firstHybridParentNameID.set(entry.firstHybridParentNameID, set_firstHybridParentNameID.get(entry.firstHybridParentNameID) + 1 || 1); // "",
        set_secondHybridParentName.set(entry.secondHybridParentName, set_secondHybridParentName.get(entry.secondHybridParentName) + 1 || 1); // "",
        set_secondHybridParentNameID.set(entry.secondHybridParentNameID, set_secondHybridParentNameID.get(entry.secondHybridParentNameID) + 1 || 1); // "",
        set_nomenclaturalCode.set(entry.nomenclaturalCode, set_nomenclaturalCode.get(entry.nomenclaturalCode) + 1 || 1); // "ICN",
        set_datasetName.set(entry.datasetName, set_datasetName.get(entry.datasetName) + 1 || 1); // "APNI",
        set_license.set(entry.license, set_license.get(entry.license) + 1 || 1); // "http://creativecommons.org/licenses/by/3.0/",
    }

    const print = (name: string, set: Map<string | number, number>) => {
        console.log(name, set.size > 100 ? `TOO MANY ITEMS (${set.size})` : set);
    }

    // console.log(set_cultivarEpithet);

    print("set_scientificName", set_scientificName);
    print("set_scientificNameHTML", set_scientificNameHTML);
    print("set_canonicalName", set_canonicalName);
    print("set_canonicalNameHTML", set_canonicalNameHTML);
    print("set_nameElement", set_nameElement);
    print("set_scientificNameID", set_scientificNameID);

    print("set_nameType", set_nameType);
    print("set_taxonomicStatus", set_taxonomicStatus);
    print("set_nomenclaturalStatus", set_nomenclaturalStatus);
    // print("set_scientificNameAuthorship", set_scientificNameAuthorship);
    // print("set_cultivarEpithet", set_cultivarEpithet);
    print("set_autonym", set_autonym);
    print("set_hybrid", set_hybrid);
    print("set_cultivar", set_cultivar);
    print("set_formula", set_formula);
    print("set_scientific", set_scientific);
    print("set_nomInval", set_nomInval);
    print("set_nomIlleg", set_nomIlleg);
    // print("set_namePublishedIn", set_namePublishedIn);
    print("set_namePublishedInYear", set_namePublishedInYear);
    print("set_nameInstanceType", set_nameInstanceType);
    // print("set_originalNameUsage", set_originalNameUsage);
    // print("set_originalNameUsageID", set_originalNameUsageID);
    // print("set_typeCitation", set_typeCitation);
    print("set_kingdom", set_kingdom);
    // print("set_family", set_family);
    // print("set_genericName", set_genericName);
    // print("set_specificEpithet", set_specificEpithet);
    print("set_infraspecificEpithet", set_infraspecificEpithet);
    print("set_taxonRank", set_taxonRank);
    print("set_taxonRankSortOrder", set_taxonRankSortOrder);
    print("set_taxonRankAbbreviation", set_taxonRankAbbreviation);
    // print("set_firstHybridParentName", set_firstHybridParentName);
    // print("set_firstHybridParentNameID", set_firstHybridParentNameID);
    // print("set_secondHybridParentName", set_secondHybridParentName);
    // print("set_secondHybridParentNameID", set_secondHybridParentNameID);
    print("set_nomenclaturalCode", set_nomenclaturalCode);
    print("set_datasetName", set_datasetName);
    print("set_license", set_license);

}