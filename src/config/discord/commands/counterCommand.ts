import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { cpCounterHandler } from "../functions/cpCounterHandler";

export const counterCommand = {
    data: new SlashCommandBuilder()
        .setName("count-active")
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

    execute: async (interaction: CommandInteraction) => {
        await cpCounterHandler(interaction);
    },
};
