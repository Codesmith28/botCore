const envs = [
    "DISCORD_TOKEN",
    "DISCORD_CHANNEL_ID_GENERAL",
    "DISCORD_CHANNEL_ID_ANALYTICS",
    "NOTION_DATABASE_ID",
    "NOTION_SECRET",
    "GA_CREDENTIALS_PATH",
    "MONGO_URI",
];

export function verifyEnvs(): void {
    envs.forEach((env) => {
        if (!process.env[env]) {
            throw new Error(`Environment variable ${env} is required`);
        }
    });
}
