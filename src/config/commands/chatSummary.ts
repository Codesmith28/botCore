import {
    ApplicationCommandOptionType,
    CommandInteraction,
    TextChannel,
    ThreadChannel,
} from "discord.js";
import {
    summarizeByDay,
    summarizeLastThread,
    summarizeEntireThread,
} from "@/utils/chatSummary";

export const name = "summarize";
export const description = "Summarize chat messages";
export const options = [
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
];

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();

    const summaryType = interaction.options.get("type")?.value as string;
    const channel = interaction.channel as TextChannel | ThreadChannel;

    try {
        let summary: string;

        switch (summaryType) {
            case "day":
                summary = await summarizeByDay(channel);
                break;
            case "last_thread":
                if (channel.isThread()) {
                    await interaction.editReply(
                        'This option is not available in a thread. Use "Entire Thread" instead.'
                    );
                    return;
                }
                summary = await summarizeLastThread(channel as TextChannel);
                break;
            case "entire_thread":
                if (!channel.isThread()) {
                    await interaction.editReply(
                        "This option is only available in a thread."
                    );
                    return;
                }
                summary = await summarizeEntireThread(channel as ThreadChannel);
                break;
            default:
                await interaction.editReply("Invalid summary type.");
                return;
        }

        await interaction.editReply(`Here's the summary:\n\n${summary}`);
    } catch (error) {
        console.error("Error in chat summary command:", error);
        await interaction.editReply(
            "An error occurred while generating the summary. Please try again later."
        );
    }
}
