import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { summaryMessageHandler } from "@/config/discord/functions/summaryHandler";

export const summarizeCommand = {
    data: new SlashCommandBuilder()
        .setName("summarize")
        .setDescription("Summarize chat messages")
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("Type of summary")
                .setRequired(true)
                .addChoices(
                    { name: "Day", value: "day" },
                    { name: "Thread", value: "entire_thread" },
                ),
        ),

    execute: async (interaction: CommandInteraction) => {
        await summaryMessageHandler(interaction);
    },
};
