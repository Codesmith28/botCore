import { Collection, ObjectId } from "mongodb";
import { AnalyticsRecord, LastSentRecord } from "@/config/types";

let lastSentCollection: Collection<LastSentRecord>;

export async function readLastSent(): Promise<Date> {
    try {
        if (!lastSentCollection) {
            throw new Error("MongoDB collection not initialized");
        }
        const record = await lastSentCollection.findOne<LastSentRecord>({
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
        if (!lastSentCollection) {
            throw new Error("MongoDB collection not initialized");
        }
        await lastSentCollection.updateOne(
            { id: "lastSent" },
            { $set: { timestamp: t } },
            { upsert: true },
        );
    } catch (err) {
        console.error("Error writing last sent timestamp:", err);
    }
}

let analyzeCollection: Collection<AnalyticsRecord>;

export async function getViewsAndUsers(
    propertyId: string,
    newViews: number,
    newUsers: number,
): Promise<AnalyticsRecord> {
    try {
        if (!analyzeCollection) {
            throw new Error("MongoDB collection not initialized");
        }

        const updatedRecord: Partial<AnalyticsRecord> = {
            views: newViews,
            users: newUsers,
        };

        const result = await analyzeCollection.findOneAndUpdate(
            { propertyId },
            { $set: updatedRecord },
            { upsert: true, returnDocument: "after" },
        );

        if (result?.views && result?.users) {
            return result;
        } else {
            throw new Error("Failed to update or insert the record");
        }
    } catch (err) {
        console.error("Error updating analytics record:", err);

        // In case of error, return a record with the provided data and a generated ID
        return {
            _id: new ObjectId().toString(),
            propertyId,
            views: newViews,
            users: newUsers,
        };
    }
}
