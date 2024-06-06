package notionHandler

type Task struct {
	ID        string   `json:"id"`
	Title     string   `json:"title"`
	Status    string   `json:"status"`
	DueDate   string   `json:"due_date"`
	CreatedAt string   `json:"created_at"`
	Assignees []string `json:"assignees"`
	DaysLeft  int      `json:"days_left"`
}

// have to format the data from the notionHandler.go file to a list of Task struct to be used in the handler further
