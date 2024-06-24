package internal

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	Token              string
	GeneralChannelId   string
	AnalyticsChannelId string
	DatabaseId         string
	NotionSecret       string
	GAViewId           string
	GACredentialsPath  string
	MongoURI           string
	MongoClient        *mongo.Client
	MongoCollection    *mongo.Collection
)

func init() {
	envVars := map[string]*string{
		"DISCORD_TOKEN":                &Token,
		"DISCORD_CHANNEL_ID_GENERAL":   &GeneralChannelId,
		"DISCORD_CHANNEL_ID_ANALYTICS": &AnalyticsChannelId,
		"NOTION_SECRET":                &NotionSecret,
		"NOTION_DATABASE_ID":           &DatabaseId,
		"GA_VIEW_ID":                   &GAViewId,
		"GA_CREDENTIALS_PATH":          &GACredentialsPath,
		"MONGO_URI":                    &MongoURI,
	}

	loadEnvVars(envVars)
	checkEnvVars(envVars)
}

func loadEnvVars(envVars map[string]*string) {
	// Try to load the environment variables from the system first
	for key, ptr := range envVars {
		*ptr = os.Getenv(key)
	}

	// If any environment variable is not set, load from .env file
	missingEnv := false
	for _, ptr := range envVars {
		if *ptr == "" {
			missingEnv = true
			break
		}
	}

	if missingEnv {
		err := godotenv.Load()
		if err != nil {
			log.Printf("Error loading .env file: %v", err)
		}

		for key, ptr := range envVars {
			if *ptr == "" {
				*ptr = os.Getenv(key)
			}
		}
	}
}

func checkEnvVars(envVars map[string]*string) {
	for name, ptr := range envVars {
		if *ptr == "" {
			log.Fatalf("%s not found in environment variables or .env file", name)
		}
	}
}

func checkNilErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
