//server/src/repositories/task.repository.js

import { tasks } from "../../mongodb/collection.js";

export const TaskRepository = {
    async create({ userId, title, course, description }) {
        const result = await tasks().insertOne({userId, title, course, description });
        return {
            _id: result.insertedId,
            userId, title, course, description };
    },
};

//need edit and delete functions