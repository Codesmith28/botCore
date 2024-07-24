import express from "express";
import { initMongo } from "./database/db";
import router from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.use("/", router);

async function startServer() {
    try {
        await initMongo();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
