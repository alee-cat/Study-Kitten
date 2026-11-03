//server/src/repositories/course.repository.js

import { ObjectId } from 'mongodb';
import { courses, assignments } from "../../mongodb/collection.js";

export const CourseRepository = {
    async create({ userId, title, professor }) {
        const doc = { userId, title, professor };
        const result = await courses().insertOne(doc);
        return {
            _id: result.insertedId, ...doc };
    },

    async listByUser(userId) {
        return courses().find({ userId }).sort({ name: 1 }).toArray();
    },

    async findOwned(id, userId) {
        return courses().findOne({ _id: new ObjectId(id), userId });
    },

    async update(id, userId, changes) {
        const allowed = ["title", "professor"];
        const $set = {};
        for (const key of allowed) {
            if (changes[key] !== undefined) $set[key] = changes[key];
        }
        if (Object.keys($set).length === 0) return null;

        return courses().findOneAndUpdate(
            { _id: new ObjectId(id), userId },
            { $set },
            { returnDocument: "after" }
        );
    },

    async delete(id, userId) {
        const courseId = new ObjectId(id);
        const result = await courses().deleteOne({ _id: courseId, userId });
        if (result.deletedCount !== 1) return false;

        // remove the course's assignments so none are left pointing at a missing course
        await assignments().deleteMany({ courseId, userId });
        return true;
    },
};