//server/src/db/client.js

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
    await client.connect();
    db = client.db("StudyKitten");
    console.log("Connected to DB");
}

function mongoDB() {
    if (!db) throw new Error("Database is not connected.");
    return db;
}

export { connectDB, mongoDB };