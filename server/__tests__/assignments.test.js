// server/__tests__/assignments.test.js

import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import { setup, teardown, registerAndLogin, createCourse, bearer } from "./helpers/test-setup.js";

let token, otherToken, course;

const validBody = (courseId, overrides = {}) => ({
    title: "Lab report",
    assignmentType: "homework",
    courseId,
    dueDate: "2026-10-15",
    completionStatus: "not_started",
    priority: "high",
    ...overrides,
});

const create = (body, t = token) =>
    request(app).post("/api/assignments").set(bearer(t)).send(body);

before(async () => {
    await setup();
    ({ token } = await registerAndLogin("assign"));
    ({ token: otherToken } = await registerAndLogin("other"));
    course = await createCourse(token);
});
after(teardown);

describe("assignments create", () => {
    test("creates an assignment", async () => {
        const res = await create(validBody(course._id));
        assert.equal(res.status, 201);
        assert.equal(res.body.title, "Lab report");
        assert.ok(res.body._id);
    });

    test("rejects a missing title", async () => {
        const res = await create(validBody(course._id, { title: "" }));
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "MISSING_TITLE");
    });

    test("rejects an invalid due date", async () => {
        const res = await create(validBody(course._id, { dueDate: "not-a-date" }));
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "INVALID_DUE_DATE");
    });

    test("rejects a course that doesn't exist", async () => {
        const res = await create(validBody("000000000000000000000000"));
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "INVALID_COURSE");
    });

    test("rejects a malformed courseId", async () => {
        const res = await create(validBody("abc"));
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "INVALID_COURSE");
    });

    test("rejects another user's course", async () => {
        const res = await create(validBody(course._id), otherToken);
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "INVALID_COURSE");
    });

    test("requires auth", async () => {
        const res = await request(app).post("/api/assignments").send(validBody(course._id));
        assert.equal(res.status, 401);
    });
});

describe("assignments read", () => {
    test("lists assignments with the joined course", async () => {
        await create(validBody(course._id, { title: "For listing" }));
        const res = await request(app).get("/api/assignments").set(bearer(token));
        assert.equal(res.status, 200);
        assert.ok(res.body.length >= 1);
        assert.equal(res.body[0].course.title, "Biology 101");
        assert.equal(res.body[0].course.userId, undefined);
    });

    test("filters the list by course and status", async () => {
        const course2 = await createCourse(token, "Chemistry");
        await create(validBody(course2._id, { title: "Problem set", completionStatus: "done" }));

        const byCourse = await request(app)
            .get(`/api/assignments?courseId=${course2._id}`)
            .set(bearer(token));
        assert.equal(byCourse.body.length, 1);
        assert.equal(byCourse.body[0].title, "Problem set");

        const byStatus = await request(app)
            .get("/api/assignments?completionStatus=done")
            .set(bearer(token));
        assert.ok(byStatus.body.every((a) => a.completionStatus === "done"));
    });

    test("sorts by priority, high first", async () => {
        await create(validBody(course._id, { title: "L", priority: "low" }));
        await create(validBody(course._id, { title: "H", priority: "high" }));
        await create(validBody(course._id, { title: "M", priority: "medium" }));

        const res = await request(app).get("/api/assignments?sortBy=priority").set(bearer(token));
        assert.equal(res.status, 200);

        const rank = { high: 1, medium: 2, low: 3 };
        const ranks = res.body.map((a) => rank[a.priority] ?? 4);
        assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b));
    });

    test("rejects a malformed courseId filter", async () => {
        const res = await request(app).get("/api/assignments?courseId=abc").set(bearer(token));
        assert.equal(res.status, 400);
    });

    test("only lists the current user's assignments", async () => {
        const res = await request(app).get("/api/assignments").set(bearer(otherToken));
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, []);
    });

    test("returns 400 for a malformed id", async () => {
        const res = await request(app).get("/api/assignments/not-an-id").set(bearer(token));
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "INVALID_ID");
    });
});

describe("assignments update", () => {
    test("updates an assignment", async () => {
        const { body: made } = await create(validBody(course._id, { title: "To update" }));

        const res = await request(app)
            .patch(`/api/assignments/${made._id}`)
            .set(bearer(token))
            .send({ completionStatus: "done" });
        assert.equal(res.status, 200);
        assert.equal(res.body.completionStatus, "done");
        assert.equal(res.body.title, "To update");
    });

    test("move an assignment to another owned course", async () => {
        const other = await createCourse(token, "Physics");
        const { body: made } = await create(validBody(course._id, { title: "Movable" }));

        const res = await request(app)
            .patch(`/api/assignments/${made._id}`)
            .set(bearer(token))
            .send({ courseId: other._id });
        assert.equal(res.status, 200);

        const fetched = await request(app).get(`/api/assignments/${made._id}`).set(bearer(token));
        assert.equal(fetched.body.course.title, "Physics");
    });

    test("cannot move an assignment to someone else's course", async () => {
        const { body: made } = await create(validBody(course._id, { title: "Stay put" }));
        const theirs = await createCourse(otherToken, "Theirs");

        const res = await request(app)
            .patch(`/api/assignments/${made._id}`)
            .set(bearer(token))
            .send({ courseId: theirs._id });
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "INVALID_COURSE");
    });

    test("rejects an invalid due date on update", async () => {
        const { body: made } = await create(validBody(course._id));

        const res = await request(app)
            .patch(`/api/assignments/${made._id}`)
            .set(bearer(token))
            .send({ dueDate: "nope" });
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "INVALID_DUE_DATE");
    });

    test("cannot reassign user through update", async () => {
        const { body: made } = await create(validBody(course._id, { title: "Owned" }));

        await request(app)
            .patch(`/api/assignments/${made._id}`)
            .set(bearer(token))
            .send({ userId: "someone-else", title: "Still mine" });

        const res = await request(app).get(`/api/assignments/${made._id}`).set(bearer(token));
        assert.equal(res.status, 200);
        assert.equal(res.body.title, "Still mine");
    });

    test("another user cannot update it", async () => {
        const { body: made } = await create(validBody(course._id, { title: "Protected" }));

        const res = await request(app)
            .patch(`/api/assignments/${made._id}`)
            .set(bearer(otherToken))
            .send({ title: "Hacked" });
        assert.equal(res.status, 404);
    });
});

describe("assignments delete", () => {
    test("deletes an assignment", async () => {
        const { body: made } = await create(validBody(course._id, { title: "To delete" }));

        const del = await request(app).delete(`/api/assignments/${made._id}`).set(bearer(token));
        assert.equal(del.status, 204);

        const again = await request(app).delete(`/api/assignments/${made._id}`).set(bearer(token));
        assert.equal(again.status, 404);
    });

    test("another user cannot delete it", async () => {
        const { body: made } = await create(validBody(course._id, { title: "Keep" }));

        const del = await request(app).delete(`/api/assignments/${made._id}`).set(bearer(otherToken));
        assert.equal(del.status, 404);

        const still = await request(app).get(`/api/assignments/${made._id}`).set(bearer(token));
        assert.equal(still.status, 200);
    });

    test("returns 400 for a malformed id", async () => {
        const res = await request(app).delete("/api/assignments/not-an-id").set(bearer(token));
        assert.equal(res.status, 400);
    });
});