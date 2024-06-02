package handlers

import (
	"fmt"
	"log"
	"strings"

	"github.com/bwmarrin/discordgo"
)

type Answers struct {
	OriginChannelId string
	FavFood         string
	FavGame         string
}

func checkNilErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

var responses map[string]Answers = map[string]Answers{}

func (a *Answers) ToMessageEmbed() *discordgo.MessageEmbed {
	fields := []*discordgo.MessageEmbedField{
		{
			Name:  "Favorite Food",
			Value: a.FavFood,
		}, {
			Name:  "Favorite Game",
			Value: a.FavGame,
		},
	}

	return &discordgo.MessageEmbed{
		Title:  "User Answers",
		Fields: fields,
	}
}

const prefix string = "!"

func UserPromptHandler(s *discordgo.Session, m *discordgo.MessageCreate) {
	// create a user channel
	channel, err := s.UserChannelCreate(m.Author.ID)
	checkNilErr(err)

	// if user is answering ignore, else ask the question
	if _, ok := responses[channel.ID]; !ok {
		responses[channel.ID] = Answers{
			OriginChannelId: m.ChannelID,
			FavFood:         "",
			FavGame:         "",
		}
		s.ChannelMessageSend(channel.ID, "What is your favorite food?")
		// s.ChannelMessageSend(channel.ID, "What is your favorite game?")
	} else {
		s.ChannelMessageSend(channel.ID, "Where are you now? 👀")
	}
}

func MsgHandler(s *discordgo.Session, m *discordgo.MessageCreate) {
	if m.Author.ID == s.State.User.ID {
		return
	}

	// DM LOGIC:
	if m.GuildID == "" {
		// dm here
		answers, ok := responses[m.ChannelID]
		if !ok {
			return
		}

		if answers.FavFood == "" {
			answers.FavFood = m.Content
			s.ChannelMessageSend(m.ChannelID, "Cool! What is your favorite game then?")
			responses[m.ChannelID] = answers // as it was a copy and not a reference
			return
		} else {
			answers.FavGame = m.Content
			// log.Printf("answers: %v, %v", answers.FavFood, answers.FavGame)
			embed := answers.ToMessageEmbed()
			s.ChannelMessageSendEmbed(answers.OriginChannelId, embed)
			delete(responses, m.ChannelID) // to clear the responses after the user has answered
		}
	}

	// SERVER LOGIC:
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

	if args[1] == "prompt" {
		UserPromptHandler(s, m)
	}
}

func ReactionAddHandler(s *discordgo.Session, r *discordgo.MessageReactionAdd) {
	if r.Emoji.Name == "👀" {
		s.GuildMemberRoleAdd(r.GuildID, r.UserID, "1246462722669809715")
		s.ChannelMessageSend(
			r.ChannelID,
			fmt.Sprintf("%v has been given the role of %v", r.UserID, r.Emoji.Name),
		)
	}
}

func ReactionRemoveHandler(s *discordgo.Session, r *discordgo.MessageReactionRemove) {
	if r.Emoji.Name == "👀" {
		s.GuildMemberRoleRemove(r.GuildID, r.UserID, "1246462722669809715")
		s.ChannelMessageSend(
			r.ChannelID,
			fmt.Sprintf("%v has been removed from the role of %v", r.UserID, r.Emoji.Name),
		)
	}
}

func BotHandler(sess *discordgo.Session) {
	sess.AddHandler(ReactionAddHandler)
	sess.AddHandler(ReactionRemoveHandler)
	sess.AddHandler(MsgHandler)
	sess.Identify.Intents = discordgo.IntentsAllWithoutPrivileged
}
