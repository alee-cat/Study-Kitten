// server/__tests__/unit/validation.test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import { assertNonEmpty } from "../../src/utils/validation.js";

test("accepts a non-empty string", () => {
    assert.doesNotThrow(() => assertNonEmpty("hello", "title", "MISSING_TITLE"));
});

test("rejects empty, whitespace, and undefined", () => {
    for (const bad of ["", "   ", undefined, null]) {
        assert.throws(() => assertNonEmpty(bad, "title", "MISSING_TITLE"), { code: "MISSING_TITLE" });
    }
});