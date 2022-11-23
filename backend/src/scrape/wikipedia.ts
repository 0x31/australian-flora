import { existsSync } from "fs";
import path, { join } from "path";

import Axios from "axios";
import chalk from "chalk";
import $ from "cheerio";
import { isText } from "domhandler";
import { readFile, writeFile } from "fs/promises";
import { OrderedMap } from "immutable";

import {
    EXTENDED_FILE,
    IMAGES_LARGE_DIR,
    IMAGES_ORIGINAL_DIR,
    IMAGES_THUMBNAILS_DIR,
    WIKIPEDIA_FILE,
    WIKIPEDIA_LATEST,
} from "../config";
import { Database } from "../db/loadDB";
import { ExtraLayout } from "../types/result";
import { downloadImage, readJSON, timestamp, updateJSON } from "./scrapeUtils";

// Extract information from Wikipedia's Speciesbox markup.
const matchSpeciesbox = (text: string, field: string): string | undefined => {
    // Match patterns of the type `\n | image= CONTENT \n'`, returning `CONTENT`.
    const regex = new RegExp(
        `\\n[^\\S\\r\\n]*\\|[^\\S\\r\\n]*${field}[^\\S\\r\\n]*=[^\\S\\r\\n]*(.*)[^\\S\\r\\n]*\\n`
    );
    const match = regex.exec(text);
    // console.log(text, field, match?.[1]);
    if (match && match[1]) {
        return match[1];
    }
    return undefined;
};

// Load the batched Wikipedia articles in `WIKIPEDIA_FILE`.
export const loadWikipedia = async (): Promise<OrderedMap<string, string>> => {
    if (existsSync(WIKIPEDIA_LATEST)) {
        return OrderedMap(await readJSON(WIKIPEDIA_LATEST));
    }

    const file = $(await readFile(WIKIPEDIA_FILE).then((x) => x.toString()));
    const pages = $("page", file);

    let articles = OrderedMap<string, string>();

    for (const page of pages.toArray()) {
        const title = $("title", page).toArray()[0].firstChild;
        if (title && isText(title) && title.data) {
            // Key = title.data
            const revision = $("revision", page).toArray()[0];
            const text = $("text", revision).toArray()[0]?.firstChild;

            if (text && isText(text)) {
                articles = articles.set(title.data, text.data);
            }
        }
    }

    await writeFile(WIKIPEDIA_LATEST, JSON.stringify(articles, null, "    "));

    return articles;
};

const fetchImageWikimediaUrl = async (
    imageName: string
): Promise<string | undefined> => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&titles=File%3A${encodeURI(
        imageName
    )}&continue=&format=json`;
    console.log(` > Requesting ${chalk.blue(imageName)} image from Wikipedia`);
    const imageInformation = await Axios.get(url);

    const imageUrl = (
        Object.values(imageInformation.data?.query?.pages) as any
    )[0]?.imageinfo?.[0]?.url;

    if (!imageUrl) {
        console.error(`No url found for Wikipedia image ${imageName}`);
        console.debug(JSON.stringify(imageInformation.data, null, "  "));
    }

    return imageUrl;
};

const fetchArticlePlainText = async (
    articleName: string
): Promise<string | undefined> => {
    console.log(
        ` > Requesting ${chalk.blue(
            articleName
        )} plain text article from Wikipedia`
    );
    const articleText = await Axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURI(
            articleName
        )}&prop=extracts&exintro&explaintext`
    );
    return (Object.values(articleText.data?.query?.pages) as any)[0]?.extract;
};

const fetchPageViews = async (
    articleName: string
): Promise<number | undefined> => {
    const currentDate = new Date();
    currentDate.setDate(1);
    const previousMonth = new Date(
        new Date(currentDate).setMonth(currentDate.getMonth() - 1)
    );

    // Add leading 0 to month and date formats.
    const prefix = (n: number) => {
        return (n.toString().length < 2 ? "0" : "") + n.toString();
    };

    const fromDate = `${previousMonth.getFullYear()}${prefix(
        previousMonth.getMonth()
    )}${prefix(previousMonth.getDate())}`;
    const toDate = `${currentDate.getFullYear()}${prefix(
        currentDate.getMonth()
    )}${prefix(currentDate.getDate())}`;

    console.log(
        ` > Requesting ${chalk.blue(
            articleName
        )} page view statistics from Wikipedia`
    );
    const articleStats = await Axios.get(
        `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${articleName}/monthly/${fromDate}/${toDate}`
    );
    return articleStats.data.items?.[0]?.views;
};

