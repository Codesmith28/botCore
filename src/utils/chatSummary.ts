import { TextChannel, ThreadChannel, Message } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/config/config";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY!);

async function summarizeMessages(messages: Message[]): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Summarize the following chat messages:

    ${messages.map((m) => `${m.author.username}: ${m.content}`).join("\n")}

    Provide a concise summary of the main points discussed.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
}

export async function summarizeByDay(
    channel: TextChannel | ThreadChannel,
): Promise<string> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const messages = await channel.messages.fetch({ limit: 100 });
    const todayMessages = messages.filter((m) => m.createdAt >= today);

    return summarizeMessages(Array.from(todayMessages.values()));
}

export async function summarizeEntireThread(
    thread: ThreadChannel,
): Promise<string> {
    const messages = await thread.messages.fetch();
    return summarizeMessages(Array.from(messages.values()));
}
