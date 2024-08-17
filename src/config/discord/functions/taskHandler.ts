import { env } from "@/config/config";
import { readLastSent, writeLastSent } from "@/database/dbFunctions";
import { messageMaker, getAssigneeMentions } from "@/utils/messageMaker";
import { notionConnect } from "@/utils/notion";
import { Client, TextChannel } from "discord.js";

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
