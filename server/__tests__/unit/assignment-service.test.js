// server/__tests__/unit/assignment-service.test.js
import { test, mock, afterEach } from "node:test";
import assert from "node:assert/strict";
import { AssignmentService } from "../../src/services/assignment.service.js";
import { AssignmentRepository } from "../../src/repositories/assignment.repository.js";
import { CourseRepository } from "../../src/repositories/course.repository.js";

const COURSE_ID = "000000000000000000000001";
const input = (over = {}) => ({
    userId: "u1", title: "Lab", assignmentType: "homework",
    courseId: COURSE_ID, dueDate: "2026-10-15", completionStatus: "not_started", ...over,
});

afterEach(() => mock.restoreAll());

test("create passes a Date to the repository", async () => {
    mock.method(CourseRepository, "findOwned", async () => ({ _id: COURSE_ID }));
    const create = mock.method(AssignmentRepository, "create", async (doc) => doc);

    await AssignmentService.create(input());

    assert.equal(create.mock.callCount(), 1);
    assert.ok(create.mock.calls[0].arguments[0].dueDate instanceof Date);
});

test("create rejects a course the user doesn't own", async () => {
    mock.method(CourseRepository, "findOwned", async () => null);
    const create = mock.method(AssignmentRepository, "create", async () => {});

    await assert.rejects(() => AssignmentService.create(input()), { code: "INVALID_COURSE" });
    assert.equal(create.mock.callCount(), 0);
});

test("create rejects a missing title before touching database", async () => {
    const find = mock.method(CourseRepository, "findOwned", async () => null);
    await assert.rejects(() => AssignmentService.create(input({ title: "" })), { code: "MISSING_TITLE" });
    assert.equal(find.mock.callCount(), 0);
});

test("delete rejects a malformed id", async () => {
    await assert.rejects(async () => AssignmentService.delete("bad", "u1"), { code: "INVALID_ID" });
});