package discordHandler

import (
	"log"

	"github.com/bwmarrin/discordgo"

	"github.com/Codesmith28/botCore/internal"
)

var MemberMap = internal.MemberMap

func checkNilErr(err error) {
	if err != nil {
		log.Println(err)
	}
}

func BotHandler(sess *discordgo.Session) {
	sess.AddHandler(TaskMessageHandler)
	sess.Identify.Intents = discordgo.IntentsAllWithoutPrivileged
}
