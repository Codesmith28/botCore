import {
    ApplicationCommandOptionType,
    Client,
    CommandInteraction,
    REST,
    Routes,
    TextChannel,
} from "discord.js";
import {
    readAnalytics,
    readLastSent,
    writeAnalytics,
    writeLastSent,
} from "@/database/dbFunctions";
import { notionConnect } from "@/utils/notion";
import { env } from "@/config/config";
import { messageMaker, getAssigneeMentions } from "@/utils/messageMaker";
import { getViewsAndUsers } from "@/utils/analytics";
import { summarizeByDay, summarizeEntireThread } from "@/utils/chatSummary";

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

export async function summaryMessageHandler(interaction: CommandInteraction) {
    await interaction.deferReply();

    const summaryType = interaction.options.get("type")?.value as string;
    const channel = interaction.channel as TextChannel;

    try {
        let summary: string;

        switch (summaryType) {
            case "day":
                summary = await summarizeByDay(channel);
                break;
            case "entire_thread":
                if (!channel.isThread()) {
                    await interaction.editReply(
                        "This option is only available in a thread.",
                    );
                    return;
                }
                summary = await summarizeEntireThread(channel);
                break;
            default:
                await interaction.editReply("Invalid summary type.");
                return;
        }

        await interaction.editReply(`Here's the summary:\n\n${summary}`);
    } catch (error) {
        console.error("Error in chat summary command:", error);
        await interaction.editReply(
            "An error occurred while generating the summary. Please try again later.",
        );
    }
}

export function botHandler(client: Client) {
    client.once("ready", async () => {
        console.log("Discord bot is ready!");

        const commands = [
            {
                name: "summarize",
                description: "Summarize chat messages",
                options: [
                    {
                        name: "type",
                        description: "Type of summary",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            { name: "By Day", value: "day" },
                            { name: "Last Thread", value: "last_thread" },
                            { name: "Entire Thread", value: "entire_thread" },
                        ],
                    },
                ],
            },
        ];

        const rest = new REST({ version: "9" }).setToken(env.DISCORD_TOKEN);

        try {
            console.log("Started refreshing application (/) commands.");

            await rest.put(
                Routes.applicationGuildCommands(client.user!.id, env.GUILD_ID),
                { body: commands },
            );

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error(error);
        }

        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isCommand()) return;

            if (interaction.commandName === "summarize") {
                await summaryMessageHandler(interaction);
            }
        });

        setInterval(() => taskMessageHandler(client), 5 * 60 * 1000);
        setInterval(() => analyticsMessageHandler(client), 5 * 60 * 1000);
    });
}
