import React from "react";

import { ReactComponent as SearchIcon } from "./search.svg";
import "./SearchInput.scss";

function SearchInput({ previousSearch, onSearch }: { previousSearch?: string; onSearch: (input: string) => void }) {

    const [input, setInput] = React.useState<string>(previousSearch || "");

    React.useEffect(() => {
        setInput(previousSearch || "");
    }, [previousSearch])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); onSearch(input || ""); };

    return (
        <div className="SearchInput">
            <form onSubmit={onSubmit}>
                <input type="text" onChange={onChange} value={input} />
                <button><SearchIcon /></button>
            </form>
        </div>
    );
}

export default SearchInput;
