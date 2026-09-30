//server/src/index.js

import "dotenv/config";
import express from 'express';
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import courseRoutes from "./routes/course.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { connectDB } from "./db/client.js";
import { createIndexes } from "../mongodb/collection.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", assignmentRoutes);
app.use("/api", courseRoutes);
app.use("/api", taskRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: { code: err.code || "INTERNAL_ERROR", message: err.message },
    });
});

app.listen(PORT, () => {
    console.log(`StudyKitten API is listening on port ${PORT}`);
});

try{
    await connectDB();
    await createIndexes();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch(err) {
    console.error(err);
}
