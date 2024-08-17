import { summarizeByDay, summarizeEntireThread } from "@/utils/chatSummary";
import { CommandInteraction, TextChannel } from "discord.js";

export async function summaryMessageHandler(interaction: CommandInteraction) {
    let deferred = false;
    try {
        await interaction.deferReply();
        deferred = true;

        const summaryType = interaction.options.get("type")?.value as string;
        const channel = interaction.channel as TextChannel;

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

        await interaction.editReply(`${summary}`);
    } catch (error) {
        console.error("Error in chat summary command:", error);
        if (deferred) {
            await interaction.editReply(
                "An error occurred while generating the summary. Please try again later.",
            );
        } else {
            // If deferReply failed, try to send a new reply
            try {
                await interaction.reply(
                    "An error occurred while generating the summary. Please try again later.",
                );
            } catch (replyError) {
                console.error("Failed to send error message:", replyError);
            }
        }
    }
}