export const scrapeWikipedia = async (
    db: Database,
    query: string,
    canonicalName: string
): Promise<boolean> => {
    let networkRequestMade = false;

    if (db.extended[query]?.wikipedia?.link !== undefined) {
        return networkRequestMade;
    }

    let image: string | undefined;
    let imageCaption: string | undefined;
    let title: string | undefined;

    const article =
        db.wikipediaArticles.get(`${canonicalName} (plant)`) ||
        db.wikipediaArticles.get(canonicalName);
    if (article) {
        // Avoid scraping unrelated wikipedia page.
        if (
            !article.match(/speciesbox/i) &&
            !article.match(/taxobox/i) &&
            !article.match(/infobox cultivar/i)
        ) {
            console.log(`Unable to confirm wikipedia page is for taxon.`);
            // return networkRequestMade;
        } else {
            const speciesboxImage = matchSpeciesbox(article, "image");
            if (speciesboxImage) {
                image = speciesboxImage;
            }

            const speciesboxImageCaption = matchSpeciesbox(
                article,
                "image_caption"
            );
            if (speciesboxImageCaption) {
                imageCaption = speciesboxImageCaption.replace(
                    /\[\[|\]\]|''/g,
                    ""
                );
            }

            const speciesboxName = matchSpeciesbox(article, "name");
            if (speciesboxImage) {
                title = speciesboxName;
            }
        }
    } else {
        console.log(`No Wikipedia article for ${query}.`);
        // return networkRequestMade;
    }

    // Fetch the image's Wikimedia URL for downloading and get fetch the
    // article's plain-text version (only if the article was present in the
    // downloaded batch, to avoid fetching unrelated articles).
    const [imageWikimediaUrl, plainText, pageViews] = await Promise.allSettled([
        image && !db.extended[query]?.wikipedia?.image
            ? fetchImageWikimediaUrl(image)
            : undefined,
        article && !db.extended[query]?.wikipedia?.plaintext
            ? fetchArticlePlainText(canonicalName)
            : undefined,
        article && !db.extended[query]?.wikipedia?.pageviews
            ? fetchPageViews(canonicalName)
            : undefined,
    ]);

    networkRequestMade =
        networkRequestMade ||
        (imageWikimediaUrl.status === "fulfilled" &&
            !!imageWikimediaUrl.value) ||
        (plainText.status === "fulfilled" && !!plainText.value) ||
        (pageViews.status === "fulfilled" && !!pageViews.value);

    if (imageWikimediaUrl.status === "rejected") {
        console.error(imageWikimediaUrl.reason);
    }

    if (plainText.status === "rejected") {
        console.error(plainText.reason);
    }

    if (pageViews.status === "rejected") {
        console.error(pageViews.reason);
    }

    const originalImage = join(IMAGES_ORIGINAL_DIR, `/wikipedia/${query}.jpg`);
    const thumbnailImage = join(
        IMAGES_THUMBNAILS_DIR,
        `/wikipedia/${query}.jpg`
    );
    const largeImage = join(IMAGES_LARGE_DIR, `/wikipedia/${query}.jpg`);

    if (imageWikimediaUrl.status === "fulfilled" && imageWikimediaUrl.value) {
        networkRequestMade =
            (await downloadImage(
                imageWikimediaUrl.value,
                originalImage,
                thumbnailImage,
                largeImage
            )) || networkRequestMade;
    }

    db.extended = await updateJSON<ExtraLayout>(EXTENDED_FILE, query, {
        wikipedia: {
            timestamp: timestamp(),
            image:
                imageWikimediaUrl.status === "fulfilled" &&
                imageWikimediaUrl.value
                    ? {
                          original: originalImage,
                          thumbnail: thumbnailImage,
                          large: largeImage,
                      }
                    : undefined,
            imageCaption,
            title,
            plaintext:
                plainText.status === "fulfilled" ? plainText.value : undefined,
            link: plainText
                ? `https://en.wikipedia.org/wiki/${canonicalName.replace(
                      " ",
                      "_"
                  )}`
                : undefined,
            pageviews:
                pageViews.status === "fulfilled" ? pageViews.value : undefined,
        },
    });

    return networkRequestMade;
};
