import React from "react";
import { Link } from "react-router-dom";

import { titleCase } from "../../lib/utils";
import { DatapointExtra } from "../../types/result";
import { HigherTaxonomy } from "./HigherTaxonomy";
import { ResultSection, ResultSectionInner } from "./ResultSection";

/**
 * Show a table of information about the provided taxon.
 *
 * TODO: Show additional information here.
 */
export const TaxonInfoTable: React.FC<{ result: DatapointExtra }> = ({
    result,
}) => {
    return (
        <ResultSection title="Info">
            {result.apniName.kingdom ? (
                <ResultSectionInner title="Kingdom">
                    <Link
                        className="hover:underline"
                        to={`/?q=${encodeURIComponent(
                            result.apniName.kingdom
                        )}`}
                    >
                        <span className="italic">
                            {result.apniName.kingdom}
                        </span>
                    </Link>
                </ResultSectionInner>
            ) : null}
            {result.apniName.family ? (
                <ResultSectionInner title="Family">
                    <Link
                        className="hover:underline"
                        to={`/?q=${encodeURIComponent(result.apniName.family)}`}
                    >
                        <span className="italic">{result.apniName.family}</span>
                    </Link>
                </ResultSectionInner>
            ) : null}
            <ResultSectionInner
                title={
                    result.apniName.taxonRank === "[unranked]"
                        ? `${titleCase(result.apniName.nameType)} name`
                        : result.apniName.taxonRank
                }
            >
                <span className="italic">{result.apniName.scientificName}</span>
            </ResultSectionInner>

            {result.apniName.nameAccordingTo ||
            result.apcTaxon?.nameAccordingTo ? (
                <ResultSectionInner title={"Named by"}>
                    {result.apniName.nameAccordingTo ||
                        result.apcTaxon?.nameAccordingTo}
                </ResultSectionInner>
            ) : null}

            {result.firstHybridParent && result.firstHybridParent.apcTaxon ? (
                <ResultSectionInner title="Parent Taxonomy">
                    <HigherTaxonomy result={result.firstHybridParent} />
                </ResultSectionInner>
            ) : null}

            {result.secondHybridParent && result.secondHybridParent.apcTaxon ? (
                <ResultSectionInner title="Parent Taxonomy">
                    <HigherTaxonomy result={result.secondHybridParent} />
                </ResultSectionInner>
            ) : null}

            {result.apcTaxon &&
            !(
                result.secondHybridParent && result.secondHybridParent.apcTaxon
            ) ? (
                <ResultSectionInner title="Taxonomy">
                    <HigherTaxonomy result={result} />
                </ResultSectionInner>
            ) : null}

            {result.apniName.taxonomicStatus &&
            result.apniName.scientific === "t" ? (
                <ResultSectionInner title="Taxonomic Status">
                    <span
                        className={
                            result.apniName.taxonomicStatus !== "accepted" &&
                            result.apniName.scientific === "t"
                                ? "text-orange-600"
                                : ""
                        }
                    >
                        {titleCase(result.apniName.taxonomicStatus)}
                    </span>
                </ResultSectionInner>
            ) : null}
        </ResultSection>
    );
};
