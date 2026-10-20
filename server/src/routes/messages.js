import { Router } from "express";
import mongoose from "mongoose";
import { Message } from "../models/Message.js";
import { adminAuth } from "../middleware/adminAuth.js";

/** Minimal inbox API for reading enquiries. Requires the x-admin-key header. */
const router = Router();
router.use(adminAuth);

const STATUSES = ["new", "read", "replied", "archived"];

router.get("/", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const filter = STATUSES.includes(req.query.status) ? { status: req.query.status } : {};
  const [items, total] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Message.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

router.patch("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid message id." });
  if (!STATUSES.includes(req.body?.status)) {
    return res.status(400).json({ error: `Status must be one of: ${STATUSES.join(", ")}.` });
  }
  const msg = await Message.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!msg) return res.status(404).json({ error: "Message not found." });
  res.json(msg);
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid message id." });
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ error: "Message not found." });
  res.status(204).end();
});

export default router;
