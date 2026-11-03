//server/src/routes/course.routes.js
//need to change search function !!!

import { Router } from "express";
import { CourseService } from "../services/course.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { sendError, notFound } from "../utils/http.js";

const router = Router();


router.use(requireAuth);

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
        if (!updated) return notFound(res);
        res.json(updated);
    } catch (err) {
        sendError(res, err);
    }
});

router.delete("/courses/:id", async (req, res) => {
    try {
        const ok = await CourseService.delete(req.params.id, req.user.id);
        if (!ok) return notFound(res);
        res.status(204).end();
    } catch (err) {
        sendError(res, err);
    }
});

export default router;
