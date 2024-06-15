package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
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

// healthCheckHandler responds with a simple "OK" to indicate the server is running
func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Health check endpoint accessed")
	fmt.Fprintln(w, "OK")
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

	// Set up a simple HTTP server
	http.HandleFunc("/", healthCheckHandler)
	server := &http.Server{Addr: ":8080"}

	go func() {
		if err := server.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatalf("HTTP server ListenAndServe: %v", err)
		}
	}()

	// Wait for termination signal
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)

	// Block until a signal is received
	sig := <-sc
	fmt.Printf("Received signal %v, shutting down...\n", sig)

	// Shutdown the HTTP server gracefully
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("HTTP server Shutdown: %v", err)
	}

	// Close Discord session gracefully
	fmt.Println("Closing Discord session...")
	if err := sess.Close(); err != nil {
		log.Fatalf("Discord session Close: %v", err)
	}

	fmt.Println("Shutdown complete.")
}
