package notionHandler

import (
	"context"
	"fmt"
	"log"

	"github.com/dstotijn/go-notion"

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

func NotionConnect() {
	client := notion.NewClient(secret)

	// connect to db:
	db, err := client.FindDatabaseByID(context.Background(), databaseID)
	checkNilErr(err)

	fmt.Println(db.URL)
}
