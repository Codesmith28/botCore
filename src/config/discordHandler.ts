import { Client, TextChannel } from "discord.js";
import { readLastSent, writeLastSent } from "@/config/db";
import { notionConnect } from "@/utils/notion";
import { env } from "@/config/config";
import { messageMaker, getAssigneeMentions } from "@/utils/messageMaker";

const generalChannelId = env.DISCORD_CHANNEL_ID_GENERAL;

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
        setInterval(() => taskMessageHandler(client), 5 * 60 * 1000);
    });
}
