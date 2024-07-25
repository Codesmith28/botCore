export interface Config {
  discordToken: string;
  generalChannelId: string;
  notionSecret: string;
  notionDatabaseId: string;
  mongoUri: string;
}

export interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  createdAt: string;
  assignees: string[];
  daysLeft: number;
}

export interface Message {
  title?: string;
  message?: string;
  dueDate?: string;
  assignees?: string[];
  daysLeft?: number;
}

export interface LastSentRecord {
  _id: string;
  timestamp: Date;
}

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
