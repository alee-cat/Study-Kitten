//server/src/repositories/studyTask.repository.js
import { ObjectId } from "mongodb";
import { tasks } from "../../mongodb/collection.js";

const toId = (id) => (id == null ? null : new ObjectId(id));

//optional course field
const withCourse = [
    { $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
        } },
    { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
    { $project: { "course.userId": 0 } },
];

export const TaskRepository = {
    async create({ userId, title, courseId, description }) {
        const doc = {
            userId,
            title,
            courseId: toId(courseId),
            description,
        };
        const result = await tasks().insertOne(doc);
        return { _id: result.insertedId, ...doc };
    },

    async listByUser(userId, { courseId } = {}) {
        const match = { userId };
        if (courseId) match.courseId = new ObjectId(courseId);

        return tasks().aggregate([
            { $match: match },
            ...withCourse,
            { $sort: { createdAt: -1 } },
        ]).toArray();
    },

    async findOwned(id, userId) {
        const [doc] = await tasks().aggregate([
            { $match: { _id: new ObjectId(id), userId } },
            ...withCourse,
        ]).toArray();
        return doc ?? null;
    },

    async update(id, userId, changes) {
        const allowed = ["title", "courseId", "description"];
        const $set = {};
        for (const key of allowed) {
            if (changes[key] !== undefined) {
                $set[key] = key === "courseId" ? toId(changes[key]) : changes[key];
            }
        }
        if (Object.keys($set).length === 0) return null;

        return tasks().findOneAndUpdate(
            { _id: new ObjectId(id), userId },
            { $set },
            { returnDocument: "after" }
        );
    },

    async delete(id, userId) {
        const result = await tasks().deleteOne({ _id: new ObjectId(id), userId });
        return result.deletedCount === 1;
    },
};