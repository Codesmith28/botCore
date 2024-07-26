import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NOTION_DATABASE_ID, NOTION_SECRET } from "./config";

const notionSecret = NOTION_SECRET;
const databaseId = NOTION_DATABASE_ID;

if (!notionSecret || !databaseId) {
    console.error("Missing Notion environment variables");
    process.exit(1);
}

export interface Task {
    title: string;
    message: string;
    daysLeft: number;
    assignees: string[];
}

let taskList: Task[] = [];
const notion = new Client({ auth: notionSecret });

export async function notionConnect(): Promise<Task[]> {
    taskList = []; // Clear the task list
    await queryDatabase();
    return taskList;
}

async function queryDatabase(): Promise<void> {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
        });

        for (const page of response.results) {
            const task = formatter(page as PageObjectResponse);
            if (task) {
                taskList.push(task);
            }
        }
    } catch (error) {
        console.error("Error querying Notion database:", error);
    }
}

function formatter(page: PageObjectResponse): Task | null {
    try {
        const properties = page.properties;

        // Assuming your Notion database has these properties
        const title = getPropertyValue(properties.Title, "title");
        const message = getPropertyValue(properties.Message, "rich_text");
        const dueDate = getPropertyValue(properties.DueDate, "date");
        const assignees = getPropertyValue(properties.Assignees, "people");
        const status = getPropertyValue(properties.Status, "select");

        // Skip tasks marked as done
        if (status?.toLowerCase() === "done") {
            return null;
        }

        const daysLeft = dueDate
            ? Math.ceil(
                (new Date(dueDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24),
            )
            : 0;

        return {
            title,
            message,
            daysLeft,
            assignees: assignees || [],
        };
    } catch (error) {
        console.error("Error formatting Notion page:", error);
        return null;
    }
}

function getPropertyValue(property: any, type: string): any {
    switch (type) {
        case "title":
            return property?.title[0]?.plain_text || "";
        case "rich_text":
            return property?.rich_text[0]?.plain_text || "";
        case "date":
            return property?.date?.start || null;
        case "people":
            return property?.people?.map((person: any) => person.name) || [];
        case "select":
            return property?.select?.name || "";
        default:
            return null;
    }
}

export function getTaskList(): Task[] {
    return taskList;
}
