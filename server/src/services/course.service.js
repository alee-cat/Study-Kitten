//server/src/services/course.service.js

import { ObjectId } from "mongodb";
import { CourseRepository } from "../repositories/course.repository.js";
import { assertNonEmpty } from "../utils/validation.js";

function assertValidId(id) {
    if (!ObjectId.isValid(id)) {
        const err = new Error("Invalid id");
        err.code = "INVALID_ID";
        throw err;
    }
}

export const CourseService = {
    create({ userId, title, professor }) {
        assertNonEmpty(title, "title", "MISSING_TITLE");

        return CourseRepository.create({
            userId,
            title,
            professor
        });
    },

    listByUser(userId) {
        return CourseRepository.listByUser(userId);
    },

    async update(id, userId, changes) {
        assertValidId(id);
        const next = { ...changes };
        if (next.name !== undefined) {
            assertNonEmpty(next.name, "title", "MISSING_TITLE");
            next.name = next.name.trim();
        }
        return CourseRepository.update(id, userId, next);
    },

    async delete(id, userId) {
        assertValidId(id);
        return CourseRepository.delete(id, userId);
    },
    
};