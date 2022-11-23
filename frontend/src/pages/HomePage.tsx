import React from "react";

import { SearchInput } from "../components/common/SearchInput";
import Logo from "../images/logo.png";

interface Props {
    onSearch: (search: string) => void;
}

/**
 * Home page, showing the logo and a search form.
 */
export const HomePage: React.FC<Props> = ({ onSearch }) => {
    return (
        <div className="bg-gray-100">
            <header className="min-h-screen flex flex-col items-center justify-center mx-4">
                <div className="flex items-center justify-center mb-4">
                    <img
                        src={Logo}
                        className="h-16 pointer-events-none mr-2"
                        alt="logo"
                    />
                    <h1 className="text-gray-700 font-normal text-3xl">
                        Search Australian Flora
                    </h1>
                </div>
                <SearchInput onSearch={onSearch} className="mx-2" />
            </header>
        </div>
    );
};
