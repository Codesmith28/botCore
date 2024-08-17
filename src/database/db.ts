import { MongoClient, Collection, Db } from "mongodb";
import { env } from "@/config/config";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function initMongo(): Promise<void> {
    if (client && db) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        client = new MongoClient(env.MONGO_URI);
        await client.connect();
        console.log("Connected to MongoDB");

        db = client.db("botCore");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error;
    }
}

export function getCollection(collectionName: string): Collection {
    if (!db) {
        throw new Error("Database not initialized. Call initMongo first.");
    }
    return db.collection(collectionName);
}

export async function closeConnection(): Promise<void> {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log("Disconnected from MongoDB");
    }
}

export async function withDatabase<T>(operation: () => Promise<T>): Promise<T> {
    if (!client || !db) {
        await initMongo();
    }
    try {
        return await operation();
    } catch (error) {
        console.error("Database operation failed:", error);
        throw error;
    }
}
