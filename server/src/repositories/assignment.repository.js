//server/src/repositories/assignment.repository.js

import { assignments } from "../../mongodb/collection.js";

export const AssignmentRepository = {
    async create({ userId, title, assignmentType, course, dueDate, status, priority}) {
       const result = await assignments().insertOne({userId, title, assignmentType, course, dueDate, status, priority});
       return { 
           _id: result.insertedId, 
           userId, title, assignmentType, course, dueDate, status, priority};
    },
    
    async findAssignment({ page, pageSize }) {
        const rows = await assignments()
            .find({ status: "IN_PROGRESS"})
            .sort({ dueDate: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize + 1)
            .toArray();
        const hasMore = rows.length > pageSize;
        return { posts: rows.slice(0, pageSize), hasMore };
    },
};