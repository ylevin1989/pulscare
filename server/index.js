import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../client/dist");

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.post("/api/feedback", (req, res) => {
  const { name, phone, message, source } = req.body || {};

  if (!name || !phone || !message) {
    return res.status(400).json({ ok: false, error: "Заполните имя, телефон и сообщение" });
  }

  // TODO: подключить отправку в CRM / Telegram / email.
  console.log("[feedback]", {
    name,
    phone,
    message,
    source: source || "site-modal",
    createdAt: new Date().toISOString()
  });

  return res.json({ ok: true, message: "Спасибо! Заявка отправлена." });
});

app.use(
  express.static(distPath, {
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        return;
      }

      if (/\/assets\/.+-[A-Za-z0-9_-]+\.(js|css)$/.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return;
      }

      if (/\.(svg|png|jpe?g|webp|gif|ico)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=2592000");
      }
    }
  })
);

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Pulscare server is running on http://localhost:${PORT}`);
});
