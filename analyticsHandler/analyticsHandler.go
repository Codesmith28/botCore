package analyticshandler

import (
	"fmt"
	"sync"

	"github.com/Codesmith28/botCore/internal"
)

var (
	LastMsgId          string
	mutex              sync.Mutex
	AnalyticsChannelId string
)

type AnalyticsData = internal.AnalyticsDataModel

func init() {
	fmt.Println("Hello there analyticsHandler!")
	AnalyticsChannelId = internal.AnalyticsChannelId
}
