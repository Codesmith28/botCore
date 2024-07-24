import express from "express";
import { initMongo } from "./database/db";
import { readLastSent, writeLastSent } from "./database/dbFunctions";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/last-sent", async (req, res) => {
    try {
        const lastSent = await readLastSent();
        res.json({ lastSent });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/last-sent", async (req, res) => {
    try {
        const { timestamp } = req.body;
        await writeLastSent(new Date(timestamp));
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

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
