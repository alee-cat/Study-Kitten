//server/src/routes/health.routes.js

import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "StudyKitten-api"});
});

export default router;