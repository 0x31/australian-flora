import React from "react";
import { Link } from "react-router-dom";

import { DatapointExtra } from "../../types/result";

/**
 * Show a taxon's higher taxonomy as a series of links.
 */
export const HigherTaxonomy: React.FC<{ result: DatapointExtra }> = ({
    result,
}) => {
    return (
        <>
            {result.apcTaxon
                ? result.apcTaxon.higherClassification
                      .split("|")
                      .map((a, index, arr) => {
                          // TODO: Improve reliability of determining link.
                          const link =
                              index === arr.length - 1
                                  ? result!.apniName.canonicalName
                                  : a.toLowerCase() === a
                                  ? `${result!.apniName.genericName} ${a}`
                                  : a;
                          return (
                              <span key={a}>
                                  <Link
                                      className="underline"
                                      to={`/?q=${encodeURIComponent(link)}`}
                                  >
                                      {a}
                                  </Link>
                                  {index < arr.length - 1 ? <> | </> : null}
                              </span>
                          );
                      })
                : null}
        </>
    );
};
