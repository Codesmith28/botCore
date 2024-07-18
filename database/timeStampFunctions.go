package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Codesmith28/botCore/internal"
)

type LastSentRecord = internal.LastSentRecord

// read the last sent:
func ReadLastSent() (time.Time, error) {
	var record LastSentRecord
	err := MongoCollection.FindOne(context.TODO(), bson.M{"_id": "lastSent"}).Decode(&record)

	if err == mongo.ErrNoDocuments {
		return time.Time{}, nil
	} else {
		checkNilErr(err)
	}

	return record.Timestamp, nil
}

// Update the last sent
func WriteLastSent(t time.Time) error {
	_, err := MongoCollection.UpdateOne(context.TODO(),
		bson.M{"_id": "lastSent"},
		bson.M{"$set": bson.M{"timestamp": t}},
		options.Update().SetUpsert(true),
	)
	return err
}
