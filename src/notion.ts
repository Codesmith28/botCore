import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NOTION_DATABASE_ID, NOTION_SECRET } from "./config";
import { Message } from "./utils/types";

const notionSecret = NOTION_SECRET;
const databaseId = NOTION_DATABASE_ID;

if (!notionSecret || !databaseId) {
    console.error("Missing Notion environment variables");
    process.exit(1);
}

let msgList: Message[] = [];

const notion = new Client({ auth: notionSecret });

export async function notionConnect(): Promise<Message[]> {
    msgList = []; // Clear the task list
    await queryDatabase();
    return msgList;
}

async function queryDatabase(): Promise<void> {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
        });

        console.log("Querying Notion database...");

        for (const page of response.results) {
            const task = formatter(page as PageObjectResponse);
            if (task) {
                msgList.push(task);
            }
        }
    } catch (error) {
        console.error("Error querying Notion database:", error);
    }
}

function formatter(page: PageObjectResponse): void | Message {
    try {
        const properties = page.properties;
        const title = getPropertyValue(properties.Task, "title");
        const dueDate = getPropertyValue(properties.Due, "date");
        const assignees = getPropertyValue(properties.Assignee, "people") || [];
        const status = getPropertyValue(properties.Done, "status");

        // Skip tasks marked as done
        if (status?.name === "Done") {
            return;
        }

        // Skip if no due date present
        if (!dueDate) {
            return;
        }

        const daysLeft = dueDate
            ? Math.ceil(
                  (new Date(dueDate).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24),
              )
            : null;

        if (!daysLeft) return;

        return {
            title: title || "Untitled",
            daysLeft,
            assignees: assignees.map((assignee: any) => assignee.name),
        };
    } catch (error) {
        console.error("Error formatting Notion page:", error);
        return;
    }
}

function getPropertyValue(property: any, type: string): any {
    if (!property) return null;

    switch (type) {
        case "title":
            return property.title?.[0]?.plain_text || null;
        case "date":
            return property.date?.start || null;
        case "people":
            return property.people || [];
        case "status":
            return property.status || null;
        default:
            return null;
    }
}

export function getMsgList(): Message[] {
    return msgList;
}
