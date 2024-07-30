export type Task = {
    id: string;
    title: string;
    status: string;
    dueDate: string;
    createdAt: string;
    assignees: string[];
    daysLeft: number;
};

export type Message = {
    title?: string;
    message?: string;
    dueDate?: string;
    assignees?: string[];
    daysLeft?: number;
} | null;

export type LastSentRecord = {
    _id: string;
    timestamp: Date;
};

export type EnvVars = {
    DISCORD_TOKEN: string;
    DISCORD_CHANNEL_ID_GENERAL: string;
    NOTION_SECRET: string;
    NOTION_DATABASE_ID: string;
    MONGO_URI: string;
    ANALYTICS_PATH: string;
    PROPERTY_ID: string;
};

export const MemberMap: Record<string, string> = {
    "Sarthak Siddhpura": "1018820365021098074",
    "Zeel Rajeshbhai Rajodiya": "610860696023859210",
    "Jayraj Derasari": "1122477840621912154",
    "Rituben Piyushbhai Patel": "1039310594802720768",
    "Dhrumi Prakash Panchal": "1213076069960392774",
    "Vansh Lilani": "768739594598219788",
    "Nirjara Jain": "761260272743743509",
    "Jainik Patel": "1208651520707395584",
};
