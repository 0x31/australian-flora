import Axios from "axios";

import { Result } from "./types/Result";

export const returnResult = async (search: string): Promise<Result> => {

    try {
        const result = await Axios.get(`http://localhost:8080/search/${encodeURI(search)}`);
        return result.data as Result;
    } catch (error) {
        return { item: null, contains: [] };
    }
};

