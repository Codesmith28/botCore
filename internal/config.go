package internal

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	Token        string
	DatabaseId   string
	NotionSecret string
	ChannelId    string
	MongoURI     string

	MongoClient     *mongo.Client
	MongoCollection *mongo.Collection
)

func init() {
	// Try to load the environment variables from Render first
	Token = os.Getenv("DISCORD_TOKEN")
	NotionSecret = os.Getenv("NOTION_SECRET")
	DatabaseId = os.Getenv("NOTION_DATABASE_ID")
	ChannelId = os.Getenv("DISCORD_CHANNEL_ID")
	MongoURI = os.Getenv("MONGO_URI")

	// If any environment variable is not set, load from .env file
	if Token == "" || NotionSecret == "" || DatabaseId == "" || ChannelId == "" || MongoURI == "" {
		err := godotenv.Load()
		if err != nil {
			log.Printf("Error loading .env file: %v", err)
		}

		if Token == "" {
			Token = os.Getenv("DISCORD_TOKEN")
		}
		if NotionSecret == "" {
			NotionSecret = os.Getenv("NOTION_SECRET")
		}
		if DatabaseId == "" {
			DatabaseId = os.Getenv("NOTION_DATABASE_ID")
		}
		if ChannelId == "" {
			ChannelId = os.Getenv("DISCORD_CHANNEL_ID")
		}
		if MongoURI == "" {
			MongoURI = os.Getenv("MONGO_URI")
		}
	}

	checkEnvVar()
}

func checkEnvVar() {
	envVars := map[string]string{
		"DISCORD_TOKEN":      Token,
		"NOTION_DATABASE_ID": DatabaseId,
		"NOTION_SECRET":      NotionSecret,
		"DISCORD_CHANNEL_ID": ChannelId,
		"MONGO_URI":          MongoURI,
	}

	for name, value := range envVars {
		if value == "" {
			log.Fatalf("%s not found in environment variables or .env file", name)
		}
	}
}

func checkNilErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
