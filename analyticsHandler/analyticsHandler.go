package main

import (
	"context"
	"log"

	"google.golang.org/api/analyticsreporting/v4"
	"google.golang.org/api/option"
)

func checkNilErr(err error) {
	if err != nil {
		log.Fatalf("Error: %v", err)
	}
}

func getAnalyticsData() (*analyticsreporting.GetReportsResponse, error) {
	analyticsService, err := analyticsreporting.NewService(
		context.Background(),
		option.WithCredentialsFile("path/to/your/service-account-file.json"),
	)
	checkNilErr(err)

	req := &analyticsreporting.GetReportsRequest{
		ReportRequests: []*analyticsreporting.ReportRequest{
			{
				ViewId: "YOUR_VIEW_ID",
				DateRanges: []*analyticsreporting.DateRange{
					{StartDate: "7daysAgo", EndDate: "today"},
				},
				Metrics: []*analyticsreporting.Metric{
					{Expression: "ga:newUsers"},
				},
				Dimensions: []*analyticsreporting.Dimension{
					{Name: "ga:source"},
				},
			},
		},
	}

	resp, err := analyticsService.Reports.BatchGet(req).Do()
	checkNilErr(err)

	return resp, nil
}
