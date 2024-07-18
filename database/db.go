package database

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Codesmith28/botCore/internal"
)

var (
	MongoURI            string
	MongoClient         *mongo.Client
	TimeStampCollection *mongo.Collection
)

func init() {
	MongoURI = internal.MongoURI
}

// connnect to mongo db:
func InitMongo() error {
	var err error
	MongoClient, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(MongoURI))
	checkNilErr(err)

	TimeStampCollection = MongoClient.Database("botCore").Collection("lastSent")
	return nil
}

func checkNilErr(err error) {
	if err != nil {
		log.Fatalf("Error: %v", err)
	}
}
