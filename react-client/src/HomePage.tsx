import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import logo from "./logo.png";
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";
import { Result } from "./types/Result";

function HomePage({ onSearch, search, result }: { onSearch: (search: string) => void; search: string | null, result: Result | null }) {
    if (search === null) { return <></>; }

    return search ?
        (
            <SearchResult onSearch={onSearch} search={search} result={result} />
        ) :
        (
            <div className="App-homepage">
                <header className="App-header">
                    <div className="App-title">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h1>Search Australian Plants</h1>
                    </div>
                    <SearchInput onSearch={onSearch} />
                </header>
            </div>
        );
}

export default HomePage;
