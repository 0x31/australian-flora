import React from "react";
import { Link } from "react-router-dom";

import { classNames } from "../../lib/utils";
import { DatapointExtra } from "../../types/result";

interface Props {
    result: DatapointExtra;
    className?: string;
}

/**
 * Taxonomy component for displaying an organism's kingdo, family, genus and
 * species.
 *
 * Based on TailwindUI breadcrumb (see https://tailwindui.com/license).
 */
export const Taxonomy: React.FC<Props> = ({ result, className }) => {
    const taxonomy = [
        ...(result.apniName.kingdom
            ? [
                  {
                      name: result.apniName.kingdom,
                      href: result.apniName.kingdom,
                  },
              ]
            : []),
        ...(result.apniName.family
            ? [
                  {
                      name: result.apniName.family,
                      href: result.apniName.family,
                  },
              ]
            : []),
        // Handle families
        ...(!result.apniName.family && result.apniName.taxonRank === "Familia"
            ? [
                  {
                      name: result.apniName.nameElement,
                      href: result.apniName.nameElement,
                  },
              ]
            : []),
        ...(result.apniName.genericName
            ? [
                  {
                      name: result.apniName.genericName,
                      href: result.apniName.genericName,
                  },
              ]
            : []),
        ...(result.apniName.specificEpithet
            ? [
                  {
                      name: result.apniName.specificEpithet,
                      href: `${result.apniName.genericName} ${result.apniName.specificEpithet}`,
                  },
              ]
            : []),
        ...(result.apniName.infraspecificEpithet &&
        result.apniName.taxonRankAbbreviation !== "[unranked]" &&
        result.apniName.infraspecificEpithet !== "[unknown]"
            ? [
                  {
                      name: `${result.apniName.taxonRankAbbreviation} ${result.apniName.infraspecificEpithet}`,
                      // TODO: Improve creating infraspecific link.
                      href: `${result.apniName.genericName} ${result.apniName.specificEpithet} ${result.apniName.taxonRankAbbreviation} ${result.apniName.infraspecificEpithet}`,
                  },
              ]
            : []),
        ...(result.apniName.cultivarEpithet
            ? [
                  {
                      name: result.apniName.cultivarEpithet,
                      href: result.apniName.canonicalName,
                  },
              ]
            : []),
    ];
    return (
        <nav className={classNames("flex", className)} aria-label="Breadcrumb">
            <ol className="bg-white rounded-md border shadow-sm px-2 flex flex-col w-full sm:flex-row sm:w-auto">
                {taxonomy.map((item, i) => (
                    <li key={item.name} className="flex justify-center">
                        <div className="flex items-center h-10">
                            {i > 0 ? (
                                <svg
                                    className="flex-shrink-0 w-5 h-full text-gray-300 hidden sm:block"
                                    viewBox="0 0 24 44"
                                    preserveAspectRatio="none"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                                </svg>
                            ) : null}
                            <Link
                                to={`/?q=${encodeURIComponent(item.href)}`}
                                className="text-sm font-medium text-gray-500 hover:text-gray-700 py-1 px-3"
                            >
                                {item.name}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};
