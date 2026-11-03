// server/src.app.js

import "dotenv/config"
import express from 'express';
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import courseRoutes from "./routes/course.routes.js";
import taskRoutes from "./routes/task.routes.js";


export const app = express();


app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", assignmentRoutes);
app.use("/api", taskRoutes);
app.use("/api", healthRoutes);


app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: { code: err.code || "INTERNAL_ERROR", message: err.message },
    });
});
