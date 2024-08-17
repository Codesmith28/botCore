import { TextChannel } from "discord.js";

export async function countForWeek(channel: TextChannel): Promise<string> {
    try {
        const week = new Date();
        week.setDate(week.getDate() - 7);

        const messages = await channel.messages.fetch({ limit: 150 });
        const weekMessages = messages.filter((m) => m.createdAt >= week);

        // map the number of thumbs up reactions to user ids
        const thumbsUp = weekMessages
            .map((m) => m.reactions.cache.get("👍"))
            .filter((r) => r)
            .flatMap((r) => Array.from(r!.users.cache.keys()));

        // remove duplicates
        const uniqueUsers = Array.from(new Set(thumbsUp));

        return `There are ${uniqueUsers.length} active cp doers in the past week`;
    } catch (error) {
        console.error("Error counting active cp doers:", error);
        return "An error occurred while counting active cp doers.";
    }
}

export async function countForMonth(channel: TextChannel): Promise<string> {
    try {
        const month = new Date();
        month.setDate(month.getDate() - 30);

        const messages = await channel.messages.fetch({ limit: 150 });
        const monthMessages = messages.filter((m) => m.createdAt >= month);

        // map the number of thumbs up reactions to user ids
        const thumbsUp = monthMessages
            .map((m) => m.reactions.cache.get("👍"))
            .filter((r) => r)
            .flatMap((r) => Array.from(r!.users.cache.keys()));

        // remove duplicates
        const uniqueUsers = Array.from(new Set(thumbsUp));

        return `There are ${uniqueUsers.length} active cp doers in the past month`;
    } catch (error) {
        console.error("Error counting active cp doers:", error);
        return "An error occurred while counting active cp doers.";
    }
}
