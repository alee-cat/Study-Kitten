//server/src/repositories/user.repository.js

import { users } from "../../mongodb/collection.js";

export const UserRepository = {
    async findByEmail(email) {
        return users().findOne({ email: email });
    },
    
    async create({ email, displayName, passwordHash }) {
        const result = await users().insertOne({
            email, displayName, passwordHash
        });
        
        return {
            _id: result.insertedId, email, displayName
        }
    },
};

