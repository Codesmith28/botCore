import { MongoClient as MC, Collection } from "mongodb";
import { LastSentRecord } from "@/config/types";
import { env } from "@/config/config";

let mongoClient: MC;
let mongoCollection: Collection;

export async function initMongo(): Promise<void> {
    try {
        mongoClient = new MC(env.MONGO_URI);
        await mongoClient.connect();
        const db = mongoClient.db("botCore");
        mongoCollection = db.collection("lastSent");
    } catch (err) {
        console.log(err);
    }
}

export async function readLastSent(): Promise<Date> {
    try {
        if (!mongoCollection) {
            throw new Error("MongoDB collection not initialized");
        }
        const record = await mongoCollection.findOne<LastSentRecord>({
            id: "lastSent",
        });
        return record ? record.timestamp : new Date(0);
    } catch (err) {
        console.error("Error reading last sent timestamp:", err);
        return new Date(0);
    }
}

export async function writeLastSent(t: Date): Promise<void> {
    try {
        if (!mongoCollection) {
            throw new Error("MongoDB collection not initialized");
        }
        await mongoCollection.updateOne(
            { id: "lastSent" },
            { $set: { timestamp: t } },
            { upsert: true },
        );
    } catch (err) {
        console.error("Error writing last sent timestamp:", err);
    }
}

export function getMongoClient(): MC {
    if (!mongoClient) {
        throw new Error("MongoDB client not initialized");
    }
    return mongoClient;
}

export function getMongoCollection(): Collection {
    if (!mongoCollection) {
        throw new Error("MongoDB collection not initialized");
    }
    return mongoCollection;
}
