package analyticshandler

import (
	"fmt"
	"sync"

	"github.com/bwmarrin/discordgo"

	"github.com/Codesmith28/botCore/internal"
)

var (
	LastMsgId          string
	mutex              sync.Mutex
	AnalyticsChannelId string
)

func init() {
	fmt.Println("Hello there analyticsHandler!")
	AnalyticsChannelId = internal.AnalyticsChannelId
}

func updateAnalytics(s *discordgo.Session) {
}
