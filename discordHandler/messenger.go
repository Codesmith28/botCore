package discordHandler

import (
	"fmt"

	"github.com/Codesmith28/botCore/internal"
	"github.com/Codesmith28/botCore/notionHandler"
)

type Message = internal.Message

var MemberMap = map[string]string{
	"Sarthak Siddhpura":        "1018820365021098074",
	"Zeel Rajeshbhai Rajodiya": "610860696023859210",
	"Jayraj Derasari":          "1122477840621912154",
	"Rituben Piyushbhai Patel": "1039310594802720768",
	"Dhrumi Prakash Panchal":   "1213076069960392774",
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
	for _, message := range MessageList {
		fmt.Printf("Title: %s\n", message.Title)
		fmt.Printf("Message: %s\n", message.Message)
		fmt.Printf("Due Date: %s\n", message.DueDate)
		fmt.Printf("Days Left: %d\n", message.DaysLeft)
		// fmt.Printf("Assignees: %s\n", message.Assignees)
		fmt.Println("Assignees: ")
		for _, member := range message.Assignees {
			fmt.Printf("\t -> %s\n", member)
		}
		fmt.Println("----------------------------------------------------")
	}

	return MessageList
}
