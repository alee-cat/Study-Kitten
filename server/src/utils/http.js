//server/src/utils/http.js
const statusByCode = {
    //shared
    INVALID_ID: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,

    //assignments
    MISSING_TITLE: 400,
    MISSING_ASSIGNMENT_TYPE: 400,
    MISSING_DUE_DATE: 400,
    MISSING_COMPLETION_STATUS: 400,
    INVALID_DUE_DATE: 400,

    //courses and assignments and study tasks
    INVALID_COURSE: 400,
};

export function sendError(res, err) {
    const status = statusByCode[err.code] ?? 500;
    if (status === 500) console.error(err);
    res.status(status).json({
        error: {
            code: err.code || "SERVER_ERROR",
            message: status === 500 ? "Something went wrong" : err.message,
        },
    });
}

export function notFound(res) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } });
}