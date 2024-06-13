package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/bwmarrin/discordgo"

	"github.com/Codesmith28/botCore/discordHandler"
	"github.com/Codesmith28/botCore/internal"
	"github.com/Codesmith28/botCore/notionHandler"
)

// checkNilErr logs and terminates the program if an error is not nil.
func checkNilErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

// handler is the HTTP handler function that Vercel will invoke.
func handler(w http.ResponseWriter, r *http.Request) {
	// Integrate notion here
	notionHandler.NotionConnect()

	// Connect to mongoDB
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

	// Respond to the HTTP request
	fmt.Fprintln(w, "Bot is running...")
}

// main sets up the HTTP server and waits for termination signals.
func main() {
	http.HandleFunc("/", handler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &http.Server{Addr: ":" + port}

	go func() {
		log.Printf("Server is running on port %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Could not listen on %s: %v\n", port, err)
		}
	}()

	// Wait for termination signal
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
	<-sc

	log.Println("Shutting down server...")
	if err := server.Shutdown(context.Background()); err != nil {
		log.Fatalf("Server Shutdown Failed:%+v", err)
	}
	log.Println("Server exited")
}
