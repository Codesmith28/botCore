package internal

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// connnect to mongo db:
func InitMongo() error {
	var err error
	MongoClient, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(MongoURI))
	checkNilErr(err)

	MongoCollection = MongoClient.Database("botCore").Collection("lastSent")
	return nil
}

// read the last sent:
func ReadLastSent() (time.Time, error) {
	var record LastSentRecord
	err := MongoCollection.FindOne(context.Background(), nil).Decode(&record)

	if err == mongo.ErrNoDocuments {
		return time.Time{}, nil
	} else {
		checkNilErr(err)
	}

	return record.Timestamp, nil
}

func WriteLastSent(t time.Time) error {
	_, err := MongoCollection.UpdateOne(context.TODO(),
		bson.M{"_id": "lastSent"},
		bson.M{"$set": bson.M{"timestamp": t}},
		options.Update().SetUpsert(true),
	)
	return err
}
