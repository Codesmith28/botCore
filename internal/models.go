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
