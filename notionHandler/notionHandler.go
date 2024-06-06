package notionHandler

import (
	"context"
	"fmt"
	"log"

	"github.com/Codesmith28/botCore/config"
	"github.com/jomei/notionapi"
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

func NotionConnect() {
	client := notionapi.NewClient(notionapi.Token(secret))

	database, err := client.Database.Get(context.Background(), notionapi.DatabaseID(databaseID))
	checkNilErr(err)

	fmt.Println("Title: ", database.Title)
}
