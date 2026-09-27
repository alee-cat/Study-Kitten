//server/src/index.js

import express from 'express';
const app = express();
const PORT = process.env.PORT || 4000;
app.get("/api/health", (res, req) => {
    res.status(200).json({ status: "ok", service: "StudyKitten-api"});
});

app.listen(PORT, () => {
    console.log(`StudyKitten API is listening on port ${PORT}`);
});