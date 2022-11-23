import React from "react";

import logo from "../../images/logo.png";
import { Result } from "../../types/result";
import { SearchInput } from "./SearchInput";

export const Header: React.FC<{
    onSearch: (search: string) => void;
    search?: string;
    result?: Result | undefined;
}> = ({ onSearch, search, result }) => {
    return (
        <div className="bg-gray-50 w-full h-full shadows-sm border-b py-3 px-9">
            <div className="max-w-7xl mx-auto flex items-center">
                <div
                    role="button"
                    onClick={() => onSearch("")}
                    className="mr-5 cursor-pointer"
                >
                    <img
                        alt=""
                        role="presentation"
                        className="h-10 w-10 min-h-10 min-w-[2.5rem]"
                        src={logo}
                    />
                </div>
                <div className="w-full max-w-xl">
                    <SearchInput
                        previousSearch={search}
                        onSearch={onSearch}
                        loading={result === null}
                    />
                </div>
            </div>
        </div>
    );
};
