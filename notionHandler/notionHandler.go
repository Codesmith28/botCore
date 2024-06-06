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
	databaseID = config.DatabaseId
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
		fmt.Println(string(props))
	}
}

func NotionConnect() {
	client := notionapi.NewClient(notionapi.Token(secret))
	QueryDatabase(client)
}
