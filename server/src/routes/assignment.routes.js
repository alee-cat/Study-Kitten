// server/src/routes/assignment.routes.js
import { Router } from "express";
import { AssignmentService } from "../services/assignment.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
const statusByCode = {
    MISSING_TITLE: 400,
    MISSING_ASSIGNMENT_TYPE: 400,
    MISSING_DUE_DATE: 400,
    MISSING_COMPLETION_STATUS: 400,
    INVALID_COURSE: 400,
    INVALID_DUE_DATE: 400,
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

router.get("/assignments", async (req, res) => {
    try {
        res.json(await AssignmentService.listByUser(req.user.id, req.query));
    } catch (err) {
        sendError(res, err);
    }
});

router.post("/assignments", async (req, res) => {
    try {
        const { title, assignmentType, courseId, dueDate, completionStatus, priority } = req.body;
        const assignment = await AssignmentService.create({
            userId: req.user.id,
            title, assignmentType, courseId, dueDate, completionStatus, priority,
        });
        res.status(201).json(assignment);
    } catch (err) {
        sendError(res, err);
    }
});

router.patch("/assignments/:id", async (req, res) => {
    try {
        const updated = await AssignmentService.update(req.params.id, req.user.id, req.body);
        if (!updated) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
        res.json(updated);
    } catch (err) {
        sendError(res, err);
    }
});

router.delete("/assignments/:id", async (req, res) => {
    try {
        const ok = await AssignmentService.delete(req.params.id, req.user.id);
        if (!ok) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
        res.status(204).end();
    } catch (err) {
        sendError(res, err);
    }
});

router.get("/assignments/:id", requireAuth, async (req, res) => {
    try {
        const assignment = await AssignmentService.getById(req.params.id, req.user.id);
        if (!assignment) {
            return res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
        }
        res.json(assignment);
    } catch (err) {
        sendError(res, err);
    }
});

export default router;