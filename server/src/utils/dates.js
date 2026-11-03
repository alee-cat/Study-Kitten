// src/utils/dates.js

export function parseDueDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        const err = new Error("Invalid dueDate");
        err.code = "INVALID_DUE_DATE";
        throw err;
    }
    return date;
}