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

var MemberMap = internal.MemberMap

func checkNilErr(err error) {
	if err != nil {
		log.Println(err)
	}
}

func TaskMessageHandler(sess *discordgo.Session, ready *discordgo.Ready) {
	channelID := internal.GeneralChannelId

	lastSent, err := database.ReadLastSent()
	checkNilErr(err)

	// // debug message list:
	// MsgList := MessageMaker()

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

func BotHandler(sess *discordgo.Session) {
	sess.AddHandler(TaskMessageHandler)
	sess.Identify.Intents = discordgo.IntentsAllWithoutPrivileged
}
