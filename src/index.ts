import "tsconfig-paths/register";
import { Client, GatewayIntentBits } from "discord.js";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { botHandler } from "@/config/discordHandler";
import { initMongo } from "@/config/db";
import { env } from "@/config/config";
import { getViewsAndUsers } from "./utils/analytics";

dotenv.config();

const token = env.DISCORD_TOKEN;
const mongoUri = env.MONGO_URI;

if (!token || !mongoUri) {
    console.error("Missing environment variables");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req: Request, res: Response) => {
    console.log("Health check endpoint accessed");
    res.send("OK");
});

async function main() {
    try {
        // Connect to MongoDB
        await initMongo();

        // Set up Discord bot
        botHandler(client);
        await client.login(token);
        console.log("Bot is running...");

        // Start Express server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        // Handle graceful shutdown
        process.on("SIGINT", async () => {
            console.log("Received SIGINT. Shutting down gracefully...");
            await client.destroy();
            process.exit(0);
        });
    } catch (error) {
        console.error("Error in main function:", error);
        process.exit(1);
    }
}

main();
