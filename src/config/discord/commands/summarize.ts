import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { summaryMessageHandler } from "../functions/summaryHandler";

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
                    { name: "By Day", value: "day" },
                    { name: "Entire Thread", value: "entire_thread" },
                ),
        ),

    execute: async (interaction: CommandInteraction) => {
        await summaryMessageHandler(interaction);
    },
};
