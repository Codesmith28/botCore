import { Request, Response, Router } from "express";
import { readLastSent, writeLastSent } from "./database/dbFunctions";

const router = Router();

router.get("/last-sent", getLastSent);
router.post("/last-sent", postLastSent);

async function getLastSent(res: Response) {
    try {
        const lastSent = await readLastSent();
        res.json({ lastSent });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

async function postLastSent(req: Request, res: Response) {
    try {
        const { timestamp } = req.body;
        await writeLastSent(new Date(timestamp));
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export default router;
