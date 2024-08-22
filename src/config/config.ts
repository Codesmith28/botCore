import dotenv from "dotenv";
import { MongoClient as MongoDbClient, Collection } from "mongodb";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "production";

// Load the appropriate .env file
if (NODE_ENV === "development") {
    dotenv.config({ path: path.resolve(process.cwd(), ".dev.env") });
} else {
    dotenv.config();
}

const requiredEnvVars = [
    "GUILD_ID",
    "DISCORD_TOKEN",
    "DISCORD_CHANNEL_ID_GENERAL",
    "DISCORD_CHANNEL_ID_ANALYTICS",
    "DISCORD_CHANNEL_ID_CP",

    "NOTION_SECRET",
    "NOTION_DATABASE_ID",

    "MONGO_URI",

    "ANALYTICS_PATH",
    "GOOGLE_EMAIL",
    "GOOGLE_PK",
    "PCLUB_PROPERTY_ID",

    "GEMINI_API_KEY",
] as const;

function loadAndCheckEnvVars() {
    const env: { [key: string]: string } = {};
    for (const key of requiredEnvVars) {
        const value = process.env[key];
        if (!value) {
            throw new Error(
                `${key} not found in environment variables or {NODE_ENV === "development" ? ".dev.env" : ".env"} file`,
            );
        }
        env[key] = value;
    }
    return env;
}

export const env = loadAndCheckEnvVars();
export let MongoClient: typeof MongoDbClient;
export let MongoCollection: Collection;

console.log(`Running in ${NODE_ENV} mode`);
