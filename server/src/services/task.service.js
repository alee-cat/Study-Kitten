//server/src/services/post.service.js

import { TaskRepository } from "../repositories/task.repository.js";
import { assertNonEmpty } from "../utils/validation.js";

export const TaskService = {
    create({ userId, title, course, description }) {
        assertNonEmpty(title, "title", "MISSING_TITLE");
        assertNonEmpty();

        return TaskRepository.create({
            userId,
            title,
            course,
            description,
        });
    },
};