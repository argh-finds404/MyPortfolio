import crypto from "node:crypto";

/** Protects admin routes with the ADMIN_KEY env var, sent as the x-admin-key header. */
export function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return res.status(503).json({ error: "ADMIN_KEY is not configured on the server." });
  const a = Buffer.from(req.get("x-admin-key") ?? "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: "Invalid or missing admin key." });
  }
  next();
}
