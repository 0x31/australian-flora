import React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { parse as parseLocation } from "qs";

import "./App.scss";
import { history } from "./history";
import HomePage from "./HomePage";
import { returnResult } from "./mock";
import { Result } from "./types/Result";

function App({ location }: RouteComponentProps) {

    const [search, setSearch] = React.useState<string | null>(null);
    const [result, setResult] = React.useState<null | Result>(null);

    const onSearch = React.useCallback(async (input: string) => {
        if (!input || input === "") {
            history.push(``);
            setSearch("");
            setResult(null);
        } else {
            setSearch(input);
            history.push(`/?q=${encodeURI(input)}`);
            setResult(null);
            setResult(await returnResult(input));
        }
    }, []);

    React.useEffect(() => {
        const queryParams = parseLocation(location.search.replace(/^\?/, ""));
        const q = queryParams.q || "";
        if (q !== search) {
            onSearch(q).then(console.error);
        }
    }, [location.search]);

    return (
        <div className="App">
            <Switch>
                <Route path="/" exact={true} render={() => <HomePage onSearch={onSearch} search={search} result={result} />} />
            </Switch>
        </div>
    );
}

export default withRouter(App);
