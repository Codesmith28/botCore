import { ANALYTICS_PATH, PCLUB_PROPERTY_ID } from "@/config/config";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const credPath = ANALYTICS_PATH;
const analyticsDataClient = new BetaAnalyticsDataClient();
const pclubPropertyId = PCLUB_PROPERTY_ID;

export async function runReport() {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${pclubPropertyId}`,
        dateRanges: [
            {
                startDate: "2020-03-31",
                endDate: "today",
            },
        ],
        dimensions: [
            {
                name: "city",
            },
        ],
        metrics: [
            {
                name: "activeUsers",
            },
        ],
    });

    console.log("Report result:");
    response?.rows?.forEach((row) => {
        const dimensionValue = row.dimensionValues?.[0]?.value || "Unknown";
        const metricValue = row.metricValues?.[0]?.value || "Unknown";
        console.log(dimensionValue, metricValue);
    });
}
