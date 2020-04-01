import { DatapointExtra } from "../types/db";

const Axios = require("axios");
const $ = require('cheerio');
const fs = require("fs");

const download_image = (url, image_path) =>
    Axios({
        url,
        responseType: 'stream',
    }).then(
        response =>
            new Promise((resolve, reject) => {
                response.data
                    .pipe(fs.createWriteStream(image_path))
                    .on('finish', () => resolve())
                    .on('error', e => reject(e));
            }),
    );

export const readJSON = (name: string) => new Promise((resolve, reject) => {
    fs.readFile(name, (error, data) => {
        try {
            if (error) throw error;
            let value = JSON.parse(data);
            resolve(value);
        } catch (error) {
            reject(error);
        }
    });
});

const writeToJSON = (name: string, json: any) => {
    fs.writeFileSync(name, JSON.stringify(json));
}

export const EXTENDED_FILE = "./extendedData.json";
const updateJSON = async (query: string, keys: string[], value: any) => {
    const json = await readJSON(EXTENDED_FILE);
    json[query] = json[query] || {};
    let lastItem = json[query];

    if (keys.length === 0) {
        throw new Error("Invalid number of keys");
    }

    // Access each key until the last
    for (const key of keys.slice(0, keys.length - 1)) {
        lastItem[key] = lastItem[key] || {};
        lastItem = lastItem[key];
    }
    // Set value for the last key
    lastItem[keys[keys.length - 1]] = value;
    writeToJSON(EXTENDED_FILE, json);
}


export const scrapeFlorabase = async (query: string) => {

    const json = await readJSON(EXTENDED_FILE);
    if (json[query] && json[query].timestamp !== undefined) {
        return json[query];
    }

    const url = `https://florabase.dpaw.wa.gov.au/search/quick?q=${query}`;

    console.log(`Requesting ${url}`);
    const html = (await Axios.get(url)).data;

    const rows = $("tr", html);

    let final;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const columns = $("td", row as any);

        let p;

        for (let j = 0; j < columns.length; j++) {
            // console.log(`Column ${j + 1}:`, columns[j]);
            for (const child of columns[j].children) {
                if (child.type === "tag" && child.name === "p") {
                    p = child;
                    break;
                }
            }
        }

        if (p) {
            let text = "";
            let children = [...p.children];
            for (let i = 0; i < children.length; i++) {
                if (children[i].type === "tag" && children[i].name !== "span") {
                    children = [...children.slice(0, i + 1), ...children[i].children, ...children.slice(i + 1, children.length)];
                } else if (children[i].type === "text") {
                    text += children[i].data;
                }
            }
            const finalString = text.trim().replace(/  /g, "");

            if (finalString === query) {
                final = row;
            }
        }

        // console.log((row as any).children[1].children[0].children);
    }

    let id: string;
    let hasImage = false;

    const columns = $("td", final);
    for (let j = 0; j < columns.length; j++) {
        // console.log(`Column ${j + 1}:`, columns[j]);
        for (const child of columns[j].children) {
            if (child.type === "tag" && child.name === "a") {
                const href = child.attribs.href;
                if (href && href.match(/^\/.*\/(\d+)$/)) {
                    id = href.match(/^\/.*\/(\d+)$/)[1];
                }
                if (href && href.match(/\/browse\/photo/)) {
                    hasImage = true;
                }
            }
        }
    }

    console.log(id);

    await updateJSON(query, ["florabase", "timestamp"], Math.floor(new Date().getTime() / 1000));
    if (id) {
        await updateJSON(query, ["florabase", "id"], id);
        await updateJSON(query, ["florabase", "profile"], `https://florabase.dpaw.wa.gov.au/browse/profile/${id}`);


        if (hasImage) {
            const url = `https://florabase.dpaw.wa.gov.au//science/timage/${id}ic1.jpg`;
            await download_image(url, `./images/${query}.jpg`);
            await updateJSON(query, ["florabase", "image"], `/images/${query}.jpg`);
        }
    }

    // const newJSON = await readJSON(EXTENDED_FILE);
    // return newJSON[query];
};