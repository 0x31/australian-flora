import React from "react";

import { API } from "../../config";
import { titleCase } from "../../lib/utils";
import { DatapointExtra } from "../../types/result";
import { DataSourceLogo } from "./DataCard";
import { ResultSection } from "./ResultSection";

/**
 * Show the images of a taxon. Currently hardcoded to read the two available
 * images - if more data sources are added this should be refactored.
 */
export const ImageGallery: React.FC<{ result: DatapointExtra }> = ({
    result,
}) => {
    const images: Array<{
        image: string;
        source: keyof DatapointExtra["extra"];
        caption?: string;
        link?: string;
    }> = [
        ...(result.extra.florabase?.image
            ? [
                  {
                      image: result.extra.florabase?.image.large,
                      source: "florabase" as keyof DatapointExtra["extra"],
                      link: result.extra.florabase.link,
                  },
              ]
            : []),
        ...(result.extra.wikipedia?.image
            ? [
                  {
                      image: result.extra.wikipedia?.image.large,
                      source: "wikipedia" as keyof DatapointExtra["extra"],
                      caption: result.extra.wikipedia.imageCaption,
                      link: result.extra.wikipedia.link,
                  },
              ]
            : []),
    ];

    return (
        <>
            {/* Show images */}
            {images.length ? (
                <ResultSection title="Gallery">
                    <div className="w-full max-w-lg flex justify-center sm:justify-start shadow-sm min-w-full border bg-gray-50 p-3 rounded-lg overflow-y-scroll">
                        {images.map(({ image, source, caption, link }) => {
                            // TODO: Improve processing caption.
                            caption = caption?.replace(/<br ?\/>/g, " - ");
                            caption =
                                caption && caption.length > 50
                                    ? caption.slice(0, 50) + "…"
                                    : caption;
                            return (
                                <div
                                    key={link}
                                    className="relative mr-4 group h-[20rem]"
                                >
                                    <img
                                        key={image}
                                        className="shadow-lg rounded-lg max-h-[20rem] min-h-[20rem]"
                                        alt={result.apniName.canonicalName}
                                        src={API + image}
                                    />
                                    <div className="absolute top-2 right-2 p-1 rounded bg-white/80 flex invisible group-hover:visible">
                                        <DataSourceLogo
                                            type={source}
                                            className="w-10"
                                        />
                                    </div>
                                    <div className=" overflow-scroll absolute text-black bg-white opacity-80 bottom-0 p-2 flex w-full invisible group-hover:visible">
                                        <span>
                                            {caption ? (
                                                <span>
                                                    {caption}{" "}
                                                    <span className="mx-1">
                                                        -
                                                    </span>
                                                </span>
                                            ) : null}
                                            Image from
                                            {link ? (
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-1 underline"
                                                    href={link}
                                                >
                                                    {titleCase(source)}
                                                </a>
                                            ) : (
                                                <>{titleCase(source)}</>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ResultSection>
            ) : null}
        </>
    );
};
