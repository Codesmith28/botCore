package internal

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	Token        string
	DatabaseId   string
	NotionSecret string
	ChannelId    string
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	Token = os.Getenv("DISCORD_TOKEN")
	NotionSecret = os.Getenv("NOTION_SECRET")
	DatabaseId = os.Getenv("NOTION_DATABASE_ID")
	ChannelId = os.Getenv("DISCORD_CHANNEL_ID")

	checkEnvVar()
}

func checkEnvVar() {
	if Token == "" {
		log.Fatal("Discord bot token not found in .env file")
	}

	if NotionSecret == "" {
		log.Fatal("NotionSecret not found in .env file")
	}

	if DatabaseId == "" {
		log.Fatal("DatabaseId not found in .env file")
	}

	if ChannelId == "" {
		log.Fatal("ChannelId not found in .env file")
	}
}
