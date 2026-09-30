//server/src/routes/task.routes.js

import { Router } from "express";
import { TaskService } from "../services/task.service.js";

const router = Router();

router.post("/tasks", async (req, res) => {
    try {
        const { userId, title, course, description } = req.body;
        const task = await TaskService.create({
            userId, title, course, description
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({
            error: { code: err.code || "VALIDATION_ERROR", message: err.message },
        });
    }
});

export default router;