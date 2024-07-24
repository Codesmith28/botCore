import { MongoClient, Collection } from "mongodb";
import { LastSentRecord } from "@types";

let mongoClient: MongoClient;
let mongoCollection: Collection<LastSentRecord>;

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";

export async function initMongo(): Promise<void> {
    try {
        mongoClient = new MongoClient(mongoURI);
        await mongoClient.connect();
        mongoCollection = mongoClient
            .db("botCore")
            .collection<LastSentRecord>("lastSent");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export { mongoCollection };
