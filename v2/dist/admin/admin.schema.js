"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.AdminSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String },
    age: { type: Number },
    username: { type: String },
});
//# sourceMappingURL=admin.schema.js.map