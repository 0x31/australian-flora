import React from "react";

/**
 * Render content with a label to the left of the content, and a top border.
 */
export const ResultSection: React.FC<
    { title: string } & React.PropsWithChildren
> = ({ title, children }) => {
    return (
        <div className="sm:grid sm:grid-cols-8 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
                htmlFor="username"
                className="block text-sm font-bold sm:font-medium text-gray-700 mb-2 sm:mb-0"
            >
                {title}
            </label>
            <div className="sm:col-span-7 mb-3">{children}</div>
        </div>
    );
};

/**
 * Render content with a bold label to the left of the content.
 */
export const ResultSectionInner: React.FC<
    { title: string } & React.PropsWithChildren
> = ({ title, children }) => {
    return (
        <div className="sm:grid sm:grid-cols-8 sm:items-start sm:border-gray-200">
            <label
                htmlFor="username"
                className="block text-sm font-bold text-gray-700 text-ellipsis overflow-hidden mr-1"
            >
                {title}
            </label>
            <div className="sm:col-span-7 mb-3">{children}</div>
        </div>
    );
};
