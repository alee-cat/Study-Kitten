import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import { setup, teardown, uniqueEmail, PASSWORD, bearer, registerAndLogin } from "./helpers/test-setup.js";

before(setup);
after(teardown);

describe("auth", () => {
    test("registers a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: uniqueEmail("reg"), password: PASSWORD, displayName: "Reg" });
        assert.equal(res.status, 201);
        assert.equal(JSON.stringify(res.body).includes("passwordHash"), false);
    });

    test("rejects a duplicate email", async () => {
        const email = uniqueEmail("dup");
        const body = { email, password: PASSWORD, displayName: "Dup" };
        await request(app).post("/api/auth/register").send(body);

        const res = await request(app).post("/api/auth/register").send(body);
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "EMAIL_ALREADY_REGISTERED");
    });

    test("rejects a missing email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ password: PASSWORD, displayName: "NoEmail" });
        assert.equal(res.status, 400);
    });

    test("rejects a weak password", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: uniqueEmail("weak"), password: "1", displayName: "Weak" });
        assert.equal(res.status, 400);
    });

    test("logs in and returns an access token", async () => {
        const email = uniqueEmail("login");
        await request(app).post("/api/auth/register").send({ email, password: PASSWORD, displayName: "Login" });

        const res = await request(app).post("/api/auth/login").send({ email, password: PASSWORD });
        assert.ok([200, 201].includes(res.status));
        assert.ok(res.body.accessToken);
        assert.equal(JSON.stringify(res.body).includes("passwordHash"), false);
    });

    test("rejects a wrong password", async () => {
        const email = uniqueEmail("wrongpw");
        await request(app).post("/api/auth/register").send({ email, password: PASSWORD, displayName: "W" });

        const res = await request(app).post("/api/auth/login").send({ email, password: "WrongPass!999" });
        assert.equal(res.status, 401);
        assert.equal(res.body.error.code, "INVALID_CREDENTIALS");
    });

    test("rejects an unknown email", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: uniqueEmail("ghost"), password: PASSWORD });
        assert.equal(res.status, 401);
    });

    test("protected routes reject a missing token", async () => {
        const res = await request(app).get("/api/courses");
        assert.equal(res.status, 401);
    });

    test("protected routes reject a garbage token", async () => {
        const res = await request(app).get("/api/courses").set(bearer("not.a.token"));
        assert.equal(res.status, 401);
    });

    test("protected routes accept a valid token", async () => {
        const { token } = await registerAndLogin("valid");
        const res = await request(app).get("/api/courses").set(bearer(token));
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, []);
    });
});