import { Collection } from "mongodb";
import { LastSentRecord } from "@/config/types";

let mongoCollection: Collection;

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
