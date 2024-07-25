import { Client, TextChannel } from "discord.js";
import { readLastSent, writeLastSent } from "./db";
import { notionConnect, Task } from "./notion";

const generalChannelId = process.env.GENERAL_CHANNEL_ID;
const memberMap: { [key: string]: string } = JSON.parse(
    process.env.MEMBER_MAP || "{}"
);

export async function taskMessageHandler(client: Client) {
    if (!generalChannelId) {
        console.error("Missing GENERAL_CHANNEL_ID");
        return;
    }

    const channel = await client.channels.fetch(generalChannelId);
    if (!(channel instanceof TextChannel)) {
        console.error("Invalid channel type");
        return;
    }

    const lastSent = await readLastSent();
    const now = new Date();

    if (now.getTime() - lastSent.getTime() < 24 * 60 * 60 * 1000) {
        console.log("Message already sent today, skipping...");
        return;
    }

    await notionConnect();
    const msgList = await messageMaker();

    for (const message of msgList) {
        const mentions = message.assignees
            .map((assignee) =>
                memberMap[assignee] ? `<@${memberMap[assignee]}>` : ""
            )
            .filter((mention) => mention !== "");

        const content = `## ${message.title}
${message.message}
Days Left: ${message.daysLeft}
Assignees: ${mentions.join(" ")}`;

        await channel.send(content);
    }

    await writeLastSent(now);
}

export function botHandler(client: Client) {
    client.once("ready", () => {
        console.log("Discord bot is ready!");
    });

    client.on("messageCreate", async (message) => {
        // Add any message handling logic here
    });
}

async function messageMaker(): Promise<Task[]> {
    // Implement your logic to create messages from Notion tasks
    // This function should return an array of Task objects
    return [];
}
