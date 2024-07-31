import { Client, TextChannel } from "discord.js";
import { readLastSent, writeLastSent } from "@/database/dbFunctions";
import { notionConnect } from "@/utils/notion";
import { env } from "@/config/config";
import { messageMaker, getAssigneeMentions } from "@/utils/messageMaker";
import { getViewsAndUsers } from "@/utils/analytics";

const generalChannelId = env.DISCORD_CHANNEL_ID_GENERAL;
const analyticsChannelId = env.DISCORD_CHANNEL_ID_ANALYTICS;

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

export async function analyticsMessageHandler(client: Client) {
    if (!analyticsChannelId) {
        console.error("Missing ANALYTICS_CHANNEL_ID");
        return;
    }

    const channel = await client.channels.fetch(analyticsChannelId);

    if (!(channel instanceof TextChannel)) {
        console.error("Invalid channel type");
        return;
    }

    const { views, users } = await getViewsAndUsers(env.PCLUB_PROPERTY_ID);
    const content = `Views: ${views}\nUsers: ${users}`;
    await channel.send(content);
    console.log("Analytics message sent! with content:", content);

    return;
}

export function botHandler(client: Client) {
    client.once("ready", () => {
        console.log("Discord bot is ready!");
        setInterval(() => taskMessageHandler(client), 5 * 60 * 1000);
        setInterval(() => analyticsMessageHandler(client), 5 * 60 * 1000);
    });
}
