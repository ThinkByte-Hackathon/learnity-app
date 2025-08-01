import dotenv from "dotenv";
import { Dialect } from "sequelize";

dotenv.config();

const config = {
    environment: process.env.NODE_ENV || "production",
    port: process.env.PORT || 4002,

    database: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 1433,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_DATABASE || "learnityDb",
        dialect: "mysql" as Dialect,
        storage: "./session.mysql",
        access: process.env.DATABASE_ACCESS || "false"
    },
}

export default config;
export const { environment, port, database } = config;
