import { TextChannel, Collection, Message } from "discord.js";

export async function countThumbReactions(
    channel: TextChannel,
    timeRange: "week" | "month",
): Promise<string> {
    try {
        const now = new Date();
        const pastDate = new Date();
        if (timeRange === "week") {
            pastDate.setDate(now.getDate() - 7);
        } else if (timeRange === "month") {
            pastDate.setMonth(now.getMonth() - 1);
        }

        let allMessages: Collection<string, Message> = new Collection();
        let lastId: string | undefined;

        while (true) {
            const options: { limit: number; before?: string } = { limit: 100 };
            if (lastId) options.before = lastId;
            const messages = await channel.messages.fetch(options);
            allMessages = allMessages.concat(messages);
            if (messages.size < 100 || messages.last()!.createdAt < pastDate)
                break;
            lastId = messages.last()!.id;
        }

        const filteredMessages = allMessages.filter(
            (m) => m.createdAt >= pastDate && m.createdAt <= now,
        );

        const userReactionCount = new Map<string, number>();

        for (const message of filteredMessages.values()) {
            const thumbReaction = message.reactions.cache.find(
                (reaction) => reaction.emoji.name === "👍",
            );

            if (thumbReaction) {
                // Fetch all users who reacted with thumbs up
                const users = await thumbReaction.users.fetch();
                users.forEach((user) => {
                    if (!user.bot) {
                        const userId = user.id;
                        const count = userReactionCount.get(userId) || 0;
                        userReactionCount.set(userId, count + 1);
                    }
                });
            }
        }

        // Generate the response string
        let response = `Thumb reactions for the past ${timeRange}:\n\n`;
        userReactionCount.forEach((count, userId) => {
            response += `<@${userId}> solves ${count} for past ${timeRange}\n`;
        });

        return response;
    } catch (error) {
        console.error("Error counting thumb reactions:", error);
        return "An error occurred while counting thumb reactions.";
    }
}
