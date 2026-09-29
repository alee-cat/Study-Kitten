//server/src/routes/assignment.routes.js

import { Router } from "express";
import { AssignmentService } from "../services/assignment.service.js";

const router = Router();

router.post("/assignments", async (req, res) => {
    try {
        const { userId, title, assignmentType, course, dueDate, priority} = req.body;
        const assignment = await AssignmentService.create({
            userId, title, assignmentType, course, dueDate, priority
        });
        res.status(201).json(assignment);
    } catch (err) {
        res.status(400).json({
            error: { code: err.code || "VALIDATION_ERROR", message: err.message },
        });
    }
});

router.get("/assignments", async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const result = await AssignmentService.listPublished({ page });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

export default router;