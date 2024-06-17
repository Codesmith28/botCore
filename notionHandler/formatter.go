package notionHandler

import (
	"log"
	"time"

	"github.com/Codesmith28/botCore/internal"
)

type Task = internal.Task

func Formatter(data map[string]interface{}) *Task {
	// Check if task is marked as done
	doneData, ok := data["Done"].(map[string]interface{})
	if ok && doneData["status"] != nil {
		status := doneData["status"].(map[string]interface{})["name"].(string)
		if status == "Done" {
			return nil // Return nil to skip this task
		}
	}

	var task Task

	// Extract ID and Title
	if taskData, ok := data["Task"].(map[string]interface{}); ok {
		task.ID = taskData["id"].(string)
		if titleArray, ok := taskData["title"].([]interface{}); ok && len(titleArray) > 0 {
			if titleMap, ok := titleArray[0].(map[string]interface{}); ok {
				if textContent, ok := titleMap["text"].(map[string]interface{}); ok {
					task.Title = textContent["content"].(string)
				}
			}
		}
	}

	// Extract Status
	if stateData, ok := data["state"].(map[string]interface{}); ok {
		if formulaData, ok := stateData["formula"].(map[string]interface{}); ok {
			if status, ok := formulaData["string"].(string); ok {
				task.Status = status
			}
		}
	}

	// Extract DueDate
	if dueData, ok := data["Due"].(map[string]interface{}); ok {
		if dateData, ok := dueData["date"].(map[string]interface{}); ok {
			if start, ok := dateData["start"].(string); ok {
				dueDate, err := time.Parse(time.RFC3339, start)
				if err == nil {
					task.DueDate = dueDate.Format("Jan 2 2006")
				} else {
					log.Printf("Error parsing DueDate: %v\n", err)
				}
			}
		}
	}

	// Extract CreatedAt
	if createdData, ok := data["Created"].(map[string]interface{}); ok {
		if createdTime, ok := createdData["created_time"].(string); ok {
			createdAt, err := time.Parse(time.RFC3339, createdTime)
			if err == nil {
				task.CreatedAt = createdAt.Format("2006-01-02 15:04:05")
			} else {
				log.Printf("Error parsing CreatedAt: %v\n", err)
			}
		}
	}

	// Extract Assignees
	if assigneeData, ok := data["Assignee"].(map[string]interface{}); ok {
		if people, ok := assigneeData["people"].([]interface{}); ok {
			for _, person := range people {
				if personMap, ok := person.(map[string]interface{}); ok {
					if name, ok := personMap["name"].(string); ok {
						task.Assignees = append(task.Assignees, name)
					}
				}
			}
		}
	}

	// Extract DaysLeft
	if daysLeftData, ok := data["Days left"].(map[string]interface{}); ok {
		if formulaData, ok := daysLeftData["formula"].(map[string]interface{}); ok {
			if daysLeft, ok := formulaData["number"].(float64); ok {
				task.DaysLeft = int(daysLeft)
			}
		}
	}

	return &task
}
