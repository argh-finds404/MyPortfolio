import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB, isDBReady } from "./config/db.js";
import contactRoutes from "./routes/contact.js";
import messageRoutes from "./routes/messages.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);
// Comma-separated; "*" is a wildcard, e.g. "https://my-site.vercel.app,https://my-site-*.vercel.app"
const escapeRegExp = (s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
const origins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean)
  .map((o) => new RegExp(`^${o.split("*").map(escapeRegExp).join("[a-z0-9-]+")}$`, "i"));

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: (origin, cb) => cb(null, !origin || origins.some((re) => re.test(origin))) }));
app.use(express.json({ limit: "50kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_req, res) => res.json({ ok: true, service: "portfolio-api" }));
app.get("/api/health", (_req, res) => res.json({ ok: true, db: isDBReady() }));
app.use("/api/contact", contactRoutes);
app.use("/api/messages", messageRoutes);

app.use((_req, res) => res.status(404).json({ error: "Route not found." }));
// Express 5 forwards rejected promises from async handlers here
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: "Something went wrong on the server. Try again shortly." });
});

connectDB(process.env.MONGODB_URI)
  .catch((err) => console.error("[db] connection failed:", err.message))
  .finally(() => app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`)));
