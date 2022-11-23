import { join } from "path";

import Axios from "axios";
import chalk from "chalk";
import $ from "cheerio";
import { isTag, isText, NodeWithChildren } from "domhandler";

import {
    EXTENDED_FILE,
    IMAGES_LARGE_DIR,
    IMAGES_ORIGINAL_DIR,
    IMAGES_THUMBNAILS_DIR,
} from "../config";
import { Database } from "../db/loadDB";
import { ExtraLayout } from "../types/result";
import { downloadImage, timestamp, updateJSON } from "./scrapeUtils";

// Extract the text of an element until it reaches a <br /> element.
const extractTextUntilBr = (element: NodeWithChildren) => {
    let text = "";
    let children = [...element.children];
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isTag(child)) {
            if (child.name === "br") {
                break;
            }
            children = [
                ...children.slice(0, i + 1),
                ...((child as NodeWithChildren).children || []),
                ...children.slice(i + 1, children.length),
            ];
        } else if (isText(child)) {
            text += child.data;
        }
    }
    return text.trim().replace(/  /g, "");
};

/**
 *
 * @param query The plant's full scientific name.
 * @returns
 */
export const scrapeFlorabase = async (
    db: Database,
    query: string
): Promise<boolean> => {
    // Check if the plant has already been fetched from Florabase.
    if (db.extended[query]?.florabase?.timestamp !== undefined) {
        return false;
    }

    const url = `https://florabase.dpaw.wa.gov.au/search/quick?q=${query}`;

    console.log(` > Requesting ${chalk.blue(url)}`);
    const html = (await Axios.get(url)).data;

    const rows = $("tr", html);

    // Search <tr> rows for row with the matching query.
    const final = rows.toArray().find((row) =>
        $("td", row as any)
            .toArray()
            .find((node) => extractTextUntilBr(node) === query)
    );

    const anchors = $(final).find("a");

    let id: string | undefined;
    let hasImage = false;
    let hasProfile = false;

    for (const child of anchors) {
        if (child.type === "tag" && child.name === "a") {
            const href = child.attribs.href;
            const match = href.match(/^\/.*\/(\d+)$/);
            if (href && match && match?.length > 1) {
                id = match[1];
            }
            if (href && href.match(/\/browse\/photo/)) {
                hasImage = true;
            }
            if (href && href.match(/\/browse\/profile/)) {
                hasProfile = true;
            }
        }
    }

    console.log(` > Florabase id: ${id || "not found"}`);

    const originalImage = join(IMAGES_ORIGINAL_DIR, `/florabase/${query}.jpg`);
    const thumbnailImage = join(
        IMAGES_THUMBNAILS_DIR,
        `/florabase/${query}.jpg`
    );
    const largeImage = join(IMAGES_LARGE_DIR, `/florabase/${query}.jpg`);

    if (id && hasImage) {
        await downloadImage(
            `https://florabase.dpaw.wa.gov.au/science/timage/${id}ic1.jpg`,
            originalImage,
            thumbnailImage,
            largeImage
        );
    }

    db.extended = await updateJSON<ExtraLayout>(EXTENDED_FILE, query, {
        florabase: {
            timestamp: timestamp(),
            florabaseId: id || undefined,
            link: id
                ? `https://florabase.dpaw.wa.gov.au/browse/profile/${id}`
                : undefined,
            image:
                id && hasImage
                    ? {
                          original: originalImage,
                          thumbnail: thumbnailImage,
                          large: largeImage,
                      }
                    : undefined,
        },
    });

    return true;
};
