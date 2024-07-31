import { MongoClient as MC, Collection } from "mongodb";
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
