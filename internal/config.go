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

	MongoURI        string
	MongoClient     *mongo.Client
	MongoCollection *mongo.Collection
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
	MongoURI = os.Getenv("MONGO_URI")

	checkEnvVar()
}

func checkEnvVar() {
	envVars := map[string]string{
		"Discord bot token": Token,
		"NotionSecret":      NotionSecret,
		"DatabaseId":        DatabaseId,
		"ChannelId":         ChannelId,
		"MongoURI":          MongoURI,
	}

	for name, value := range envVars {
		if value == "" {
			log.Fatalf("%s not found in .env file", name)
		}
	}
}

func checkNilErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
