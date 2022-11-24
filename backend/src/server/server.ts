import { existsSync, readdirSync } from "fs";
import http from "http";
import https from "https";
import { join } from "path";

import cors from "cors";
import express from "express";
import { readFile } from "fs/promises";
import helmet from "helmet";

import { FE_BUILD_DIR, HTTP_PORT, HTTPS_PORT, IMAGES_DIR } from "../config";
import { Database } from "../db/loadDB";
import { searchEngine } from "./searchEngine";

// Start listening on `PORT` for incoming requests.
export const startServer = async (db: Database) => {
    // Check if HTTPS certificates are present.
    const httpsEnabled = existsSync("/etc/letsencrypt/live");

    const app = express();
    app.use(cors());

    // Enable HTTPS redirects and security headers.
    if (httpsEnabled) {
        // https://expressjs.com/en/advanced/best-practice-security.html
        app.use(helmet());
        app.disable("x-powered-by");

        app.all("*", (req, res, next) => {
            if (req.secure) {
                return next();
            }
            res.redirect(
                "https://" +
                    req.hostname +
                    (HTTPS_PORT !== 443 ? ":" + HTTPS_PORT : "") +
                    req.url
            );
        });
    }

    // A health endpoint indicating that the server is up.
    app.get<{ tagId: string }>("/api/health", (req, res) => {
        res.json({ online: true, message: "Status: Least Concern (LC)" });
    });

    // The main search endpoint. Accepts a query parameter as the last section
    // of the endpoint's path - e.g. `localhost:8080/search/Banksia`.
    app.get("/api/search/:query", async (req, res) => {
        const queryRaw = req.params.query;

        if (!queryRaw) {
            throw new Error("No query.");
        }

        console.log(`Handling query ${encodeURIComponent(queryRaw)}`);

        try {
            res.json(searchEngine(db, queryRaw));
        } catch (error: any) {
            console.error(error);
            res.status(500).send(error?.message || `Unable to handle request.`);
        }
    });

    // Serve the images in IMAGES_DIR from the /images endpoint - e.g.
    // `localhost:8080/images/wikipedia/Acacia%20Mill..jpg`
    app.use("/api/images", express.static(IMAGES_DIR));

    // Serve frontend production build.
    app.use("/", express.static(FE_BUILD_DIR));

    // Custom 404
    app.use((req, res, next) => {
        const notFoundPath = join(FE_BUILD_DIR, "index.html");
        if (existsSync(notFoundPath)) {
            res.status(404).sendFile(join(FE_BUILD_DIR, "index.html"));
        } else {
            res.status(404).send(`Resource not found.`);
        }
    });

    if (httpsEnabled) {
        // TODO: This assumes there's only one set of keys.
        const certdir = readdirSync("/etc/letsencrypt/live").filter(
            (f) => f !== "README"
        )[0];

        const key = await readFile(
            `/etc/letsencrypt/live/${certdir}/privkey.pem`
        );
        const cert = await readFile(
            `/etc/letsencrypt/live/${certdir}/fullchain.pem`
        );

        // start the server
        https.createServer({ key, cert }, app).listen(HTTPS_PORT, () => {
            console.info(`HTTPS server started on port ${HTTPS_PORT}...`);
        });

        // redirect HTTP server
        app.all("*", (req, res) => res.redirect(300, "https://localhost"));
        const httpServer = http.createServer(app);
        httpServer.listen(80, () =>
            console.info(`HTTP server started on port ${HTTP_PORT}...`)
        );
    } else {
        app.listen(HTTP_PORT, () => {
            console.info(`HTTP server started on port ${HTTP_PORT}...`);
        });
    }
};
