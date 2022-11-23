import React from "react";

import Florabase from "../../images/florabase.png";
import GardeningWithAngus from "../../images/gardening-with-angus.png";
import NSL from "../../images/nsl.png";
import Wikipedia from "../../images/wikipedia.png";
import { classNames } from "../../lib/utils";
import { DatapointExtra } from "../../types/result";

export const DataSourceLogo: React.FC<{
    type: "aunsl" | keyof DatapointExtra["extra"];
    className?: string;
}> = ({ type, className }) => {
    switch (type) {
        case "aunsl":
            return (
                <img
                    className={className}
                    alt=""
                    role="presentation"
                    src={NSL}
                />
            );
        case "florabase":
            return (
                <img
                    className={className}
                    alt=""
                    role="presentation"
                    src={Florabase}
                />
            );
        case "wikipedia":
            return (
                <img
                    className={className}
                    alt=""
                    role="presentation"
                    src={Wikipedia}
                />
            );
        case "gardeningWithAngus":
            return (
                <img
                    className={className}
                    alt=""
                    role="presentation"
                    src={GardeningWithAngus}
                />
            );
        default:
            return <div className={className}></div>;
    }
};

/**
 * Show a card displaying information about a taxon fetched from an external
 * data source.
 */
export const DataCard: React.FC<{
    type: "aunsl" | keyof DatapointExtra["extra"];
    title?: string;
    link?: string;
    plaintext?: string;
    className?: string;
}> = ({ type, title, link, plaintext, className }) => {
    let body = plaintext?.trim();

    let truncated = false;
    if (body && body.length > 500) {
        body = body.slice(0, 497) + "...";
        truncated = true;
    }

    if (body && body.slice(body.length - 3) === "[…]") {
        body = body.slice(0, body.length - 3).trim() + "...";
        truncated = true;
    }

    return link || plaintext ? (
        <a target="_blank" rel="noopener noreferrer" href={link}>
            <div
                className={classNames(
                    "border-solid border flex flex-col sm:flex-row items-center no-underline hover:no-underline rounded-md p-3",
                    className
                )}
            >
                <DataSourceLogo
                    className="w-10 h-10 rounded-md mb-1 sm:mb-0"
                    type={type}
                />
                <div className="ml-2 h-full flex flex-col">
                    <h3 className="font-bold text-center sm:text-left">
                        {title}
                    </h3>

                    {body ? (
                        <p className="mt-2">
                            {body.split("\n").map((row, i, split) => (
                                <span key={i}>
                                    {row}
                                    {i < split.length - 1 ? <br /> : null}
                                </span>
                            ))}
                            {truncated ? (
                                <span className="ml-1">
                                    [read full article]
                                </span>
                            ) : null}
                        </p>
                    ) : null}
                </div>
            </div>
        </a>
    ) : (
        <></>
    );
};
