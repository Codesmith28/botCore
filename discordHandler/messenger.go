package discordHandler

import (
	"fmt"
	"log"
	"strings"

	"github.com/Codesmith28/botCore/internal"
	"github.com/Codesmith28/botCore/notionHandler"
)

type Message = internal.Message

// Map members to their Discord IDs
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

// Convert assignee names to Discord mentions
func getAssigneeMentions(assignees []string) string {
	var mentions []string
	for _, assignee := range assignees {
		if discordID, ok := MemberMap[assignee]; ok {
			mentions = append(mentions, fmt.Sprintf("<@%s>", discordID))
		}
	}
	return strings.Join(mentions, ", ")
}

func MessageMaker() []Message {
	tasklist := notionHandler.Tasklist

	log.Println("Generating messages for tasks:")

	var MessageList []Message

	for _, task := range tasklist {
		// Skip tasks with no due date
		if task.DueDate == "" {
			continue
		}

		message := Message{
			Title:     task.Title,
			DueDate:   task.DueDate,
			Assignees: task.Assignees,
			DaysLeft:  task.DaysLeft,
		}

		// Generate message based on days left
		if task.DaysLeft < 0 {
			message.Message = fmt.Sprintf("Is overdue by %d days", -task.DaysLeft)
		} else if task.DaysLeft <= 5 {
			message.Message = fmt.Sprintf("Is pending and only %d days left", task.DaysLeft)
		}

		MessageList = append(MessageList, message)

		// Log each message
		log.Printf("Title: %s\n", message.Title)
		log.Printf("Message: %s\n", message.Message)
		log.Printf("Due Date: %s\n", message.DueDate)
		log.Printf("Days Left: %d\n", message.DaysLeft)
		log.Println("Assignees:")
		for _, assignee := range message.Assignees {
			log.Printf("\t -> %s\n", assignee)
		}
		log.Println("------------------------------------------------------")
	}

	return MessageList
}
