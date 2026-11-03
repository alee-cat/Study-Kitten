// server/src/middleware/auth.middleware.js
import { TokenService } from "../services/token.service.js";

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            error: { code: "UNAUTHORIZED", message: "Missing token" },
        });
    }

    try {
        const payload = TokenService.verifyAccessToken(token);
        req.user = { id: payload.sub };
        next();
    } catch {
        res.status(401).json({
            error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
        });
    }
}