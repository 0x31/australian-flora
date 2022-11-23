import React from "react";

import { Header } from "../components/common/Header";

export const NotFound: React.FC<{
    onSearch: (search: string) => void;
}> = ({ onSearch }) => {
    return (
        <div className="SearchResult bg-white">
            <Header onSearch={onSearch} />
            <div className="w-full h-full py-3 px-9">
                <div className="text-sm max-w-7xl mx-auto text-left w-full">
                    <div className="my-20 text-xl flex flex-col justify-center items-center text-gray-800">
                        <h2 className=" text-8xl">404</h2>
                        <span className="flex justify-center items-center mt-2">
                            Page Not Found
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
