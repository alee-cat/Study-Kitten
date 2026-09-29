//server/src/services/post.service.js
//NOT COMPLETED !!

import { AssignmentRepository } from "../repositories/assignment.repository.js";
import { assertNonEmpty } from "../utils/validation.js";

export const AssignmentService = {
    create({ userId, title, assignmentType, course, dueDate, priority }) {
        assertNonEmpty(title, "title", "MISSING_TITLE");
        assertNonEmpty();
        
        return AssignmentRepository.create({
            userId,
            title,
            assignmentType,
            course,
            dueDate,
            status: "IN_PROGRESS",
            priority,
        });
    },
    
    async listPublished({ page = 1, pageSize = 10}) {
        const { posts, hasMore } = await AssignmentRepository.findAssignment({ page, pageSize });
        return { posts, page, hasMore };
    },
};