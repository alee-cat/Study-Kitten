// server/__tests__/unit/dates.test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDueDate } from "../../src/utils/dates.js";

test("parses a valid date string into a Date", () => {
    const d = parseDueDate("2026-11-02");
    assert.ok(d instanceof Date);
    assert.equal(d.toISOString().slice(0, 10), "2026-11-02");
});

test("throws INVALID_DUE_DATE for garbage", () => {
    assert.throws(() => parseDueDate("nope"), { code: "INVALID_DUE_DATE" });
});