import { ANALYTICS_PATH, PROPERTY_ID } from "@/config/config";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const credPath = ANALYTICS_PATH;
const analyticsDataClient = new BetaAnalyticsDataClient();
const propertyId = PROPERTY_ID;
