import { Client, TextChannel } from "discord.js";
import { readLastSent, writeLastSent } from "./db.js";
import { notionConnect, Task, getTaskList } from "./notion";
import { DISCORD_CHANNEL_ID_GENERAL } from "./config.js";
import { MemberMap } from "./utils/types.js";

const generalChannelId = DISCORD_CHANNEL_ID_GENERAL;
const memberMap: { [key: string]: string } = MemberMap;

interface Message extends Task {
    message: string;
}

function getAssigneeMentions(assignees: string[]): string {
    return assignees
        .map((assignee) =>
            memberMap[assignee] ? `<@${memberMap[assignee]}>` : "",
        )
        .filter((mention) => mention !== "")
        .join(" ");
}

async function messageMaker(): Promise<Message[]> {
    const tasklist = getTaskList();
    console.log("Generating messages for tasks:");

    const messageList: Message[] = tasklist
        .filter((task) => task.daysLeft !== undefined)
        .map((task) => {
            let message: string;
            if (task.daysLeft < 0) {
                message = `Is overdue by ${-task.daysLeft} days`;
            } else if (task.daysLeft <= 5) {
                message = `Is pending and only ${task.daysLeft} days left`;
            } else {
                message = `Due in ${task.daysLeft} days`;
            }

            const fullMessage: Message = {
                ...task,
                message,
            };

            // Log each message
            console.log(`Title: ${fullMessage.title}`);
            console.log(`Message: ${fullMessage.message}`);
            console.log(`Days Left: ${fullMessage.daysLeft}`);
            console.log("Assignees:");
            fullMessage.assignees.forEach((assignee) =>
                console.log(`\t -> ${assignee}`),
            );
            console.log(
                "------------------------------------------------------",
            );

            return fullMessage;
        });

    return messageList;
}

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
        const mentions = getAssigneeMentions(message.assignees);
        const content = `## ${message.title}\n
                            ${message.message}\n
                            Days Left: ${message.daysLeft}\n
                            Assignees: ${mentions}`;
        await channel.send(content);
    }

    await writeLastSent(now);
}

export function botHandler(client: Client) {
    client.once("ready", () => {
        console.log("Discord bot is ready!");
        // Set up interval to run taskMessageHandler every 24 hours
        setInterval(() => taskMessageHandler(client), 24 * 60 * 60 * 1000);
        // Run taskMessageHandler immediately on startup
        taskMessageHandler(client);
    });
}
