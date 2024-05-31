package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/bwmarrin/discordgo"

	"github.com/Codesmith28/botCore/config"
)

func checkNilErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

const prefix string = "!"

func msgHandler(s *discordgo.Session, m *discordgo.MessageCreate) {
	if m.Author.ID == s.State.User.ID {
		return
	}

	args := strings.Split(m.Content, " ")
	if args[0] != prefix {
		return
	}

	if args[1] == "hello" && args[2] == "there" {

		// Author:
		author := &discordgo.MessageEmbedAuthor{
			Name: "notion",
			URL:  "https://www.notion.so/PClub-Core-db3b8b06fdd64562ae60eee03e95e029",
		}

		// creating and embed:
		embed := &discordgo.MessageEmbed{
			Title:  "General Kenobi!",
			Author: author,
		}

		// s.ChannelMessageSend(m.ChannelID, "General Kenobi!")
		s.ChannelMessageSendEmbed(m.ChannelID, embed)
	}

	if args[1] == "ping" {
		s.ChannelMessageSend(m.ChannelID, "pong")
	}
}

func main() {
	// Create a new Discord session using the token from config
	sess, err := discordgo.New("Bot " + config.Token)
	checkNilErr(err)

	sess.AddHandler(msgHandler)
	sess.Identify.Intents = discordgo.IntentsAllWithoutPrivileged
	err = sess.Open()
	checkNilErr(err)

	defer sess.Close()
	fmt.Println("Bot is running...")

	// Wait for termination signal
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
	<-sc
}
