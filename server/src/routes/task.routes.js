//server/src/routes/studyTask.routes.js
import { Router } from "express";
import { TaskService } from "../services/task.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { sendError, notFound } from "../utils/http.js";

const router = Router();

router.get("/study-tasks", requireAuth, async (req, res) => {
    try {
        res.json(await TaskService.listByUser(req.user.id, req.query));
    } catch (err) {
        sendError(res, err);
    }
});

router.get("/study-tasks/:id", requireAuth, async (req, res) => {
    try {
        const task = await TaskService.getById(req.params.id, req.user.id);
        if (!task) return notFound(res);
        res.json(task);
    } catch (err) {
        sendError(res, err);
    }
});

router.post("/study-tasks", requireAuth, async (req, res) => {
    try {
        const { title, courseId, description } = req.body;
        const task = await TaskService.create({
            userId: req.user.id,
            title, courseId, description,
        });
        res.status(201).json(task);
    } catch (err) {
        sendError(res, err);
    }
});

router.patch("/study-tasks/:id", requireAuth, async (req, res) => {
    try {
        const updated = await TaskService.update(req.params.id, req.user.id, req.body);
        if (!updated) return notFound(res);
        res.json(updated);
    } catch (err) {
        sendError(res, err);
    }
});

router.delete("/study-tasks/:id", requireAuth, async (req, res) => {
    try {
        const ok = await TaskService.delete(req.params.id, req.user.id);
        if (!ok) return notFound(res);
        res.status(204).end();
    } catch (err) {
        sendError(res, err);
    }
});

export default router;