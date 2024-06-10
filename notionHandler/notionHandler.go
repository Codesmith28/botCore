package notionHandler

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/jomei/notionapi"

	"github.com/Codesmith28/botCore/config"
)

var (
	secret     = config.NotionSecret
	databaseID = config.DatabaseId // Fixed the variable name
	Tasklist   []Task
)

func checkNilErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func QueryDatabase(client *notionapi.Client) {
	res, err := client.Database.Query(
		context.Background(),
		notionapi.DatabaseID(databaseID), // Added notionapi.DatabaseID() to avoid type mismatch
		&notionapi.DatabaseQueryRequest{},
	)
	checkNilErr(err)

	for _, page := range res.Results {
		props, err := json.MarshalIndent(page.Properties, "", " ")
		checkNilErr(err)

		// Convert props to map
		var propMap map[string]interface{}
		err = json.Unmarshal(props, &propMap)
		checkNilErr(err)

		task := Formatter(propMap)

		// empty task safety check
		if task.Title == "" {
			continue
		}

		Tasklist = append(Tasklist, task)
	}

	// print the tasklist in formatted way
	for _, task := range Tasklist {
		fmt.Println("task id:", task.ID)
		fmt.Println("task title:", task.Title)
		fmt.Println("task status:", task.Status)
		fmt.Println("Days left: ", task.DaysLeft)
		fmt.Println("task due date:", task.DueDate)
		fmt.Println("Assignees:")
		for _, assignee := range task.Assignees {
			fmt.Println("\t ->", assignee)
		}

		fmt.Println()
	}
}

func NotionConnect() {
	client := notionapi.NewClient(notionapi.Token(secret))
	QueryDatabase(client)
}
