package notionHandler

import (
	"context"
	"encoding/json"
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
		_ = task
	}

	// print the Tasklist -> it is empty rn...
	// fmt.Println(Tasklist)
}

func NotionConnect() {
	client := notionapi.NewClient(notionapi.Token(secret))
	QueryDatabase(client)
}
