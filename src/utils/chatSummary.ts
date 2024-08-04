import { TextChannel, ThreadChannel, Message } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/config/config";
import path from "path";
import fs from "fs";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY!);

const logFilePath = path.resolve(__dirname, "app.log");
function logToFile(message: string) {
    fs.appendFile(logFilePath, message + "\n", (err) => {
        if (err) {
            console.error("Error writing to log file:", err);
        }
    });
}

async function summarizeMessages(messages: Message[]): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const messageContents = messages
            .map((m) => {
                if (m.content) return `${m.author.username}: ${m.content}`;
                if (m.embeds.length > 0)
                    return `${m.author.username}: [Embed Content]`;
                return null;
            })
            .filter((content) => content !== null)
            .join("\n");

        const prompt = `Summarize the following chat messages:\n\n${messageContents}\n\nProvide a concise summary of the main points discussed.`;

        const result = await model.generateContent(prompt);
        if (!result || !result.response) {
            throw new Error("Failed to generate summary");
        }

        //debugging in app.log file:

        //logToFile("Messages used:");
        //messages.forEach((m) => logToFile(m.content));
        //logToFile("Prompt used:");
        //logToFile(prompt);
        //logToFile("Summary generated:");
        //logToFile(result.response.text());

        console.log(
            "Messages used:",
            messages.map((m) => m.content),
        );
        console.log("Prompt used:", prompt);
        console.log("Summary generated:", result.response.text());

        return result.response.text();
    } catch (error) {
        console.error("Error summarizing messages:", error);
        return "An error occurred while summarizing the messages.";
    }
}

export async function summarizeByDay(
    channel: TextChannel | ThreadChannel,
): Promise<string> {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const messages = await channel.messages.fetch({ limit: 100 });
        const todayMessages = messages.filter((m) => m.createdAt >= today);

        const summary = await summarizeMessages(
            Array.from(todayMessages.values()),
        );

        return summary;
    } catch (error) {
        console.error("Error summarizing messages by day:", error);
        return "An error occurred while summarizing today's messages.";
    }
}

export async function summarizeEntireThread(
    thread: ThreadChannel,
): Promise<string> {
    try {
        const messages = await thread.messages.fetch();
        const summary = await summarizeMessages(Array.from(messages.values()));

        return summary;
    } catch (error) {
        console.error("Error summarizing entire thread:", error);
        return "An error occurred while summarizing the thread.";
    }
}
