import { env } from "@/config/config";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { GoogleAuth } from "google-auth-library";

const analyticsDataClient = new BetaAnalyticsDataClient({
    auth: new GoogleAuth({
        projectId: "quickstart-1721808635827",
        scopes: "https://www.googleapis.com/auth/analytics",
        credentials: {
            client_email: env.GOOGLE_EMAIL,
            private_key: env.GOOGLE_PK.replace(/\\n/g, "\n"),
        },
    }),
});

export async function getViewsAndUsers(propertyId: string) {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            {
                startDate: "2020-03-31",
                endDate: "today",
            },
        ],
        dimensions: [],
        metrics: [
            {
                name: "screenPageViews",
            },
            {
                name: "totalUsers",
            },
        ],
    });

    const viewsAndUsers: {
        views: number;
        users: number;
    } = {
        views: 0,
        users: 0,
    };

    response.rows?.forEach((row) => {
        viewsAndUsers["views"] = Number(row.metricValues![0].value);
        viewsAndUsers["users"] = Number(row.metricValues![1].value);
    });

    console.log(viewsAndUsers);
    return viewsAndUsers;
}
