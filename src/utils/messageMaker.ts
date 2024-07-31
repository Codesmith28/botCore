import { MemberMap, Message } from "@/config/types";
import { getMsgList } from "@/utils/notion";
const memberMap: { [key: string]: string } = MemberMap;

export function getAssigneeMentions(assignees: string[]): string {
    return assignees
        .map((assignee) =>
            memberMap[assignee] ? `<@${memberMap[assignee]}>` : "",
        )
        .filter((mention) => mention !== "")
        .join(" ");
}

export async function messageMaker(): Promise<Message[]> {
    const msgList = getMsgList();
    console.log("Generating messages for tasks:");

    const messageList: Message[] = msgList
        .filter((msg) => msg?.daysLeft !== undefined)
        .map((msg) => {
            let message = "";

            if (msg?.daysLeft !== null && msg?.daysLeft !== undefined) {
                if (msg?.daysLeft < 0) {
                    message = `Is overdue by ${-msg?.daysLeft} days`;
                } else if (msg?.daysLeft <= 5) {
                    message = `Is pending and only ${msg?.daysLeft} days left`;
                } else {
                    message = `Due in ${msg?.daysLeft} days`;
                }
            }

            const fullMessage: Message = {
                ...msg,
                message,
            };

            // Log each message
            console.log(
                "------------------------------------------------------",
            );
            console.log(`Title: ${fullMessage.title}`);
            console.log(`Message: ${fullMessage.message}`);
            console.log(`Days Left: ${fullMessage.daysLeft}`);
            console.log("Assignees:");
            fullMessage.assignees?.forEach((assignee) =>
                console.log(`\t -> ${assignee}`),
            );
            console.log(
                "------------------------------------------------------",
            );

            return fullMessage;
        });

    return messageList;
}
