import dotenv from "dotenv";
import { MongoClient as MongoDbClient, Collection } from "mongodb";

dotenv.config();

interface EnvVars {
    DISCORD_TOKEN: string;
    DISCORD_CHANNEL_ID_GENERAL: string;
    NOTION_SECRET: string;
    NOTION_DATABASE_ID: string;
    MONGO_URI: string;
}

const requiredEnvVars: (keyof EnvVars)[] = [
    "DISCORD_TOKEN",
    "DISCORD_CHANNEL_ID_GENERAL",
    "NOTION_SECRET",
    "NOTION_DATABASE_ID",
    "MONGO_URI",
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
} = loadAndCheckEnvVars();

export let MongoClient: typeof MongoDbClient;
export let MongoCollection: Collection;

export function checkNilErr(err: Error | null): void {
    if (err) {
        console.error(err);
        process.exit(1);
    }
}
