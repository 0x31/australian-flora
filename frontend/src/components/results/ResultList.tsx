import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useMemo, useState } from "react";

import { classNames } from "../../lib/utils";
import { DatapointSmall, TaxonRank } from "../../types/result";
import { ResultCards } from "./ResultCard";

const rank = (list: DatapointSmall[], rank: TaxonRank) => {
    return list.filter((row) => row.taxonRank === rank);
};

/**
 * Show a list of taxa, splitting them into various taxonomy ranks.
 *
 * TODO: There's a lot of hard-coding here which should be refactored to be
 * more concise.
 */
export const ResultList: React.FC<{
    rows: DatapointSmall[];
    showAll?: boolean;
}> = ({ rows, showAll }) => {
    const sorted = // Sort by Wikipedia pageviews
        rows.sort((a, b) =>
            !b.native && a.native
                ? -1
                : !a.native && b.native
                ? 1
                : a.pageviews
                ? b.pageviews
                    ? b.pageviews - a.pageviews
                    : -1
                : b.pageviews
                ? 1
                : b.thumbnail && !a.thumbnail
                ? 1
                : -1
        );

    const allRows = useMemo(() => {
        return sorted;
    }, [sorted]);

    const regnumRows = useMemo(() => rank(sorted, "Regnum"), [sorted]);
    const divisionRows = useMemo(() => rank(sorted, "Division"), [sorted]);
    const classisRows = useMemo(() => rank(sorted, "Classis"), [sorted]);
    const subclassisRows = useMemo(() => rank(sorted, "Subclassis"), [sorted]);
    const superordoRows = useMemo(() => rank(sorted, "Superordo"), [sorted]);
    const ordoRows = useMemo(() => rank(sorted, "Ordo"), [sorted]);
    const subordoRows = useMemo(() => rank(sorted, "Subordo"), [sorted]);
    const familiaRows = useMemo(() => rank(sorted, "Familia"), [sorted]);
    const subfamiliaRows = useMemo(() => rank(sorted, "Subfamilia"), [sorted]);
    const tribusRows = useMemo(() => rank(sorted, "Tribus"), [sorted]);
    const subtribusRows = useMemo(() => rank(sorted, "Subtribus"), [sorted]);
    const genusRows = useMemo(() => rank(sorted, "Genus"), [sorted]);
    const subgenusRows = useMemo(() => rank(sorted, "Subgenus"), [sorted]);
    const sectioRows = useMemo(() => rank(sorted, "Sectio"), [sorted]);
    const subsectioRows = useMemo(() => rank(sorted, "Subsectio"), [sorted]);
    const seriesRows = useMemo(() => rank(sorted, "Series"), [sorted]);
    const subseriesRows = useMemo(() => rank(sorted, "Subseries"), [sorted]);
    const superspeciesRows = useMemo(
        () => rank(sorted, "Superspecies"),
        [sorted]
    );
    const speciesRows = useMemo(() => rank(sorted, "Species"), [sorted]);
    const subspeciesRows = useMemo(() => rank(sorted, "Subspecies"), [sorted]);
    const nothovarietasRows = useMemo(
        () => rank(sorted, "Nothovarietas"),
        [sorted]
    );
    const varietasRows = useMemo(() => rank(sorted, "Varietas"), [sorted]);
    const subvarietasRows = useMemo(
        () => rank(sorted, "Subvarietas"),
        [sorted]
    );
    const formaRows = useMemo(() => rank(sorted, "Forma"), [sorted]);
    const subformaRows = useMemo(() => rank(sorted, "Subforma"), [sorted]);

    const cultivarsRows = useMemo(() => {
        return sorted.filter((row) => row.cultivar);
    }, [sorted]);
    const hybridsRows = useMemo(() => {
        return sorted.filter((row) => row.hybrid);
    }, [sorted]);
    const handledRows = useMemo(() => {
        return [
            ...regnumRows,
            ...divisionRows,
            ...classisRows,
            ...subclassisRows,
            ...superordoRows,
            ...ordoRows,
            ...subordoRows,
            ...familiaRows,
            ...subfamiliaRows,
            ...tribusRows,
            ...subtribusRows,
            ...genusRows,
            ...subgenusRows,
            ...sectioRows,
            ...subsectioRows,
            ...seriesRows,
            ...subseriesRows,
            ...superspeciesRows,
            ...speciesRows,
            ...subspeciesRows,
            ...nothovarietasRows,
            ...varietasRows,
            ...subvarietasRows,
            ...formaRows,
            ...subformaRows,
            ...cultivarsRows,
            ...hybridsRows,
        ];
    }, [
        regnumRows,
        divisionRows,
        classisRows,
        subclassisRows,
        superordoRows,
        ordoRows,
        subordoRows,
        familiaRows,
        subfamiliaRows,
        tribusRows,
        subtribusRows,
        genusRows,
        subgenusRows,
        sectioRows,
        subsectioRows,
        seriesRows,
        subseriesRows,
        superspeciesRows,
        speciesRows,
        subspeciesRows,
        nothovarietasRows,
        varietasRows,
        subvarietasRows,
        formaRows,
        subformaRows,
        cultivarsRows,
        hybridsRows,
    ]);
    const otherRows = useMemo(() => {
        return allRows.filter(
            (row) =>
                row.taxonomicStatus === "accepted" && !handledRows.includes(row)
        );
    }, [allRows, handledRows]);

    const tabs = useMemo(
        () => [
            ...(allRows.length &&
            showAll &&
            genusRows.length !== allRows.length &&
            speciesRows.length !== allRows.length &&
            cultivarsRows.length !== allRows.length
                ? [`All (${allRows.length})`]
                : []),
            ...(regnumRows.length ? [`Regnum (${regnumRows.length})`] : []),
            ...(divisionRows.length
                ? [`Division (${divisionRows.length})`]
                : []),
            ...(classisRows.length ? [`Classis (${classisRows.length})`] : []),
            ...(subclassisRows.length
                ? [`Subclassis (${subclassisRows.length})`]
                : []),
            ...(superordoRows.length
                ? [`Superordo (${superordoRows.length})`]
                : []),
            ...(ordoRows.length ? [`Ordo (${ordoRows.length})`] : []),
            ...(subordoRows.length ? [`Subordo (${subordoRows.length})`] : []),
            ...(familiaRows.length ? [`Familia (${familiaRows.length})`] : []),
            ...(subfamiliaRows.length
                ? [`Subfamilia (${subfamiliaRows.length})`]
                : []),
            ...(tribusRows.length ? [`Tribus (${tribusRows.length})`] : []),
            ...(subtribusRows.length
                ? [`Subtribus (${subtribusRows.length})`]
                : []),
            ...(genusRows.length ? [`Genus (${genusRows.length})`] : []),
            ...(subgenusRows.length
                ? [`Subgenus (${subgenusRows.length})`]
                : []),
            ...(sectioRows.length ? [`Sectio (${sectioRows.length})`] : []),
            ...(subsectioRows.length
                ? [`Subsectio (${subsectioRows.length})`]
                : []),
            ...(seriesRows.length ? [`Series (${seriesRows.length})`] : []),
            ...(subseriesRows.length
                ? [`Subseries (${subseriesRows.length})`]
                : []),
            ...(superspeciesRows.length
                ? [`Superspecies (${superspeciesRows.length})`]
                : []),
            ...(speciesRows.length ? [`Species (${speciesRows.length})`] : []),
            ...(subspeciesRows.length
                ? [`Subspecies (${subspeciesRows.length})`]
                : []),
            ...(nothovarietasRows.length
                ? [`Nothovarietas (${nothovarietasRows.length})`]
                : []),
            ...(varietasRows.length
                ? [`Varietas (${varietasRows.length})`]
                : []),
            ...(subvarietasRows.length
                ? [`Subvarietas (${subvarietasRows.length})`]
                : []),
            ...(formaRows.length ? [`Forma (${formaRows.length})`] : []),
            ...(subformaRows.length
                ? [`Subforma (${subformaRows.length})`]
                : []),
            ...(cultivarsRows.length
                ? [`Cultivars (${cultivarsRows.length})`]
                : []),
            ...(hybridsRows.length ? [`Hybrids (${hybridsRows.length})`] : []),
            ...(otherRows.length ? [`Other (${otherRows.length})`] : []),
            ...(allRows.length &&
            !showAll &&
            genusRows.length !== allRows.length &&
            speciesRows.length !== allRows.length &&
            cultivarsRows.length !== allRows.length
                ? [`All (${allRows.length})`]
                : []),
        ],
        [
            showAll,
            regnumRows,
            divisionRows,
            classisRows,
            subclassisRows,
            superordoRows,
            ordoRows,
            subordoRows,
            familiaRows,
            subfamiliaRows,
            tribusRows,
            subtribusRows,
            genusRows,
            subgenusRows,
            sectioRows,
            subsectioRows,
            seriesRows,
            subseriesRows,
            superspeciesRows,
            speciesRows,
            subspeciesRows,
            nothovarietasRows,
            varietasRows,
            subvarietasRows,
            formaRows,
            subformaRows,
            cultivarsRows,
            hybridsRows,
            allRows,
            otherRows,
        ]
    );
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    useEffect(() => {
        setSelectedTab(tabs[0]);
    }, [tabs]);

    const showingCards =
        selectedTab === `Regnum (${regnumRows.length})`
            ? regnumRows
            : selectedTab === `Division (${divisionRows.length})`
            ? divisionRows
            : selectedTab === `Classis (${classisRows.length})`
            ? classisRows
            : selectedTab === `Subclassis (${subclassisRows.length})`
            ? subclassisRows
            : selectedTab === `Superordo (${superordoRows.length})`
            ? superordoRows
            : selectedTab === `Ordo (${ordoRows.length})`
            ? ordoRows
            : selectedTab === `Subordo (${subordoRows.length})`
            ? subordoRows
            : selectedTab === `Familia (${familiaRows.length})`
            ? familiaRows
            : selectedTab === `Subfamilia (${subfamiliaRows.length})`
            ? subfamiliaRows
            : selectedTab === `Tribus (${tribusRows.length})`
            ? tribusRows
            : selectedTab === `Subtribus (${subtribusRows.length})`
            ? subtribusRows
            : selectedTab === `Genus (${genusRows.length})`
            ? genusRows
            : selectedTab === `Subgenus (${subgenusRows.length})`
            ? subgenusRows
            : selectedTab === `Sectio (${sectioRows.length})`
            ? sectioRows
            : selectedTab === `Subsectio (${subsectioRows.length})`
            ? subsectioRows
            : selectedTab === `Series (${seriesRows.length})`
            ? seriesRows
            : selectedTab === `Subseries (${subseriesRows.length})`
            ? subseriesRows
            : selectedTab === `Superspecies (${superspeciesRows.length})`
            ? superspeciesRows
            : selectedTab === `Species (${speciesRows.length})`
            ? speciesRows
            : selectedTab === `Subspecies (${subspeciesRows.length})`
            ? subspeciesRows
            : selectedTab === `Nothovarietas (${nothovarietasRows.length})`
            ? nothovarietasRows
            : selectedTab === `Varietas (${varietasRows.length})`
            ? varietasRows
            : selectedTab === `Subvarietas (${subvarietasRows.length})`
            ? subvarietasRows
            : selectedTab === `Forma (${formaRows.length})`
            ? formaRows
            : selectedTab === `Subforma (${subformaRows.length})`
            ? subformaRows
            : selectedTab === `Cultivars (${cultivarsRows.length})`
            ? cultivarsRows
            : selectedTab === `Hybrids (${hybridsRows.length})`
            ? hybridsRows
            : selectedTab === `All (${allRows.length})`
            ? allRows
            : selectedTab === `Other (${otherRows.length})`
            ? otherRows
            : [];

    return (
        <>
            {allRows.length > 0 ? (
                <>
                    <div className="mb-2">
                        <div className="sm:hidden">
                            <label htmlFor="tabs" className="sr-only">
                                Select a tab
                            </label>
                            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                            <select
                                id="tabs"
                                name="tabs"
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                defaultValue={selectedTab}
                                onChange={(event) =>
                                    setSelectedTab(event.target.value)
                                }
                            >
                                {tabs.map((tab) => (
                                    <option key={tab}>{tab}</option>
                                ))}
                            </select>
                        </div>
                        <div className="hidden sm:block">
                            <div>
                                <nav
                                    className="-mb-px flex space-x-8 overflow-y-scroll"
                                    aria-label="Tabs"
                                >
                                    {tabs.map((tab) => (
                                        <span
                                            key={tab}
                                            onClick={() => setSelectedTab(tab)}
                                            className={classNames(
                                                tab === selectedTab
                                                    ? "border-blue-500 text-blue-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                                "cursor-pointer whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                                            )}
                                            aria-current={
                                                tab === selectedTab
                                                    ? "page"
                                                    : undefined
                                            }
                                        >
                                            {tab}
                                        </span>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>

                    <ResultCards rows={showingCards} showAll={showAll} />
                </>
            ) : (
                <div className="my-10 text-md flex justify-center items-center text-gray-800">
                    <MagnifyingGlassIcon className="h-4 w-4 mt-1 mr-2" /> No
                    results
                </div>
            )}
        </>
    );
};
