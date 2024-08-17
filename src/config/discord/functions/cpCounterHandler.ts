import { env } from "@/config/config";
import { countForMonth, countForWeek } from "@/utils/cpCounter";
import { CommandInteraction, TextChannel } from "discord.js";

const cpChannel = env.DISCORD_CHANNEL_ID_CP;

export async function cpCounterHandler(interaction: CommandInteraction) {
    let defered = false;
    try {
        await interaction.deferReply();
        defered = true;

        const time = interaction.options.get("time")?.value as string;

        let response: string;
        switch (time) {
            case "week":
                response = await countForWeek(cpChannel);
                break;
            case "month":
                response = await countForMonth(cpChannel);
                break;
            default:
                response = "Invalid time range";
                break;
        }

        await interaction.editReply(response);
    } catch (error) {
        console.log("Error in cp counter command:", error);
        if (defered) {
            await interaction.editReply(
                "An error occurred while counting active cp doers. Please try again later.",
            );
        } else {
            try {
                await interaction.reply(
                    "An error occurred while counting active cp doers. Please try again later.",
                );
            } catch (replyError) {
                console.error("Failed to send error message:", replyError);
            }
        }
    }
}
