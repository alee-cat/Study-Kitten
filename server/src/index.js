//server/src/index.js

import { app } from "./app.js"
import { connectDB } from "./db/client.js";
import { createIndexes } from "../mongodb/collection.js";

const PORT = process.env.PORT || 4000;

try{
    await connectDB();
    await createIndexes();
    app.listen(PORT, () => console.log(`StudyKitten API is listening on port ${PORT}`));
} catch(err) {
    console.error(err);
}
