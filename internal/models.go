package internal

import "time"

type Task struct {
	ID        string   `json:"id"`
	Title     string   `json:"title"`
	Status    string   `json:"status"`
	DueDate   string   `json:"due_date"`
	CreatedAt string   `json:"created_at"`
	Assignees []string `json:"assignees"`
	DaysLeft  int      `json:"days_left"`
}

type Message struct {
	Title     string   `json:"title,omitempty"`
	Message   string   `json:"message,omitempty"`
	DueDate   string   `json:"due_date,omitempty"`
	Assignees []string `json:"assignees,omitempty"`
	DaysLeft  int      `json:"days_left,omitempty"`
}

type LastSentRecord struct {
	ID        string    `bson:"id"`
	Timestamp time.Time `bson:"timestamp"`
}

// Map members to their Discord IDs
var MemberMap = map[string]string{
	"Sarthak Siddhpura":        "1018820365021098074",
	"Zeel Rajeshbhai Rajodiya": "610860696023859210",
	"Jayraj Derasari":          "1122477840621912154",
	"Rituben Piyushbhai Patel": "1039310594802720768",
	"Dhrumi Prakash Panchal":   "1213076069960392774",
	"Vansh Lilani":             "768739594598219788",
	"Nirjara Jain":             "761260272743743509",
	"Jainik Patel":             "1208651520707395584",
}
