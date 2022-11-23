import Axios from "axios";
import { OrderedMap } from "immutable";

import { API } from "../config";
import { Result } from "../types/result";

const CACHE_LENGTH = 10;
let cache = OrderedMap<string, Result>();

export const fetchSearchResult = async (search: string): Promise<Result> => {
    const cachedResult = cache.get(search);
    if (cachedResult) {
        return cachedResult;
    }

    const response = await Axios.get(
        `${API}/search/${encodeURIComponent(search)}`
    );
    const result = response.data as Result;
    cache = cache
        .set(search, result)
        .slice(Math.max(0, cache.size - CACHE_LENGTH));
    return result;
};
