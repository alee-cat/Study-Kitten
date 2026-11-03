// server/__tests__/courses.test.js

import {test, before, after, describe} from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";
import { setup, teardown, registerAndLogin, createCourse, bearer } from "./helpers/test-setup.js";

let token, otherToken;

before(async () => {
    await setup();
    ({ token } = await registerAndLogin("courses"));
    ({ token: otherToken } = await registerAndLogin("othercourses"));
});
after(teardown);

describe("course creation", () => {
    test("creates and lists a course", async () => {
        const created = await request(app)
            .post("/api/courses")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Biology 101", professor: "Dr. Lee" });
        assert.equal(created.status, 201);

        const list = await request(app).get("/api/courses").set("Authorization", `Bearer ${token}`);
        assert.equal(list.body.length, 1);
    });

    test("rejects a missing token", async () => {
        const res = await request(app).get("/api/courses");
        assert.equal(res.status, 401);
    });

    test("rejects an assignment for another user's course", async () => {
        const res = await request(app)
            .post("/api/assignments")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "x", assignmentType: "homework", courseId: "000000000000000000000000",
                dueDate: "2026-10-15", completionStatus: "not_started" });
        assert.equal(res.status, 400);
        assert.equal(res.body.error.code, "INVALID_COURSE");
    });
})

describe("course update", () => {
    test("updates a course", async () => {
        const course = await createCourse(token, "Old title");

        const res = await request(app)
            .patch(`/api/courses/${course._id}`)
            .set(bearer(token))
            .send({ title: "New title", professor: "Dr. Patel" });
        assert.equal(res.status, 200);
        assert.equal(res.body.title, "New title");
        assert.equal(res.body.professor, "Dr. Patel");
    });

    test("another user cannot edit it", async () => {
        const course = await createCourse(token, "Protected");

        const res = await request(app)
            .patch(`/api/courses/${course._id}`)
            .set(bearer(otherToken))
            .send({ title: "Hacked" });
        assert.equal(res.status, 404);
    });

    test("returns 404 for an unknown id and 400 for a malformed one", async () => {
        const unknown = await request(app)
            .patch("/api/courses/000000000000000000000000")
            .set(bearer(token))
            .send({ title: "x" });
        assert.equal(unknown.status, 404);

        const bad = await request(app)
            .patch("/api/courses/not-an-id")
            .set(bearer(token))
            .send({ title: "x" });
        assert.equal(bad.status, 400);
        assert.equal(bad.body.error.code, "INVALID_ID");
    });

    test("edit requires auth", async () => {
        const course = await createCourse(token);
        const res = await request(app).patch(`/api/courses/${course._id}`).send({ title: "x" });
        assert.equal(res.status, 401);
    });
})

describe("course deletion", () => {
    test("deletes a course", async () => {
        const course = await createCourse(token, "To delete");

        const del = await request(app).delete(`/api/courses/${course._id}`).set(bearer(token));
        assert.equal(del.status, 204);

        const list = await request(app).get("/api/courses").set(bearer(token));
        assert.equal(list.body.some((c) => c._id === course._id), false);
    });

    test("another user cannot delete it", async () => {
        const course = await createCourse(token, "Keep");

        const res = await request(app).delete(`/api/courses/${course._id}`).set(bearer(otherToken));
        assert.equal(res.status, 404);

        const list = await request(app).get("/api/courses").set(bearer(token));
        assert.ok(list.body.some((c) => c._id === course._id));
    });

    test("delete requires auth", async () => {
        const course = await createCourse(token);
        const res = await request(app).delete(`/api/courses/${course._id}`);
        assert.equal(res.status, 401);
    });
    
    test("deleting a course also deletes its assignments", async () => {
        const course = await createCourse(token, "Cascade");
        const made = await request(app)
            .post("/api/assignments")
            .set(bearer(token))
            .send({
                title: "Orphan test",
                assignmentType: "homework",
                courseId: course._id,
                dueDate: "2026-10-15",
                completionStatus: "not_started",
            });
        assert.equal(made.status, 201);

        await request(app).delete(`/api/courses/${course._id}`).set(bearer(token));

        const res = await request(app).get(`/api/assignments/${made.body._id}`).set(bearer(token));
        assert.equal(res.status, 404);
    });
})