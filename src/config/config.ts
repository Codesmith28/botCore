import dotenv from "dotenv";
import { MongoClient as MongoDbClient, Collection } from "mongodb";
import { EnvVars } from "@/config/types";

dotenv.config();

const requiredEnvVars: (keyof EnvVars)[] = [
    "DISCORD_TOKEN",
    "DISCORD_CHANNEL_ID_GENERAL",
    "NOTION_SECRET",
    "NOTION_DATABASE_ID",
    "MONGO_URI",
    "ANALYTICS_PATH",
];

function loadAndCheckEnvVars(): EnvVars {
    const envVars: Partial<EnvVars> = {};

    for (const key of requiredEnvVars) {
        const value = process.env[key];
        if (!value) {
            throw new Error(
                `${key} not found in environment variables or .env file`
            );
        }
        envVars[key] = value;
    }

    return envVars as EnvVars;
}

export const {
    DISCORD_TOKEN,
    DISCORD_CHANNEL_ID_GENERAL,
    NOTION_SECRET,
    NOTION_DATABASE_ID,
    MONGO_URI,
    ANALYTICS_PATH,
} = loadAndCheckEnvVars();

export let MongoClient: typeof MongoDbClient;
export let MongoCollection: Collection;
