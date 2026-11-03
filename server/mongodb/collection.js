import { mongoDB } from "../src/db/client.js";

const users = () => mongoDB().collection("users", {
    $jsonSchema: {
        bsonType: "object",
        required: [ "email", "displayName", "passwordHash" ],
    }
});

async function createIndexes() {
    await users().createIndex({ email: 1 }, { unique: true });

    await assignments().createIndex({ userId: 1, courseId: 1 });
    await assignments().createIndex({ userId: 1, dueDate: 1 });
    
    await courses().createIndex({ userId: 1 });
    
    await tasks().createIndex({ userId: 1, courseId: 1 });
    await tasks().createIndex({ userId: 1, createdAt: -1 });
}

const assignments = () => mongoDB().collection("assignments", {
    $jsonSchema: {
        bsonType: "object",
        required: [ "userId", "title", "assignmentType", "course", "dueDate", "completionStatus", "priority"],
    }
});

const courses = () => mongoDB().collection("courses", {
    $jsonSchema: {
        bsonType: "object",
        required: [ "userId", "title", "professor"],
    }
});

const tasks = () => mongoDB().collection("goals", {
    $jsonSchema: {
        bsonType: "object",
        required: [ "userId", "title", "course", "description" ]
    }
})


export { users, assignments, courses, tasks, createIndexes };