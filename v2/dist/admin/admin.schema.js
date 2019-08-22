"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.AdminSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
    scope: { type: String, required: true, enum: ['all', 'user', 'course'] },
});
//# sourceMappingURL=admin.schema.js.map