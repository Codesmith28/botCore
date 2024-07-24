import { mongoCollection } from "@database/db";

export async function readLastSent(): Promise<Date | null> {
    try {
        const record = await mongoCollection.findOne({ _id: "lastSent" });
        return record ? record.timestamp : null;
    } catch (error) {
        console.error("Error reading last sent:", error);
        throw error;
    }
}

export async function writeLastSent(timestamp: Date): Promise<void> {
    try {
        await mongoCollection.updateOne(
            { _id: "lastSent" },
            { $set: { timestamp } },
            { upsert: true },
        );
    } catch (error) {
        console.error("Error writing last sent:", error);
        throw error;
    }
}
