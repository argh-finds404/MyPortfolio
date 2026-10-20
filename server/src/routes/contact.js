import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { Message } from "../models/Message.js";
import { isDBReady } from "../config/db.js";
import { notifyNewMessage } from "../lib/mailer.js";

const router = Router();

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.email("Enter a valid email address.").max(200),
  projectType: z.string().trim().max(80).default("Not specified"),
  budget: z.string().trim().max(80).default("Not specified"),
  message: z.string().trim().min(10, "Tell me a little more about the project (10+ characters).").max(5000),
  company: z.string().optional(), // honeypot
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many messages from this connection. Try again in 15 minutes." },
});

router.post("/", limiter, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Check the form and try again." });
  }
  const { company, ...data } = parsed.data;

  // Bots fill the hidden field; pretend it worked.
  if (company) return res.status(201).json({ ok: true });

  let stored = false;
  if (isDBReady()) {
    await Message.create({ ...data, ip: req.ip, userAgent: req.get("user-agent") });
    stored = true;
  }

  let emailed = false;
  try {
    emailed = await notifyNewMessage(data);
  } catch (err) {
    console.error("[mail] failed to send notification:", err.message);
  }

  if (!stored && !emailed) console.log("[contact] new message (no DB or SMTP configured):", data);
  res.status(201).json({ ok: true });
});

export default router;
