import { BugAntIcon } from "@heroicons/react/20/solid";
import React from "react";

import { Header } from "../components/common/Header";
import { ExactResult } from "../components/results/ExactResult";
import { ResultList } from "../components/results/ResultList";
import { Result } from "../types/result";

export const SearchResult: React.FC<{
    search: string;
    result: Result | undefined;
    searchError: Error | undefined;
    onSearch: (search: string) => void;
}> = ({ search, result, searchError, onSearch }) => {
    return (
        <div className="SearchResult bg-white">
            <Header search={search} result={result} onSearch={onSearch} />
            <div className="w-full h-full py-3 px-9">
                <div className="text-sm max-w-7xl mx-auto text-left w-full">
                    {searchError ? (
                        <div className="my-10 text-md flex justify-center items-center text-gray-800">
                            <BugAntIcon className="h-4 w-4 mt-1 mr-2" /> Unable
                            to search for "{search}"
                            <span className="mx-2">-</span>
                            <span className="text-red-800">
                                {searchError.message}
                            </span>
                        </div>
                    ) : result === undefined ? (
                        <div className="flex flex-col">
                            {/* Skeleton loader cards */}
                            <div className="flex flex-wrap justify-center -mx-3 mt-2 -mb-3 animate-pulse opacity-50">
                                <div className="Result border-solid border cursor-pointer flex m-2 w-48 flex-col h-72">
                                    <div className="flex-grow overflow-hidden w-full"></div>
                                    <div className="border-solid border-t h-14 overflow-hidden p-2 w-full bg-gray-100 border-gray-200 flex items-center justify-center text-center text-ellipsis">
                                        <span></span>
                                    </div>
                                </div>
                                <div className="Result border-solid border cursor-pointer flex m-2 w-48 flex-col h-72">
                                    <div className="flex-grow overflow-hidden w-full"></div>
                                    <div className="border-solid border-t h-14 overflow-hidden p-2 w-full bg-gray-100 border-gray-200 flex items-center justify-center text-center text-ellipsis">
                                        <span></span>
                                    </div>
                                </div>
                                <div className="Result border-solid border cursor-pointer flex m-2 w-48 flex-col h-72">
                                    <div className="flex-grow overflow-hidden w-full"></div>
                                    <div className="border-solid border-t h-14 overflow-hidden p-2 w-full bg-gray-100 border-gray-200 flex items-center justify-center text-center text-ellipsis">
                                        <span></span>
                                    </div>
                                </div>
                                <div className="Result border-solid border cursor-pointer flex m-2 w-48 flex-col h-72">
                                    <div className="flex-grow overflow-hidden w-full"></div>
                                    <div className="border-solid border-t h-14 overflow-hidden p-2 w-full bg-gray-100 border-gray-200 flex items-center justify-center text-center text-ellipsis">
                                        <span></span>
                                    </div>
                                </div>
                                <div className="Result border-solid border cursor-pointer flex m-2 w-48 flex-col h-72">
                                    <div className="flex-grow overflow-hidden w-full"></div>
                                    <div className="border-solid border-t h-14 overflow-hidden p-2 w-full bg-gray-100 border-gray-200 flex items-center justify-center text-center text-ellipsis">
                                        <span></span>
                                    </div>
                                </div>
                                <div className="Result border-solid border cursor-pointer flex m-2 w-48 flex-col h-72">
                                    <div className="flex-grow overflow-hidden w-full"></div>
                                    <div className="border-solid border-t h-14 overflow-hidden p-2 w-full bg-gray-100 border-gray-200 flex items-center justify-center text-center text-ellipsis">
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {result.resultType === "similar" ? (
                                <p className="bg-gray-50 border border-gray-200 rounded-md w-full mt-2 mb-4 p-4">
                                    No exact matches were found - showing
                                    similar matches.
                                </p>
                            ) : null}
                            {Array.isArray(result.result) ? (
                                <ResultList
                                    rows={result.result}
                                    showAll={true}
                                />
                            ) : (
                                <ExactResult result={result.result} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
