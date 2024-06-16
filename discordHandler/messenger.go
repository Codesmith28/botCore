package discordHandler

import (
	"fmt"

	"github.com/Codesmith28/botCore/internal"
	"github.com/Codesmith28/botCore/notionHandler"
)

type Message = internal.Message

// map members to their discord id
var MemberMap = map[string]string{
	"Sarthak Siddhpura":        "1018820365021098074",
	"Zeel Rajeshbhai Rajodiya": "610860696023859210",
	"Jayraj Derasari":          "1122477840621912154",
	"Rituben Piyushbhai Patel": "1039310594802720768",
	"Dhrumi Prakash Panchal":   "1213076069960392774",
	"Vansh Lilani":             "768739594598219788",
	"Nirjara Jain":             "761260272743743509",
	"Jainik Patel":             "1208651520707395584",
}

func MessageMaker() []Message {
	tasklist := notionHandler.Tasklist
	var MessageList []Message

	for _, task := range tasklist {

		message := Message{
			Title:     task.Title,
			DueDate:   task.DueDate,
			Assignees: task.Assignees,
			DaysLeft:  task.DaysLeft,
		}

		if task.DueDate == "" {
			continue
		}

		if task.DaysLeft < 0 {
			message.Message = fmt.Sprintf("Is overdue by %d days", task.DaysLeft)
		} else if task.DaysLeft <= 5 {
			message.Message = fmt.Sprintf("is pending and only %d days left", task.DaysLeft)
		}

		MessageList = append(MessageList, message)
	}

	// print all the messages (CONSOLE):
	fmt.Println("Message list as follows:")
	for _, message := range MessageList {
		fmt.Printf("Title: %s\n", message.Title)
		fmt.Printf("Message: %s\n", message.Message)
		fmt.Printf("Due Date: %s\n", message.DueDate)
		fmt.Printf("Days Left: %d\n", message.DaysLeft)
		fmt.Println("Assignees: ")
		for _, member := range message.Assignees {
			fmt.Printf("\t -> %s\n", member)
		}
		fmt.Println("------------------------------------------------------")
	}

	return MessageList
}
