package notionHandler

import (
	"context"
	"encoding/json"
	"log"

	"github.com/jomei/notionapi"

	"github.com/Codesmith28/botCore/internal"
)

var (
	secret     = internal.NotionSecret
	databaseID = internal.DatabaseId // Fixed the variable name
	Tasklist   []*Task
)

func checkNilErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func QueryDatabase(client *notionapi.Client) {
	res, err := client.Database.Query(
		context.Background(),
		notionapi.DatabaseID(databaseID),
		&notionapi.DatabaseQueryRequest{},
	)
	checkNilErr(err)

	for _, page := range res.Results {
		props, err := json.MarshalIndent(page.Properties, "", " ")
		checkNilErr(err)

		var propMap map[string]interface{}
		err = json.Unmarshal(props, &propMap)
		checkNilErr(err)

		task := Formatter(propMap)

		// Skip tasks marked as done
		if task == nil {
			continue
		}

		Tasklist = append(Tasklist, task)
	}

	// Output all tasks
	// log.Println("Task list as follows:")
	// for _, task := range Tasklist {
	// 	log.Printf("Title: %s\n", task.Title)
	// 	log.Printf("Status: %s\n", task.Status)
	// 	log.Printf("Due Date: %s\n", task.DueDate)
	// 	log.Printf("Created At: %s\n", task.CreatedAt)
	// 	log.Println("Assignees:")
	// 	for _, assignee := range task.Assignees {
	// 		log.Printf("\t -> %s\n", assignee)
	// 	}
	// 	log.Printf("Days Left: %d\n", task.DaysLeft)
	// 	log.Println("------------------------------------------------------")
	// }
}

func NotionConnect() {
	client := notionapi.NewClient(notionapi.Token(secret))
	QueryDatabase(client)
}
