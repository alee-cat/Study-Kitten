//server/src/services/assignment.service.js

import { AssignmentRepository } from "../repositories/assignment.repository.js";
import { CourseRepository } from "../repositories/course.repository.js";
import { assertNonEmpty } from "../utils/validation.js";
import { ObjectId } from "mongodb";

async function assertCourseOwned(courseId, userId) {
    if (!ObjectId.isValid(courseId) || !(await CourseRepository.findOwned(courseId, userId))) {
        const err = new Error("Invalid courseId");
        err.code = "INVALID_COURSE";
        throw err;
    }
}

function parseDueDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        const err = new Error("Invalid dueDate");
        err.code = "INVALID_DUE_DATE";
        throw err;
    }
    return date;
}

export const AssignmentService = {
    async create({ userId, title, assignmentType, courseId, dueDate, completionStatus, priority }) {
        assertNonEmpty(title, "title", "MISSING_TITLE");
        assertNonEmpty(assignmentType, "assignmentType", "MISSING_ASSIGNMENT_TYPE");
        assertNonEmpty(dueDate, "dueDate", "MISSING_DUE_DATE");
        assertNonEmpty(completionStatus, "completionStatus", "MISSING_COMPLETION_STATUS");
        await assertCourseOwned(courseId, userId);
        
        return AssignmentRepository.create({
            userId,
            title,
            assignmentType,
            courseId,
            dueDate: parseDueDate(dueDate),
            completionStatus,
            priority,
        });
    },
    
    async update(id, userId, changes) {
        if (!ObjectId.isValid(id)) {
            const err = new Error("Invalid id");
            err.code = "INVALID_ID";
            throw err;
        }
        const next = { ...changes };
        if (next.title !== undefined) assertNonEmpty(next.title, "title", "MISSING_TITLE");
        if (next.courseId !== undefined) await assertCourseOwned(next.courseId, userId);
        if (next.dueDate !== undefined) next.dueDate = parseDueDate(next.dueDate);

        return AssignmentRepository.update(id, userId, next);
    },
    
    delete(id, userId) {
        if (!ObjectId.isValid(id)) {
            const err = new Error("Invalid id");
            err.code = "INVALID_ID";
            throw err;
        }
        return AssignmentRepository.delete(id, userId); 
    },

    listByUser(userId, filters = {}) {
        const { courseId, completionStatus, priority } = filters;
        if (courseId !== undefined && !ObjectId.isValid(courseId)) {
            const err = new Error("Invalid courseId");
            err.code = "INVALID_COURSE";
            throw err;
        }
        
        return AssignmentRepository.listByUser(userId, { courseId, completionStatus, priority });
    },

    async getById(id, userId) {
        if (!ObjectId.isValid(id)) {
            const err = new Error("Invalid id");
            err.code = "INVALID_ID";
            throw err;
        }
        return AssignmentRepository.findOwned(id, userId);
    },
};
