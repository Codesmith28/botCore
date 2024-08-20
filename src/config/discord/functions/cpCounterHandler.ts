import { env } from "@/config/config";
import { countThumbReactions } from "@/utils/cpCounter";
import { CommandInteraction, TextChannel } from "discord.js";

export async function cpCounterHandler(interaction: CommandInteraction) {
    let defered = false;
    try {
        await interaction.deferReply();
        defered = true;

        const time = interaction.options.get("time")?.value as string;
        const cpChannel = interaction.guild?.channels.cache.get(
            env.DISCORD_CHANNEL_ID_CP,
        ) as TextChannel;

        let response: string;
        switch (time) {
            case "week":
                response = await countThumbReactions(cpChannel, "week");
                break;
            case "month":
                response = await countThumbReactions(cpChannel, "month");
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
