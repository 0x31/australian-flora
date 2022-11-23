import { parse as parseLocation } from "qs";
import React, { useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";

import { Banner } from "./components/common/Banner";
import { fetchSearchResult } from "./lib/server";
import { HomePage } from "./pages/HomePage";
import { NotFound } from "./pages/NotFound";
import { SearchResult } from "./pages/SearchResults";
import { Result } from "./types/result";

export const App: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [search, setSearch] = useState<string | undefined>(undefined);
    const [result, setResult] = useState<Result | undefined>(undefined);
    const [searchError, setSearchError] = useState<Error>();
    const [bannerClosed, setBannerClosed] = useLocalStorage(
        "banner-closed",
        "false"
    );

    const updateTitle = useCallback(() => {
        if (result && !Array.isArray(result.result)) {
            document.title = `${result?.result.apniName.canonicalName} - Australian Flora`;
        } else if (search) {
            document.title = `${search} - Australian Flora`;
        } else {
            document.title = "Australian Flora";
        }
    }, [search, result]);

    // When `search` or `result` change, update the title.
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);

    const onSearch = useCallback(
        async (input: string, noHistoryUpdate?: boolean) => {
            if (!input || input === "") {
                if (!noHistoryUpdate) {
                    navigate(``);
                }
                setSearch("");
                setResult(undefined);
                setSearchError(undefined);
            } else {
                setSearch(input);
                if (!noHistoryUpdate) {
                    navigate(`/?q=${encodeURIComponent(input)}`);
                }
                setResult(undefined);
                setSearchError(undefined);
                try {
                    setResult(await fetchSearchResult(input));
                } catch (error) {
                    setSearchError(
                        error instanceof Error
                            ? error
                            : new Error(`Error searching for ${input}`)
                    );
                }
            }
        },
        [navigate]
    );

    // Watch for changes to location.search
    useEffect(() => {
        const queryParams = parseLocation(location.search.replace(/^\?/, ""));
        const q = (queryParams.q as string) || "";
        if (q !== search) {
            onSearch(q, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    return (
        <div className="text-center">
            {bannerClosed === "false" ? (
                <Banner close={() => setBannerClosed("true")} />
            ) : null}
            <Routes>
                <Route
                    path="/"
                    element={
                        search ? (
                            <SearchResult
                                onSearch={onSearch}
                                search={search}
                                result={result}
                                searchError={searchError}
                            />
                        ) : (
                            <HomePage onSearch={onSearch} />
                        )
                    }
                />
                <Route path="*" element={<NotFound onSearch={onSearch} />} />
            </Routes>
        </div>
    );
};
