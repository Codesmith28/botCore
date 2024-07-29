import { Client, TextChannel } from "discord.js";
import { readLastSent, writeLastSent } from "./db.js";
import { notionConnect, getMsgList } from "./notion";
import { DISCORD_CHANNEL_ID_GENERAL } from "./config.js";
import { MemberMap, Message } from "./utils/types.js";

const generalChannelId = DISCORD_CHANNEL_ID_GENERAL;
const memberMap: { [key: string]: string } = MemberMap;

function getAssigneeMentions(assignees: string[]): string {
    return assignees
        .map((assignee) =>
            memberMap[assignee] ? `<@${memberMap[assignee]}>` : "",
        )
        .filter((mention) => mention !== "")
        .join(" ");
}

async function messageMaker(): Promise<Message[]> {
    const msgList = getMsgList();
    console.log("Generating messages for tasks:");

    const messageList: Message[] = msgList
        .filter((msg) => msg?.daysLeft !== undefined)
        .map((msg) => {
            let message = "";

            if (msg?.daysLeft !== null && msg?.daysLeft !== undefined) {
                if (msg?.daysLeft < 0) {
                    message = `Is overdue by ${-msg?.daysLeft} days`;
                } else if (msg?.daysLeft <= 5) {
                    message = `Is pending and only ${msg?.daysLeft} days left`;
                } else {
                    message = `Due in ${msg?.daysLeft} days`;
                }
            }

            const fullMessage: Message = {
                ...msg,
                message,
            };

            // Log each message
            console.log(
                "------------------------------------------------------",
            );
            console.log(`Title: ${fullMessage.title}`);
            console.log(`Message: ${fullMessage.message}`);
            console.log(`Days Left: ${fullMessage.daysLeft}`);
            console.log("Assignees:");
            fullMessage.assignees?.forEach((assignee) =>
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
        if (message) {
            const mentions = getAssigneeMentions(message.assignees!);
            const content = `## ${message.title}\n ${message.message}\n Days Left: ${message.daysLeft}\n Assignees: ${mentions}`;
            await channel.send(content);
        }
    }

    await writeLastSent(now);
}

export function botHandler(client: Client) {
    client.once("ready", () => {
        console.log("Discord bot is ready!");
        setInterval(() => taskMessageHandler(client), 5 * 1000);
        taskMessageHandler(client);
    });
}
