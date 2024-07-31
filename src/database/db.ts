import { MongoClient as MC, Collection } from "mongodb";
import { env } from "@/config/config";

let mongoClient: MC;
let lastSentCollection: Collection;
let analyzeCollection: Collection;

export async function initMongo(): Promise<void> {
    try {
        mongoClient = new MC(env.MONGO_URI);
        await mongoClient.connect();
        const db = mongoClient.db("botCore");

        lastSentCollection = db.collection("lastSent");
        analyzeCollection = db.collection("analytics");
    } catch (err) {
        console.log(err);
    }
}
