import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { API } from "../../config";
import { ReactComponent as NoImage } from "../../images/no-image.svg";
import { classNames, titleCase } from "../../lib/utils";
import { DatapointSmall } from "../../types/result";

/**
 * Show a list of taxon cards.
 */
export const ResultCards: React.FC<{
    rows: DatapointSmall[];
    showAll?: boolean;
}> = ({ rows, showAll }) => {
    const [loaded, setLoaded] = useState(false);
    const onLoaded = useCallback(() => {
        setLoaded(true);
    }, []);
    return (
        <div className="flex flex-wrap -mx-3 justify-center md:justify-start">
            {rows.map((match) => {
                return (
                    <Link
                        key={match.scientificName}
                        className="no-underline m-2 rounded-md border-solid border cursor-pointer flex w-48 flex-col"
                        to={`/?q=${encodeURIComponent(
                            // If the taxon isn't accepted, link to the full scientific name when on the search screen.
                            match.taxonomicStatus !== "accepted" && showAll
                                ? match.scientificName
                                : match.canonicalName
                        )}`}
                    >
                        <div className="flex-grow overflow-hidden w-48 h-48 relative">
                            {match.thumbnail ? (
                                <>
                                    <div
                                        className={classNames(
                                            "rounded-t flex justify-center items-center h-full bg-gray-50 w-[190px]",
                                            loaded ? "hidden" : "visible"
                                        )}
                                    >
                                        <NoImage
                                            // Only load the image when in view
                                            className="opacity-50 object-cover w-10"
                                        />
                                    </div>
                                    <img
                                        // Only load the image when in view
                                        loading="lazy"
                                        className={classNames(
                                            "rounded-t h-full object-cover w-[190px]",
                                            loaded ? "visible" : "invisible"
                                        )}
                                        alt={match.canonicalName}
                                        src={API + match.thumbnail}
                                        onLoad={onLoaded}
                                    />
                                </>
                            ) : (
                                <div className="rounded-t flex justify-center items-center h-full bg-gray-50 w-[190px]">
                                    <NoImage
                                        // Only load the image when in view
                                        className="opacity-50 object-cover w-10"
                                    />
                                </div>
                            )}
                            {match.native === false ? (
                                <div className="opacity-90 bg-red-400 text-white border border-red-500 px-2 py-1 rounded-md top-1 right-1 absolute">
                                    Naturalised
                                </div>
                            ) : null}
                        </div>
                        <div className=" font-medium rounded-b border-solid border-t h-20 overflow-hidden p-2 w-full bg-gray-50 border-gray-200 flex flex-col items-center justify-center text-center text-ellipsis">
                            <span className="text-ellipsis">
                                {match.acceptedName || match.canonicalName}
                            </span>
                            {match.acceptedName ? (
                                <>({match.canonicalName})</>
                            ) : match.matchedName ? (
                                <span className="text-gray-500 text-ellipsis">
                                    {titleCase(match.matchedName)}
                                </span>
                            ) : null}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};
