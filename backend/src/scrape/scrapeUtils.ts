import fs, { existsSync } from "fs";

import ansiEscapes from "ansi-escapes";
import Axios from "axios";
import { readFile, writeFile } from "fs/promises";
import ImageMagick from "imagemagick";
import lockFile from "lockfile";

export const timestamp = () => Math.floor(new Date().getTime() / 1000);

export const sleep = async (ms: number) => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
};

// Lockfile for accessing extended data JSON file.
const LOCKFILE = "./extendedData-lockfile.lock";
const getLock = async () => {
    while (true) {
        try {
            lockFile.lockSync(LOCKFILE);
            return;
        } catch (error) {
            // Ignore error;
        }
        await sleep(10);
    }
};
export const freeLock = () => {
    lockFile.unlockSync(LOCKFILE);
};

/**
 * Download an image over HTTP/HTTPS and save it to the local filesystem.
 *
 * @param url The URL to fetch the image from.
 * @param imagePath The filesystem path to save the image to. Use __dirname to
 * refer to files relative to the reposistory.
 * @returns A promise which will reject if either the image download or the
 * writing to the file fail, and the boolean value represents whether a network
 * request was made.
 */
export const downloadImage = async (
    url: string,
    imagePath: string,
    thumbnailPath: string,
    largePath: string
): Promise<boolean> => {
    if (existsSync(imagePath)) {
        return false;
    }

    console.log(` > Downloading image ${url} to ${imagePath}`);

    const response = await Axios({
        url,
        responseType: "stream",
    });
    try {
        await new Promise<void>((resolve, reject) => {
            response.data
                .pipe(fs.createWriteStream(imagePath))
                .on("finish", () => resolve())
                .on("error", (e: any) => reject(e));
        });
    } catch (error) {
        console.error(error);
    }

    const imageBuffer = await readFile(imagePath);
    console.log(ansiEscapes.image(imageBuffer, { width: "200px" }));

    // Save thumbnail.
    await new Promise<void>((resolve, reject) =>
        ImageMagick.resize(
            {
                srcPath: imagePath,
                dstPath: thumbnailPath,
                quality: 0.8,
                strip: true,
                width: 250,
                height: 250,
            },
            (error, _result) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            }
        )
    );

    return true;
};

/**
 * Read a JSON file.
 */
export const readJSON = async (
    filename: string,
    skipLock?: boolean
): Promise<any> => {
    if (!skipLock) {
        await getLock();
    }

    try {
        const raw = await readFile(filename);
        const result = JSON.parse(raw.toString());

        if (!result) {
            throw new Error(`Empty JSON returned from ${filename}.`);
        }

        if (!skipLock) {
            freeLock();
        }

        return result;
    } catch (error) {
        if (!skipLock) {
            freeLock();
        }
    }
};

/**
 * Write to a JSON file.
 */
export const writeToJSON = async (
    filename: string,
    json: any,
    skipLock?: boolean
): Promise<void> => {
    if (!skipLock) {
        await getLock();
    }

    try {
        await writeFile(filename, JSON.stringify(json, null, "    "));
        if (!skipLock) {
            freeLock();
        }
    } catch (error) {
        if (!skipLock) {
            freeLock();
        }
    }
};

// From https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends object
        ? RecursivePartial<T[P]>
        : T[P];
};

/**
 * Update a JSON file, modifying the value under the given query and keys.
 *
 * @param filename The path to the JSON file to update.
 * @param query The root key in the JSON object.
 * @param keys Additional keys to reach the value to be updated.
 * @param value The new value for the field accessed by the given keys.
 */
export const updateJSON = async <T>(
    filename: string,
    query: string,
    newValues: RecursivePartial<T>
): Promise<any> => {
    await getLock();

    try {
        const json = await readJSON(filename, true);
        json[query] = deepMerge(json[query] || {}, newValues);
        await writeToJSON(filename, json, true);
        freeLock();
        return json;
    } catch (error) {
        freeLock();
        throw error;
    }
};

const isObject = (item: unknown): boolean =>
    Boolean(item && typeof item === "object" && !Array.isArray(item));

// Perform a deep merge of two objects.
// From https://thewebdev.info/2021/03/06/how-to-deep-merge-javascript-objects/
const deepMerge = (
    target: { [key: string | number]: any },
    source: { [key: string | number]: any }
) => {
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, {
                        [key]: {},
                    });
                deepMerge(target[key], source[key]);
            } else if (source[key]) {
                Object.assign(target, {
                    [key]: source[key],
                });
            }
        }
    }

    return target;
};

export const titleCase = (title: string): string =>
    title
        .split(" ")
        .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
        .join(" ");
