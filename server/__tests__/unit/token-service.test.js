// server/__tests__/unit/token-test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import { TokenService } from "../../src/services/token.service.js";

test("issues tokens with user id", () => {
    const { accessToken } = TokenService.issueTokens({ _id: "abc123", email: "a@b.com" });
    const payload = TokenService.verifyAccessToken(accessToken);
    assert.equal(payload.sub, "abc123");
    assert.equal(payload.email, "a@b.com");
});

test("refresh tokens verify with the refresh secret", () => {
    const { refreshToken } = TokenService.issueTokens({ id: "abc123", email: "a@b.com" });
    assert.equal(TokenService.verifyRefreshToken(refreshToken).sub, "abc123");
});

test("throws when the user has no id", () => {
    assert.throws(() => TokenService.issueTokens({ email: "a@b.com" }));
});

test("rejects a modified token", () => {
    const { accessToken } = TokenService.issueTokens({ id: "abc123", email: "a@b.com" });
    assert.throws(() => TokenService.verifyAccessToken(accessToken + "x"));
});

test("an access token is not valid as a refresh token", () => {
    const { accessToken } = TokenService.issueTokens({ id: "abc123", email: "a@b.com" });
    assert.throws(() => TokenService.verifyRefreshToken(accessToken));
});