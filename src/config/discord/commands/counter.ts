import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const counterCommand = {
    data: new SlashCommandBuilder()
        .setName("countActive")
        .setDescription("Count active cp doers")
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("Set Time Range")
                .setRequired(true)
                .addChoices(
                    { name: "Week", value: "week" },
                    { name: "Month", value: "month" },
                ),
        ),
};
