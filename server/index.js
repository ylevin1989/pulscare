import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import pg from "pg";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../client/dist");
const indexHtmlPath = path.join(distPath, "index.html");
const seoMetaPath = path.join(__dirname, "seo-meta.json");
const siteUrl = "https://pulscare.ru";
let cachedIndexHtml = "";
const seoMetaJson = JSON.parse(fs.readFileSync(seoMetaPath, "utf8"));
const { Pool } = pg;

const dbUrl = process.env.PULSCARE_DB_URL || "";
const dbEnabled = Boolean(dbUrl);
const contentDb = dbEnabled
  ? new Pool({
      connectionString: dbUrl,
      ssl: process.env.PULSCARE_DB_SSL === "false" ? false : { rejectUnauthorized: false }
    })
  : null;

async function getContentDbHealth() {
  if (!contentDb) return { enabled: false, ok: false };
  try {
    await contentDb.query("select 1");
    return { enabled: true, ok: true };
  } catch (error) {
    console.error("[content-db] health error:", error.message);
    return { enabled: true, ok: false };
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const staticMeta = new Map([
  [
    "/",
    {
      title: "Пульс Заботы - сиделки и патронажная помощь на дому",
      description:
        "Профессиональный подбор сиделок на дому в Санкт-Петербурге и Москве: уход с проживанием, круглосуточный присмотр, помощь после инсульта и при сложных диагнозах.",
      index: true
    }
  ],
  [
    seoMetaJson.seoHub.path,
    {
      title: "240 статей по сложному уходу - Москва, районы Москвы, СПб и районы СПб | Пульс Заботы",
      description:
        "Крупный SEO-раздел Пульс Заботы: 240 страниц по диагнозам, форматам ухода и районам Москвы/СПб, НЧ и ВЧ кластеры, FAQ и научные источники.",
      index: true
    }
  ],
  [
    "/privacy-policy",
    {
      title: "Политика обработки персональных данных - Пульс Заботы",
      description:
        "Политика обработки персональных данных сервиса Пульс Заботы: состав данных, цели обработки и порядок удаления.",
      index: true
    }
  ],
  [
    "/public-offer",
    {
      title: "Публичная оферта о подборе сиделки - Пульс Заботы",
      description: "Условия публичной оферты сервиса Пульс Заботы по подбору сиделок.",
      index: true
    }
  ],
  [
    "/service-rules",
    {
      title: "Правила оказания услуг - Пульс Заботы",
      description: "Правила оказания услуг сервиса Пульс Заботы: обязанности сторон и порядок обслуживания.",
      index: true
    }
  ]
]);

const seoMeta = new Map(
  seoMetaJson.seoPages.map((page) => [
    page.path,
    {
      title: page.metaTitle,
      description: page.metaDescription,
      index: true,
      publishedAt: page.addedAt
    }
  ])
);

function getRouteMeta(pathname) {
  if (seoMeta.has(pathname)) return seoMeta.get(pathname);
  if (staticMeta.has(pathname)) return staticMeta.get(pathname);
  return {
    title: "Пульс Заботы",
    description:
      "Патронажная помощь и подбор сиделок в Москве и Санкт-Петербурге. Профессиональный домашний уход и поддержка семьи.",
    index: false
  };
}

function renderHtmlWithMeta(pathname) {
  if (!cachedIndexHtml) {
    cachedIndexHtml = fs.readFileSync(indexHtmlPath, "utf8");
  }
  const baseHtml = cachedIndexHtml;
  const meta = getRouteMeta(pathname);
  const canonicalHref = `${siteUrl}${pathname}`;
  const robots = meta.index ? "index,follow,max-snippet:-1,max-image-preview:large" : "noindex,nofollow";
  const publishedTime = meta.publishedAt ? `${meta.publishedAt}T00:00:00+03:00` : "";

  const titleTag = `<title>${escapeHtml(meta.title)}</title>`;
  const headSeo = [
    `<meta name="description" content="${escapeHtml(meta.description)}">`,
    `<meta name="robots" content="${robots}">`,
    `<link rel="canonical" href="${canonicalHref}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Пульс Заботы">`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}">`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}">`,
    `<meta property="og:url" content="${canonicalHref}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}">`,
    publishedTime ? `<meta property="article:published_time" content="${publishedTime}">` : "",
    publishedTime ? `<meta property="article:modified_time" content="${publishedTime}">` : ""
  ]
    .filter(Boolean)
    .join("\n    ");

  let html = baseHtml.replace(/<title>.*?<\/title>/i, titleTag);
  html = html.replace("</head>", `    ${headSeo}\n  </head>`);
  return html;
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/api/content/health", async (_req, res) => {
  const state = await getContentDbHealth();
  res.json(state);
});

app.get("/api/content/site-profile", async (_req, res) => {
  if (!contentDb) return res.status(503).json({ ok: false, error: "content_db_disabled" });
  try {
    const { rows } = await contentDb.query(
      `select site_name, site_url, support_phone, support_label, max_widget_url, footer_blurb, home_content, legal_content, updated_at
       from pc_site_profile where id = 1`
    );
    if (!rows[0]) return res.status(404).json({ ok: false, error: "site_profile_not_found" });
    res.json({ ok: true, data: rows[0] });
  } catch (error) {
    console.error("[content-db] site-profile error:", error.message);
    res.status(500).json({ ok: false, error: "site_profile_query_failed" });
  }
});

app.get("/api/content/seo-hub", async (_req, res) => {
  if (!contentDb) return res.status(503).json({ ok: false, error: "content_db_disabled" });
  try {
    const hubRes = await contentDb.query(
      "select path, title, lead, intro, cta_text, faq, updated_at from pc_seo_hub where id = 1"
    );
    if (!hubRes.rows[0]) return res.status(404).json({ ok: false, error: "seo_hub_not_found" });

    const pagesRes = await contentDb.query(
      `select slug, path, nav_label, title, meta_title, meta_description, added_at, lead
       from pc_seo_pages
       order by id`
    );
    const faqRes = await contentDb.query(
      "select question, answer from pc_seo_common_faq order by sort_order asc, id asc"
    );

    const hub = {
      path: hubRes.rows[0].path,
      title: hubRes.rows[0].title,
      lead: hubRes.rows[0].lead,
      intro: hubRes.rows[0].intro,
      ctaText: hubRes.rows[0].cta_text,
      faq: hubRes.rows[0].faq || []
    };

    const pages = pagesRes.rows.map((row) => ({
      slug: row.slug,
      path: row.path,
      navLabel: row.nav_label,
      title: row.title,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      addedAt: row.added_at,
      lead: row.lead
    }));

    const commonFaq = faqRes.rows.map((row) => ({ question: row.question, answer: row.answer }));
    res.json({ ok: true, data: { seoHub: hub, seoPages: pages, commonSeoFaq: commonFaq } });
  } catch (error) {
    console.error("[content-db] seo-hub error:", error.message);
    res.status(500).json({ ok: false, error: "seo_hub_query_failed" });
  }
});

app.get("/api/content/seo-page/:slug", async (req, res) => {
  if (!contentDb) return res.status(503).json({ ok: false, error: "content_db_disabled" });
  try {
    const { slug } = req.params;
    const pageRes = await contentDb.query(
      `select slug, path, nav_label, title, meta_title, meta_description, added_at, lead,
              sections, low_frequency_queries, faq, scientific_links
       from pc_seo_pages
       where slug = $1
       limit 1`,
      [slug]
    );
    if (!pageRes.rows[0]) return res.status(404).json({ ok: false, error: "seo_page_not_found" });

    const faqRes = await contentDb.query(
      "select question, answer from pc_seo_common_faq order by sort_order asc, id asc"
    );
    const row = pageRes.rows[0];
    const page = {
      slug: row.slug,
      path: row.path,
      navLabel: row.nav_label,
      title: row.title,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      addedAt: row.added_at,
      lead: row.lead,
      sections: row.sections || [],
      lowFrequencyQueries: row.low_frequency_queries || [],
      faq: row.faq || [],
      scientificLinks: row.scientific_links || []
    };

    const commonFaq = faqRes.rows.map((item) => ({ question: item.question, answer: item.answer }));
    res.json({ ok: true, data: { page, commonSeoFaq: commonFaq } });
  } catch (error) {
    console.error("[content-db] seo-page error:", error.message);
    res.status(500).json({ ok: false, error: "seo_page_query_failed" });
  }
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

app.get(["/index.html", "/index.htm"], (_req, res) => {
  res.redirect(301, "/");
});

app.get("/expert-care", (_req, res) => {
  res.redirect(301, "/articles");
});

app.use(
  express.static(distPath, {
    index: false,
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
  const routeMeta = getRouteMeta(_req.path);
  const html = renderHtmlWithMeta(_req.path);
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.status(routeMeta.index ? 200 : 404).send(html);
});

app.listen(PORT, () => {
  console.log(`Pulscare server is running on http://localhost:${PORT}`);
});
