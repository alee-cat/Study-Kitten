import { mongoDB } from "../src/db/client.js";

const users = () => mongoDB().collection("users", {
    $jsonSchema: {
        bsonType: "object",
        required: [ "email", "displayName", "passwordHash" ],
    }
});

async function createIndexes() {
    await users().createIndex({ email: 1 }, { unique: true });
}

const assignments = () => mongoDB().collection("assignments", {
    $jsonSchema: {
        bsonType: "object",
        required: [ "userId", ""]
    }
});
//study tasks/goals collection
//course collection

export { users, assignments, createIndexes };