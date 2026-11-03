// server/__tests__/helpers/test-setup.js

import request from "supertest";
import { app } from "../../src/app.js";
import { connectDB, closeDB } from "../../src/db/client.js";
import { createIndexes } from "../../mongodb/collection.js";

export const PASSWORD = "Passw0rd!123";

export async function setup() {
    await connectDB();
    await createIndexes();
}

export async function teardown() {
    await closeDB();
}

export function uniqueEmail(label) {
    return `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.com`;
}

// registers a new user and returns { email, token }
export async function registerAndLogin(label = "user") {
    const email = uniqueEmail(label);
    const reg = await request(app)
        .post("/api/auth/register")
        .send({ email, password: PASSWORD, displayName: label });
    if (reg.status !== 201) throw new Error(`register failed: ${reg.status} ${JSON.stringify(reg.body)}`);

    const login = await request(app).post("/api/auth/login").send({ email, password: PASSWORD });
    const token = login.body.accessToken;
    if (!token) throw new Error(`login returned no accessToken: ${login.status} ${JSON.stringify(login.body)}`);

    return { email, token };
}

export const bearer = (token) => ({ Authorization: `Bearer ${token}` });

export async function createCourse(token, title = "Biology 101") {
    const res = await request(app)
        .post("/api/courses")
        .set(bearer(token))
        .send({ title, professor: "Dr. Lee" });
    if (res.status !== 201) throw new Error(`createCourse failed: ${res.status} ${JSON.stringify(res.body)}`);
    return res.body;
}