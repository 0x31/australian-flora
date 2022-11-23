import React, { useEffect, useState } from "react";

import { ReactComponent as SearchIcon } from "../../images/search.svg";
import { classNames } from "../../lib/utils";

/**
 * A text form for allowing the user to perform a search.
 */
export const SearchInput: React.FC<{
    previousSearch?: string;
    loading?: boolean;
    className?: string;
    onSearch: (input: string) => void;
}> = ({ previousSearch, loading, className, onSearch }) => {
    const [input, setInput] = useState<string>(previousSearch || "");

    useEffect(() => {
        setInput(previousSearch || "");
    }, [previousSearch]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setInput(e.target.value);
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(input || "");
    };

    return (
        <form
            className={classNames(
                "w-full flex item-center justify-center text-black box-border rounded shadow-sm bg-white pl-2 m-0 ml-auto mr-auto max-w-xl border border-solid border-gray-300",
                className
            )}
            onSubmit={onSubmit}
        >
            <input
                type="text"
                className="text-base font-normal block w-full p-0 px-1 h-12 relative outline-none border-none flex-1 z-0 bg-transparent -mt-px"
                onChange={onChange}
                value={input}
            />
            {loading ? (
                <div className="h-12 w-14 flex justify-center items-center">
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#333333"
                            stroke-width="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="#333333"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            ) : (
                <button className="h-12 w-14 flex justify-center items-center hover:fill-orange-500">
                    <SearchIcon className="h-4 w-4" />
                </button>
            )}
        </form>
    );
};
