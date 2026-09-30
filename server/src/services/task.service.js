//server/src/services/studyTask.service.js
import { ObjectId } from "mongodb";
import { TaskRepository } from "../repositories/task.repository.js";
import { CourseRepository } from "../repositories/course.repository.js";
import { assertNonEmpty } from "../utils/validation.js";

function fail(message, code) {
    const err = new Error(message);
    err.code = code;
    return err;
}

function assertValidId(id) {
    if (!ObjectId.isValid(id)) throw fail("Invalid id", "INVALID_ID");
}

// courseId is optional: undefined or null means "no course"
async function assertCourseOwned(courseId, userId) {
    if (courseId == null) return;
    if (!ObjectId.isValid(courseId) || !(await CourseRepository.findOwned(courseId, userId))) {
        throw fail("Invalid courseId", "INVALID_COURSE");
    }
}

export const TaskService = {
    async create({ userId, title, courseId, description }) {
        assertNonEmpty(title, "title", "MISSING_TITLE");
        await assertCourseOwned(courseId, userId);

        return TaskRepository.create({
            userId,
            title: title.trim(),
            courseId,
            description: description?.trim(),
        });
    },

    listByUser(userId, filters = {}) {
        const { courseId } = filters;
        if (courseId !== undefined && !ObjectId.isValid(courseId)) {
            throw fail("Invalid courseId", "INVALID_COURSE");
        }
        return TaskRepository.listByUser(userId, { courseId });
    },

    async getById(id, userId) {
        assertValidId(id);
        return TaskRepository.findOwned(id, userId);
    },

    async update(id, userId, changes) {
        assertValidId(id);
        const next = { ...changes };
        if (next.title !== undefined) {
            assertNonEmpty(next.title, "title", "MISSING_TITLE");
            next.title = next.title.trim();
        }
        if (next.courseId !== undefined) await assertCourseOwned(next.courseId, userId);

        return TaskRepository.update(id, userId, next);
    },

    async delete(id, userId) {
        assertValidId(id);
        return TaskRepository.delete(id, userId);
    },
};