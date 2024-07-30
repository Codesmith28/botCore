import dotenv from "dotenv";
import { MongoClient as MongoDbClient, Collection } from "mongodb";

dotenv.config();

const requiredEnvVars = [
    "DISCORD_TOKEN",
    "DISCORD_CHANNEL_ID_GENERAL",
    "NOTION_SECRET",
    "NOTION_DATABASE_ID",
    "MONGO_URI",
    "ANALYTICS_PATH",
] as const;

function loadAndCheckEnvVars() {
    const envVars: { [key: string]: string } = {};

    for (const key of requiredEnvVars) {
        const value = process.env[key];
        if (!value) {
            throw new Error(
                `${key} not found in environment variables or .env file`,
            );
        }
        envVars[key] = value;
    }

    return envVars;
}

const envVars = loadAndCheckEnvVars();

export const {
    DISCORD_TOKEN,
    DISCORD_CHANNEL_ID_GENERAL,
    NOTION_SECRET,
    NOTION_DATABASE_ID,
    MONGO_URI,
    ANALYTICS_PATH,
} = envVars;

export let MongoClient: typeof MongoDbClient;
export let MongoCollection: Collection;
