package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var Token string

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	Token = os.Getenv("DISCORD_TOKEN")
	if Token == "" {
		log.Fatal("Discord bot token not found in .env file")
	}
}
