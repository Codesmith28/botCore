package discordHandler

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/bwmarrin/discordgo"

	"github.com/Codesmith28/botCore/internal"
)

func checkNilErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

// take a msg from teh msglist, get all the assignee's discord id from map and then send the message to the channel with all mentions in 1 messsage
// do not take any input from the user, just send the messages

func TaskMessageHandler(sess *discordgo.Session, ready *discordgo.Ready) {
	channelID := internal.ChannelId

	lastSent, err := internal.ReadLastSent()
	checkNilErr(err)

	now := time.Now()
	if now.Sub(lastSent) < 24*time.Hour {
		log.Println("Message already sent today, skipping...")
		return
	}

	// Get the message list
	MsgList := MessageMaker()

	for _, message := range MsgList {
		// Prepare the mentions
		var mentions []string
		for _, assignee := range message.Assignees {
			if discordID, exists := MemberMap[assignee]; exists {
				// Use <@USER_ID> format for mentioning
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
	err = internal.WriteLastSent(now)
	checkNilErr(err)
}

func BotHandler(sess *discordgo.Session) {
	sess.AddHandler(TaskMessageHandler)
	sess.Identify.Intents = discordgo.IntentsAllWithoutPrivileged
}
