import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import { setup, teardown, registerAndLogin, createCourse, bearer } from "./helpers/test-setup.js";

let token, otherToken, course;

const create = (body, t = token) =>
    request(app).post("/api/tasks").set(bearer(t)).send(body);

before(async () => {
    await setup();
    ({ token } = await registerAndLogin("tasks"));
    ({ token: otherToken } = await registerAndLogin("tasksother"));
    course = await createCourse(token);
});
after(teardown);

describe("tasks create", () => {
    test("creates a task with a course", async () => {
        const res = await create({
            title: "Review chapter 3",
            courseId: course._id,
            description: "Focus on diagrams",
        });
        assert.equal(res.status, 201);
        assert.equal(res.body.title, "Review chapter 3");
        assert.ok(res.body._id);
    });

    test("creates a task without a course", async () => {
        const res = await create({ title: "Plan schedule" });
        assert.equal(res.status, 201);
        assert.equal(res.body.courseId, null);
    });

    test("rejects a missing title", async () => {
        const res = await create({ description: "no title" });
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "MISSING_TITLE");
    });

    test("rejects an unknown or foreign course", async () => {
        const unknown = await create({ title: "x", courseId: "000000000000000000000000" });
        assert.equal(unknown.status, 400);
        assert.equal(unknown.body.error.code, "INVALID_COURSE");

        const foreign = await create({ title: "x", courseId: course._id }, otherToken);
        assert.equal(foreign.status, 400);
        assert.equal(foreign.body.error.code, "INVALID_COURSE");
    });

    test("requires auth", async () => {
        const res = await request(app).post("/api/tasks").send({ title: "x" });
        assert.equal(res.status, 401);
    });
});

describe("task read", () => {
    test("lists tasks with the joined course, and filters by course", async () => {
        const all = await request(app).get("/api/tasks").set(bearer(token));
        assert.equal(all.status, 200);
        assert.ok(all.body.length >= 2);

        const filtered = await request(app)
            .get(`/api/tasks?courseId=${course._id}`)
            .set(bearer(token));
        assert.ok(filtered.body.length >= 1);
        assert.ok(filtered.body.every((t) => t.course?.title === "Biology 101"));
    });

    test("only lists the current user's tasks", async () => {
        const res = await request(app).get("/api/tasks").set(bearer(otherToken));
        assert.deepEqual(res.body, []);
    });

    test("rejects a malformed courseId filter", async () => {
        const res = await request(app).get("/api/tasks?courseId=abc").set(bearer(token));
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "INVALID_COURSE");
    });

    test("gets one task", async () => {
        const { body: made } = await create({ title: "Single", courseId: course._id });

        const res = await request(app).get(`/api/tasks/${made._id}`).set(bearer(token));
        assert.equal(res.status, 200);
        assert.equal(res.body.title, "Single");
        assert.equal(res.body.course.title, "Biology 101");
    });
})

describe("task update", () => {
    test("updates a task", async () => {
        const { body: made } = await create({ title: "Old title" });

        const res = await request(app)
            .patch(`/api/tasks/${made._id}`)
            .set(bearer(token))
            .send({ title: "New title", description: "Updated" });
        assert.equal(res.status, 200);
        assert.equal(res.body.title, "New title");
    });

    test("removes a task from its course with courseId null", async () => {
        const { body: made } = await create({ title: "Attached", courseId: course._id });

        const res = await request(app)
            .patch(`/api/tasks/${made._id}`)
            .set(bearer(token))
            .send({ courseId: null });
        assert.equal(res.status, 200);
        assert.equal(res.body.courseId, null);
    });

    test("rejects an empty title on update", async () => {
        const { body: made } = await create({ title: "Has title" });

        const res = await request(app)
            .patch(`/api/tasks/${made._id}`)
            .set(bearer(token))
            .send({ title: "   " });
        assert.equal(res.status, 400);
    });

    test("attaches a task to an owned course", async () => {
        const { body: made } = await create({ title: "Unattached" });

        const res = await request(app)
            .patch(`/api/tasks/${made._id}`)
            .set(bearer(token))
            .send({ courseId: course._id });
        assert.equal(res.status, 200);

        const fetched = await request(app).get(`/api/tasks/${made._id}`).set(bearer(token));
        assert.equal(fetched.body.course.title, "Biology 101");
    });

    test("detaches a task from its course with courseId null", async () => {
        const { body: made } = await create({ title: "Attached", courseId: course._id });

        const res = await request(app)
            .patch(`/api/tasks/${made._id}`)
            .set(bearer(token))
            .send({ courseId: null });
        assert.equal(res.status, 200);
        assert.equal(res.body.courseId, null);
    });
})

describe("task delete", () => {
    test("deletes a task", async () => {
        const { body: made } = await create({ title: "To delete" });

        const del = await request(app).delete(`/api/tasks/${made._id}`).set(bearer(token));
        assert.equal(del.status, 204);

        const again = await request(app).delete(`/api/tasks/${made._id}`).set(bearer(token));
        assert.equal(again.status, 404);
    });

    test("another user cannot delete it", async () => {
        const { body: made } = await create({ title: "Keep" });

        const del = await request(app).delete(`/api/tasks/${made._id}`).set(bearer(otherToken));
        assert.equal(del.status, 404);

        const still = await request(app).get(`/api/tasks/${made._id}`).set(bearer(token));
        assert.equal(still.status, 200);
    });
})