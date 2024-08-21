import {
    Client,
    CommandInteraction,
    PermissionsBitField,
    REST,
    Routes,
} from "discord.js";
import { env } from "@/config/config";
import { analyticsMessageHandler } from "@/config/discord/functions/analyticsHandler";
import { taskMessageHandler } from "@/config/discord/functions/taskHandler";

import { summarizeCommand } from "@/config/discord/commands/summarize";
import { counterCommand } from "./discord/commands/counterCommand";

async function handleCheckAdmin(
    memberPermissions: Readonly<PermissionsBitField>,
    interaction: CommandInteraction,
) {
    if (!memberPermissions.has("Administrator")) {
        await interaction.reply({
            content: "You do not have permission to use this command.",
            ephemeral: true,
        });
    }

    return;
}

export function botHandler(client: Client) {
    client.once("ready", async () => {
        console.log("Discord bot is ready!");

        const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

        const commands = [
            summarizeCommand,
            counterCommand,
            // Add other commands here
        ].map((command) => command.data.toJSON());

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

            // Check if interaction.member is null or undefined
            if (!interaction.member || !interaction.guild) {
                await interaction.reply({
                    content: "This command can only be used in a server.",
                    ephemeral: true,
                });
                return;
            }

            // Check if the user has the Administrator permission
            const memberPermissions = interaction.member
                .permissions as Readonly<PermissionsBitField>;

            switch (interaction.commandName) {
                case "summarize":
                    await summarizeCommand.execute(interaction);
                    break;
                case "count-active":
                    await handleCheckAdmin(memberPermissions, interaction);
                    await counterCommand.execute(interaction);
                    break;
                // case "otherCommand":
                //     await otherCommand.execute(interaction);
                //     break;
                default:
                    console.log(`Unknown command: ${interaction.commandName}`);
            }
        });

        setInterval(() => taskMessageHandler(client), 30 * 60 * 1000);
        setInterval(() => analyticsMessageHandler(client), 30 * 60 * 1000);
    });
}
