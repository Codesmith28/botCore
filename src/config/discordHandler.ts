import { Client, REST, Routes } from "discord.js";
import { env } from "@/config/config";
import { analyticsMessageHandler } from "@/config/discord/functions/analyticsHandler";
import { taskMessageHandler } from "@/config/discord/functions/taskHandler";

import { summarizeCommand } from "@/config/discord/commands/summarize";
import { cpCounterCommand } from "@/config/discord/commands/cpCounterCommand";

export function botHandler(client: Client) {
    client.once("ready", async () => {
        console.log("Discord bot is ready!");

        const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

        const commands = [
            summarizeCommand,
            cpCounterCommand,
            // Add other commands here
        ].map((command) => command.data.toJSON());

        try {
            console.log("Started refreshing application (/) commands.");

            await rest.put(
                Routes.applicationGuildCommands(client.user!.id, env.GUILD_ID),
                { body: commands }
            );

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error(error);
        }

        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isCommand()) return;

            switch (interaction.commandName) {
                case "summarize":
                    await summarizeCommand.execute(interaction);
                    break;
                case "count-active":
                    await cpCounterCommand.execute(interaction);
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
