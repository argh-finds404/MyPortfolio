import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    projectType: { type: String, trim: true, maxlength: 80 },
    budget: { type: String, trim: true, maxlength: 80 },
    message: { type: String, required: true, maxlength: 5000 },
    status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new" },
    ip: String,
    userAgent: String,
  },
  { timestamps: true },
);

export const Message = mongoose.models.Message ?? mongoose.model("Message", messageSchema);
