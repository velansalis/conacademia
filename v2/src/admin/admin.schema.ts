import * as mongoose from 'mongoose';

export const AdminSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
    scope: { type: String, required: true, enum: ['all', 'user', 'course'] },
});
