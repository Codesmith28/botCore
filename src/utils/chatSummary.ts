import { TextChannel, ThreadChannel, Message } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/config/config";
import path from "path";
import fs from "fs";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY!);

const generation_config = {
    temperature: 1,
    top_p: 0.95,
    top_k: 64,
    max_output_tokens: 2048,
    response_mime_type: "text/plain",
};
const logFilePath = path.resolve(__dirname, "../logs/app.log");
function logToFile(message: string) {
    fs.appendFile(logFilePath, message + "\n", (err) => {
        if (err) {
            console.error("Error writing to log file:", err);
        }
    });
}

async function summarizeMessages(messages: Message[]): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            generationConfig: generation_config,
            systemInstruction:
                "summarize the given conversation. Remove all the unnecessary discussions and give a to the point summary",
        });

        const messageContents = messages
            .map((m) => {
                if (m.content) return `${m.author.username}: ${m.content}`;
                if (m.embeds.length > 0)
                    return `${m.author.username}: [Embed Content]`;
                return null;
            })
            .filter((content) => content !== null)
            .join("\n");

        const prompt = `${messageContents}`;

        const result = await model.generateContent(prompt);
        if (!result || !result.response) {
            throw new Error("Failed to generate summary");
        }

        //logToFile("\n Messages: \n");
        //logToFile(messageContents);
        //logToFile("\n Raw: \n");
        //logToFile(messages.map((m) => m).join("\n"));

        return result.response.text();
    } catch (error) {
        console.error("Error summarizing messages:", error);
        return "An error occurred while summarizing the messages.";
    }
}

export async function summarizeByDay(
    channel: TextChannel | ThreadChannel
): Promise<string> {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const messages = await channel.messages.fetch({ limit: 150 });
        const todayMessages = messages.filter((m) => m.createdAt >= today);

        const summary = await summarizeMessages(
            Array.from(todayMessages.values())
        );

        return summary;
    } catch (error) {
        console.error("Error summarizing messages by day:", error);
        return "An error occurred while summarizing today's messages.";
    }
}

export async function summarizeEntireThread(
    thread: ThreadChannel
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
