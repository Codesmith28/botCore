package discordHandler

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/bwmarrin/discordgo"

	"github.com/Codesmith28/botCore/database"
	"github.com/Codesmith28/botCore/internal"
	"github.com/Codesmith28/botCore/notionHandler"
)

type Message = internal.Message

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

func TaskMessageHandler(sess *discordgo.Session, ready *discordgo.Ready) {
	channelID := internal.GeneralChannelId

	lastSent, err := database.ReadLastSent()
	checkNilErr(err)

	now := time.Now()
	if now.Sub(lastSent) < 24*time.Hour {
		log.Println("Message already sent today, skipping...")
		return
	}

	// connect to notion now:
	notionHandler.NotionConnect()
	MsgList := MessageMaker()

	for _, message := range MsgList {
		// Prepare the mentions
		var mentions []string
		for _, assignee := range message.Assignees {
			if discordID, exists := MemberMap[assignee]; exists {
				mentions = append(mentions, fmt.Sprintf("<@%s>", discordID))
			}
		}

		// Construct the message with mentions
		content := fmt.Sprintf("## %s\n %s\nDays Left: %d\nAssignees: %s",
			message.Title,
			message.Message,
			message.DaysLeft,
			strings.Join(mentions, " "),
		)

		// Send the message to the channel
		_, err := sess.ChannelMessageSend(channelID, content)
		checkNilErr(err)
	}

	// update the lastSent
	err = database.WriteLastSent(now)
	checkNilErr(err)
}
