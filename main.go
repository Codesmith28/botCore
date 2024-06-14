package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/bwmarrin/discordgo"

	"github.com/Codesmith28/botCore/discordHandler"
	"github.com/Codesmith28/botCore/internal"
	"github.com/Codesmith28/botCore/notionHandler"
)

func checkNilErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	// integrate notion here
	notionHandler.NotionConnect()

	// connect to mongoDB
	err := internal.InitMongo()
	checkNilErr(err)
	defer internal.MongoClient.Disconnect(context.TODO())

	// Create a new Discord session using the token from config
	sess, err := discordgo.New("Bot " + internal.Token)
	checkNilErr(err)

	// Open the session
	discordHandler.BotHandler(sess)

	err = sess.Open()
	checkNilErr(err)

	defer sess.Close()
	fmt.Println("Bot is running...")

	// Set up a ticker to run the TaskMessageHandler every minute
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	go func() {
		for {
			select {
			case <-ticker.C:
				discordHandler.TaskMessageHandler(sess, nil)
			}
		}
	}()

	// Wait for termination signal
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
	<-sc
}
