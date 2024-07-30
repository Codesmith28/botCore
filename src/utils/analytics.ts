import { ANALYTICS_PATH, PCLUB_PROPERTY_ID } from "@/config/config";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const credPath = ANALYTICS_PATH;
const analyticsDataClient = new BetaAnalyticsDataClient();
const pclubPropertyId = PCLUB_PROPERTY_ID;
