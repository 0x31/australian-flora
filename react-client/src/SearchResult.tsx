import React from "react";
import { Link } from "react-router-dom";

import logo from "./logo.png";
import SearchInput from "./SearchInput";
import "./SearchResult.scss";
import { DatapointExtra, Result } from "./types/Result";

const filterSpecies = (results: DatapointExtra[]): DatapointExtra[] => {
    return results
    // return results.filter(result => {
    //     return result.taxonomicStatus === "accepted" && result.nameType === "scientific" && result.taxonRank === "Species";
    // })
}


function SearchResult({ onSearch, search, result }: { onSearch: (search: string) => void; search: string, result: Result | null }) {

    const filteredSpecies = React.useMemo(() => {
        return result && result.item && result.item.taxonRank === "Genus" ? filterSpecies(result.contains) : (result ? result.contains : []);
    }, [result]);

    return (
        <div className="SearchResult">
            <div className="SearchResult-header">
                <div role="button" onClick={() => onSearch("")} className="SearchResult-logo">
                    <img src={logo} />
                </div>
                <div className="SearchResult-search">
                    <SearchInput previousSearch={search} onSearch={onSearch} />
                </div>
            </div>
            <div className="SearchResult-result">
                {result === null ?
                    <>Loading...</> : <>
                        {result.item ?
                            <div className="Result-exact">
                                <h3>{result.item.canonicalName}</h3>
                                <p><b>{result.item.taxonRank === "[n/a]" ? <>{result.item.nameType} name</> : result.item.taxonRank}</b> - {result.item.scientificName} - {result.item.family}</p>
                                {result.item.extra.florabase && result.item.extra.florabase.image ? <div className="Result-exact-image"><img src={"http://localhost:8080" + result.item.extra.florabase.image} /></div> : <></>}
                                <p>More results found: {filteredSpecies.length}</p>
                                <div className="Result-matches">
                                    {filteredSpecies.map(match => {
                                        return (<div key={match.scientificName} onClick={() => onSearch(match.canonicalName)} className="Result"><div className="Result-image">{match.extra.florabase && match.extra.florabase.image ? <img src={"http://localhost:8080" + match.extra.florabase.image} /> : <></>}</div><div className="Result-description"><h3>{match.canonicalName}</h3><p>{match.scientificName}</p></div></div>);
                                    })}
                                </div>
                                <pre style={{ overflowX: "scroll" }}><code>{JSON.stringify(result.item, null, "    ")}</code></pre>
                            </div> :
                            <div className="Result-matches">
                                {result.contains.map(match => {
                                    return (<div key={match.scientificName} onClick={() => onSearch(match.canonicalName)} className="Result"><div className="Result-image">{match.extra.florabase && match.extra.florabase.image ? <img src={"http://localhost:8080" + match.extra.florabase.image} /> : <></>}</div><div className="Result-description"><h3>{match.canonicalName}</h3><p>{match.scientificName}</p></div></div>);
                                })}
                            </div>
                        }
                    </>
                }
            </div>
        </div>
    );
}

export default SearchResult;
