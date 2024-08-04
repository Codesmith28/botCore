import { env } from "@/config/config";
import { readAnalytics, writeAnalytics } from "@/database/dbFunctions";
import { getViewsAndUsers } from "@/utils/analytics";
import { Client, TextChannel } from "discord.js";

const analyticsChannelId = env.DISCORD_CHANNEL_ID_ANALYTICS;

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

    const currentAnalytics = await readAnalytics(env.PCLUB_PROPERTY_ID);
    const { views, users } = await getViewsAndUsers(env.PCLUB_PROPERTY_ID);
    await writeAnalytics(env.PCLUB_PROPERTY_ID, views, users);

    let viewsThreshold =
        Math.floor(currentAnalytics.views / 500) < Math.floor(views / 500);
    let usersThreshold =
        Math.floor(currentAnalytics.users / 50) < Math.floor(users / 50);

    if (viewsThreshold || usersThreshold) {
        const content = `
        📊 **Analytics Update** 📊

        **🔹 Views:** **${views}** ${views ? "🚀" : ""} !!!
        **🔹 Users:** **${users}** ${usersThreshold ? "🎉" : ""} !!!

        `;
        await channel.send(content);
        console.log("Analytics message sent! Content:", content);
    } else {
        console.log("Thresholds not crossed. No message sent.");
    }
}
