import React from "react";

import { titleCase, toDatapointSmall } from "../../lib/utils";
import { DatapointExtra } from "../../types/result";
import { DataCard } from "./DataCard";
import { Distribution } from "./Distribution";
import { ImageGallery } from "./ImageGallery";
import { ResultCards } from "./ResultCard";
import { ResultList } from "./ResultList";
import { ResultSection } from "./ResultSection";
import { TaxonInfoTable } from "./TaxonInfoTable";
import { Taxonomy } from "./Taxonomy";

/**
 * Show the details of a taxon and a list of taxa related to/belonging to it.
 */
export const ExactResult: React.FC<{ result: DatapointExtra }> = ({
    result,
}) => {
    return result.apniName ? (
        <>
            <Taxonomy className="mb-3" result={result} />

            <div className="p-5 w-full border shadow-sm bg-white rounded-md  px-6 space-x-4">
                <div className="items-center mb-4 flex flex-col sm:block">
                    <h2 className="text-lg mb-0 italic inline">
                        {result.apniName.canonicalName}
                    </h2>
                    <span className="ml-2 text-gray-400 text-lg mb-0">
                        (
                        {result.apniName.taxonRank === "[unranked]"
                            ? `${titleCase(result.apniName.nameType)}`
                            : result.apniName.taxonRank}
                        )
                    </span>
                    {result.distributionRegions &&
                    !result.distributionRegions["Australia"]?.native ? (
                        <span className="bg-red-400 text-white border border-red-500 px-2 py-1 rounded-md mt-1 ml-2">
                            Naturalised
                        </span>
                    ) : null}
                </div>

                <TaxonInfoTable result={result} />

                {result.accepted ? (
                    <ResultSection title="Accepted">
                        <div className="">
                            <ResultCards
                                rows={[toDatapointSmall(result.accepted)]}
                                showAll={true}
                            />
                        </div>
                    </ResultSection>
                ) : null}

                {result.firstHybridParent || result.secondHybridParent ? (
                    <ResultSection title="Parents">
                        <div className="">
                            <ResultCards
                                rows={[
                                    ...(result.firstHybridParent
                                        ? [
                                              toDatapointSmall(
                                                  result.firstHybridParent
                                              ),
                                          ]
                                        : []),
                                    ...(result.secondHybridParent
                                        ? [
                                              toDatapointSmall(
                                                  result.secondHybridParent
                                              ),
                                          ]
                                        : []),
                                ]}
                                showAll={true}
                            />
                        </div>
                    </ResultSection>
                ) : null}

                {/* Show images */}
                <ImageGallery result={result} />

                {/* Show region distribution. */}
                {result.distributionRegions &&
                Object.keys(result.distributionRegions).length > 1 ? (
                    <ResultSection title="Distribution">
                        <Distribution
                            distribution={result.distributionRegions}
                        />
                    </ResultSection>
                ) : null}

                {/* Show common names associated with the taxon. */}
                {result.commonNames?.length ? (
                    <ResultSection title="Common Names">
                        <div className="flex mb-1 flex-wrap -m-1">
                            {result.commonNames.map((name) => (
                                <div
                                    key={name}
                                    className="border border-gray-200 p-2 bg-gray-50 rounded m-1"
                                >
                                    {titleCase(name)}
                                </div>
                            ))}
                        </div>
                    </ResultSection>
                ) : null}

                {/* TODO: Render these dynamically instead of hardcoding them. */}
                <ResultSection title="Data Sources">
                    <DataCard
                        type="aunsl"
                        title={`${result.apniName.canonicalName} - auNSL Page`}
                        link={
                            result.apcTaxon?.taxonID ||
                            result.apniName.scientificNameID
                        }
                        className="mb-2"
                    />

                    {result.extra.florabase ? (
                        <DataCard
                            type="florabase"
                            title={`${result.apniName.canonicalName} - Florabase Profile`}
                            link={result.extra.florabase.link}
                            className="mb-2"
                        />
                    ) : null}

                    {result.extra.wikipedia ? (
                        <DataCard
                            type="wikipedia"
                            title={`${
                                result.extra.wikipedia.title ||
                                result.apniName.canonicalName
                            } - Wikipedia Article`}
                            link={result.extra.wikipedia.link}
                            plaintext={result.extra.wikipedia.plaintext}
                            className="mb-2"
                        />
                    ) : null}

                    {result.extra.gardeningWithAngus ? (
                        <DataCard
                            type="gardeningWithAngus"
                            title={`${result.apniName.canonicalName} - Gardening With Angus Profile`}
                            link={result.extra.gardeningWithAngus.link}
                            plaintext={
                                result.extra.gardeningWithAngus.plaintext
                            }
                            className="mb-2"
                        />
                    ) : null}
                </ResultSection>

                {/* Show taxa related to/belonging to the matched taxon. */}
                {result.related?.length ? (
                    <ResultSection title="More results">
                        <ResultList rows={result.related} />
                    </ResultSection>
                ) : null}

                {/* Debug details hidden behind a <details> tag. */}
                <ResultSection title="Debug Details">
                    <details>
                        <summary className="cursor-pointer">
                            Show server response
                        </summary>
                        <pre className="mt-3 rounded-md border text-gray-900 px-2.5 py-2 overflow-x-scroll">
                            <code>
                                {JSON.stringify(
                                    {
                                        ...result,
                                        related: `[${result.related?.length} items]`,
                                    },
                                    null,
                                    "    "
                                )}
                            </code>
                        </pre>
                    </details>
                </ResultSection>
            </div>
        </>
    ) : null;
};
