import express from "express";
import cors from "cors";

import { Database } from "./loadDB";
import { generateResult } from "./resultGenerator";
import { Datapoint, Result } from "./types/db";

const PORT = process.env.PORT || 8080;

export const startServer = async (db: Database) => {
    const app = express();
    app.use(cors());

    app.get("/health", (req, res) => {
        req.params.tagId
        res.json({ online: true, message: "Status: Least Concern (LC)" });
    });

    app.get("/search/:query", async (req, res) => {
        const queryRaw = req.params.query;

        if (!queryRaw) {
            throw new Error("No query.");
        }

        res.json(await generateResult(db, queryRaw));
    });

    app.use('/images', express.static('./images'));

    // start the Express server
    app.listen(PORT, () => {
        console.info(`Server started at http://localhost:${PORT}.`);
    });
}
