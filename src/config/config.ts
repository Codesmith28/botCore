import dotenv from "dotenv";
import { MongoClient as MongoDbClient, Collection } from "mongodb";

dotenv.config();

const requiredEnvVars = [
    "GUILD_ID",
    "DISCORD_TOKEN",
    "DISCORD_CHANNEL_ID_GENERAL",
    "DISCORD_CHANNEL_ID_ANALYTICS",
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
    const env: { [key: string]: any } = {};

    for (const key of requiredEnvVars) {
        const value = process.env[key];
        if (!value) {
            throw new Error(
                `${key} not found in environment variables or .env file`
            );
        }
        env[key] = value;
    }

    return env;
}

export const env = loadAndCheckEnvVars();

export let MongoClient: typeof MongoDbClient;
export let MongoCollection: Collection;
