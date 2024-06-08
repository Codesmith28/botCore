package notionHandler

import (
	"encoding/json"

	"github.com/jomei/notionapi"
)

type Task struct {
	ID        string   `json:"id"`
	Title     string   `json:"title"`
	Status    string   `json:"status"`
	DueDate   string   `json:"due_date"`
	CreatedAt string   `json:"created_at"`
	Assignees []string `json:"assignees"`
	DaysLeft  int      `json:"days_left"`
}

type NotionPage struct {
	ID    notionapi.PageID `json:"id"`
	Type  string           `json:"type"`
	Title []struct {
		Text struct {
			Content string `json:"content"`
		} `json:"text"`
	} `json:"title"`
	Properties map[string]interface{} `json:"properties"`
}

// format the json data into a list of Task struct

// given a string of list of json data, return a list of Task struct
func FormatData(jsonList string) []Task {
	var tasks []Task

	// convert jsonList to a list of NotionPage struct
	var pages []NotionPage
	json.Unmarshal([]byte(jsonList), &pages)

	// iterate through the list of NotionPage struct
	for _, page := range pages {
		// create a new Task struct
		var task Task
		task.ID = string(page.ID)
		task.Title = page.Title[0].Text.Content
		task.Status = page.Properties["Status"].(string)
		task.DueDate = page.Properties["Due Date"].(string)
		task.CreatedAt = page.Properties["Created At"].(string)
		task.Assignees = page.Properties["Assignees"].([]string)
		task.DaysLeft = page.Properties["Days Left"].(int)

		// append the Task struct to the list of tasks
		tasks = append(tasks, task)
	}

	return tasks
}
