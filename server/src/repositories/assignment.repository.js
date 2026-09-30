//server/src/repositories/assignment.repository.js

import { ObjectId } from 'mongodb';
import { assignments } from "../../mongodb/collection.js";

const toId = (id) => (id == null ? id : new ObjectId(id));

export const AssignmentRepository = {
    async create({ userId, title, assignmentType, courseId, dueDate, completionStatus, priority}) {
       const doc = {
           userId,
           title,
           assignmentType,
           courseId: toId(courseId),
           dueDate,
           completionStatus,
           priority,
       };
       const result = await assignments().insertOne(doc);
       return { 
           _id: result.insertedId, ...doc};
    },
    
    async update(id, userId, changes) {
        const allowed = ["title", "assignmentType", "courseId", "dueDate", "completionStatus", "priority"];
        const $set = {};
        
        for (const key of allowed) {
            if (changes[key] !== undefined) {
                $set[key] = key === "courseId" ? toId(changes[key]) : changes[key];
            }
        }
        if (Object.keys($set).length === 0) return null;
        
        return assignments().findOneAndUpdate(
            { _id: new ObjectId(id), userId },
            { $set },
            { returnDocument: "after" }
        );
    },
    
    async delete(id, userId) {
        const result = await assignments().deleteOne({
            _id: new ObjectId(id),
            userId,
        });
        return result.deletedCount === 1;
    },

    async listByUser(userId, { courseId, completionStatus, priority } = {}) {
        const match = { userId };
        if (courseId) match.courseId = new ObjectId(courseId);
        if (completionStatus) match.completionStatus = completionStatus;
        if (priority) match.priority = priority;

        return assignments().aggregate([
            { $match: match },
            { $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "course",
                } },
            { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
            { $project: { "course.userId": 0 } },
            { $sort: { dueDate: 1 } },
        ]).toArray();
    },

    async findOwned(id, userId) {
        const [doc] = await assignments().aggregate([
            { $match: { _id: new ObjectId(id), userId } },
            { $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "course",
                } },
            { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
            { $project: { "course.userId": 0 } },
        ]).toArray();
        return doc ?? null;
    },
};
