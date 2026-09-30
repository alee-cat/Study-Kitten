//server/src/routes/course.routes.js
//need to change search function !!!

import { Router } from "express";
import { CourseService } from "../services/course.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
const statusByCode = {
    MISSING_NAME: 400,
    INVALID_ID: 400,
};

router.use(requireAuth);

function sendError(res, err) {
    const status = statusByCode[err.code] ?? 500;
    if (status === 500) console.error(err);
    res.status(status).json({
        error: {
            code: err.code || "SERVER_ERROR",
            message: status === 500 ? "Something went wrong" : err.message,
        },
    });
}

router.get("/courses", async (req, res) => {
    try {
        res.json(await CourseService.listByUser(req.user.id));
    } catch (err) {
        sendError(res, err);
    }
});

router.post("/courses", async (req, res) => {
    try {
        const { title, professor } = req.body;
        const course = await CourseService.create({
            userId: req.user.id,
            title, professor,
        });
        res.status(201).json(course);
    } catch (err) {
        sendError(res, err);
    }
});

router.patch("/courses/:id", async (req, res) => {
    try {
        const updated = await CourseService.update(req.params.id, req.user.id, req.body);
        if (!updated) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
        res.json(updated);
    } catch (err) {
        sendError(res, err);
    }
});

router.delete("/courses/:id", async (req, res) => {
    try {
        const ok = await CourseService.delete(req.params.id, req.user.id);
        if (!ok) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
        res.status(204).end();
    } catch (err) {
        sendError(res, err);
    }
});

export default router;
