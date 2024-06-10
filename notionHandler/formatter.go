package notionHandler

import (
	"fmt"
	"time"
)

type Task struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Status    string    `json:"status"`
	DueDate   time.Time `json:"due_date"`
	CreatedAt time.Time `json:"created_at"`
	Assignees []string  `json:"assignees"`
	DaysLeft  int       `json:"days_left"`
}

func Formatter(data map[string]interface{}) Task {
	var task Task

	// Extracting ID and Title
	task.ID = data["Task"].(map[string]interface{})["id"].(string)
	task.Title = data["Task"].(map[string]interface{})["title"].([]interface{})[0].(map[string]interface{})["text"].(map[string]interface{})["content"].(string)

	// Extracting Status
	task.Status = data["state"].(map[string]interface{})["formula"].(map[string]interface{})["string"].(string)

	// Extracting DueDate
	if due, ok := data["Due"].(map[string]interface{})["date"].(map[string]interface{}); ok {
		if due["start"] != nil {
			dueDate, _ := time.Parse(time.RFC3339, due["start"].(string))
			task.DueDate = dueDate
		}
	}

	// Extracting CreatedAt
	if created, ok := data["Created"].(map[string]interface{})["created_time"].(string); ok {
		createdAt, _ := time.Parse(time.RFC3339, created)
		task.CreatedAt = createdAt
	}

	// Extracting Assignees
	if assigneeData, ok := data["Assignee"].(map[string]interface{}); ok {
		for _, assignee := range assigneeData["people"].([]interface{}) {
			task.Assignees = append(task.Assignees, assignee.(map[string]interface{})["name"].(string))
		}
	}

	// Extracting DaysLeft
	if daysLeft, ok := data["Days left"].(map[string]interface{})["formula"].(map[string]interface{})["number"].(float64); ok {
		task.DaysLeft = int(daysLeft)
	}

	fmt.Println("task -> ", task)

	return task
}
