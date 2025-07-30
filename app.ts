import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { sequelize } from "@data/db";
import cookieParser from "cookie-parser";
import { database, environment, port } from "./config";

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View Engine:
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "client", "views"));

// Static Routes:
app.use("/styles", express.static(path.join(process.cwd(), "client", "public", "css")));

import router from "./client";
app.use(router);

import "./models"; // Model senkronizeleri için import edilmesi gerekiyor.
// Global request tipleri için kullanılan tip dosyası:
import globalTypes from "./types/globalTypes"; // KULLANIMDA SİLME!
import logger from "./services/logger";

(async (): Promise<void> => {
    try {
        if (database.access !== "false") {
            await sequelize.sync({
                alter: environment === "development" ? true : false
            });
        }

        server.listen(port, () => {
            logger.info(`Client listen on port ${port}`, 1);
        });

    } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
    }
})();
