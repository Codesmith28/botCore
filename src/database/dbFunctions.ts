import { Collection, ObjectId } from "mongodb";
import { getCollection } from "./db";
import { AnalyticsRecord, LastSentRecord } from "@/config/types";

let lastSentCollection: Collection | null = null;
let analyzeCollection: Collection | null = null;

function initializeCollections() {
    if (!lastSentCollection) {
        lastSentCollection = getCollection("lastSent");
    }
    if (!analyzeCollection) {
        analyzeCollection = getCollection("analytics");
    }
}

export async function readLastSent(): Promise<Date> {
    try {
        initializeCollections();
        const record = await lastSentCollection!.findOne<LastSentRecord>({
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
        initializeCollections();
        await lastSentCollection!.updateOne(
            { id: "lastSent" },
            { $set: { timestamp: t } },
            { upsert: true },
        );
    } catch (err) {
        console.error("Error writing last sent timestamp:", err);
    }
}

export async function readAnalytics(
    propertyId: string,
): Promise<AnalyticsRecord> {
    try {
        initializeCollections();
        const record = await analyzeCollection!.findOne<AnalyticsRecord>({
            propertyId,
        });
        return (
            record || {
                _id: new ObjectId().toString(),
                propertyId,
                views: 0,
                users: 0,
            }
        );
    } catch (err) {
        console.error("Error reading analytics record:", err);
        return {
            _id: new ObjectId().toString(),
            propertyId,
            views: 0,
            users: 0,
        };
    }
}

export async function writeAnalytics(
    propertyId: string,
    views: number,
    users: number,
): Promise<void> {
    try {
        initializeCollections();
        await analyzeCollection!.updateOne(
            { propertyId },
            {
                $set: { views, users },
            },
            { upsert: true },
        );
    } catch (err) {
        console.error("Error writing analytics record:", err);
    }
}
