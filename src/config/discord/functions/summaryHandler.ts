import { summarizeByDay, summarizeEntireThread } from "@/utils/chatSummary";
import { CommandInteraction, TextChannel } from "discord.js";

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
