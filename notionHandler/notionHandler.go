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

		// convert props to json:
		// fmt.Println(string(props))

		// convert props to map:
		var propMap map[string]interface{}
		err = json.Unmarshal(props, &propMap)
		checkNilErr(err)

		// data := FormatData(string(props))
		// fmt.Println(data)

		// print map in well formatted way

		for key, value := range propMap {
			fmt.Println(key, ":", value)
		}

		fmt.Printf("===================================== \n\n")
	}
}

func NotionConnect() {
	client := notionapi.NewClient(notionapi.Token(secret))
	QueryDatabase(client)
}
