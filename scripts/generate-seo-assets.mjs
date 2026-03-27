import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seoPages, seoHub } from "../client/src/seoContent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = "https://pulscare.ru";
const altSiteUrl = "https://pulsezaboty.ru";
const publicDir = path.resolve(__dirname, "../client/public");

const staticRoutes = ["/", seoHub.path, "/privacy-policy", "/public-offer", "/service-rules"];
const allRoutes = [...staticRoutes, ...seoPages.map((page) => page.path)];
const generatedAt = new Date().toISOString();
const generatedDate = generatedAt.slice(0, 10);
const seoLastmodByPath = new Map(seoPages.map((page) => [page.path, `${page.addedAt}T00:00:00+03:00`]));

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toUrlsetXml(routes) {
  const urls = routes
    .map((route) => {
      const priority = route === "/" ? "1.0" : route === seoHub.path ? "0.9" : "0.7";
      const changefreq = route === "/" ? "weekly" : route === seoHub.path ? "weekly" : "monthly";
      const lastmod = seoLastmodByPath.get(route) || generatedAt;
      return `  <url>\n    <loc>${siteUrl}${escapeXml(route)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function toSitemapIndexXml() {
  const items = ["sitemap-main.xml", "sitemap-seo.xml"]
    .map(
      (name) =>
        `  <sitemap>\n    <loc>${siteUrl}/${name}</loc>\n    <lastmod>${generatedAt}</lastmod>\n  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

function toRobotsTxt() {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    "User-agent: Yandex",
    "Allow: /",
    "",
    "Host: pulscare.ru",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `Sitemap: ${altSiteUrl}/sitemap.xml`,
    ""
  ].join("\n");
}

function toLlmsTxt() {
  const header = [
    "# pulscare.ru",
    "",
    `Updated-At: ${generatedAt}`,
    "Проект: Пульс Заботы",
    "Тематика: подбор сиделок и сложный домашний уход (Москва и Санкт-Петербург)",
    "Язык: ru-RU",
    "Canonical-Host: pulscare.ru",
    "Alternate-Host: pulsezaboty.ru",
    "",
    "## Основные страницы"
  ];

  const staticLines = staticRoutes.map((route) => `- ${siteUrl}${route}`);

  const seoHeader = [
    "",
    "## SEO-страницы по диагнозам и форматам",
    `Всего SEO-страниц: ${seoPages.length}`,
    "Полный список: /llms-full.txt"
  ];
  const seoLines = seoPages.slice(0, 40).map((page) => `- ${siteUrl}${page.path} | ${page.title}`);

  return [...header, ...staticLines, ...seoHeader, ...seoLines, ""].join("\n");
}

function toLlmsFullTxt() {
  const header = [
    "# pulscare.ru llms-full",
    "",
    `Updated-At: ${generatedAt}`,
    `Total-Routes: ${allRoutes.length}`,
    `SEO-Pages: ${seoPages.length}`,
    "",
    "## Основные страницы"
  ];

  const staticLines = staticRoutes.map((route) => `- ${siteUrl}${route}`);
  const seoHeader = ["", "## SEO-страницы по диагнозам и форматам"];
  const seoLines = seoPages.map((page) => `- ${siteUrl}${page.path} | ${page.title}`);

  return [...header, ...staticLines, ...seoHeader, ...seoLines, ""].join("\n");
}

await fs.mkdir(publicDir, { recursive: true });
await fs.writeFile(path.join(publicDir, "sitemap.xml"), toSitemapIndexXml(), "utf8");
await fs.writeFile(path.join(publicDir, "sitemap-main.xml"), toUrlsetXml(staticRoutes), "utf8");
await fs.writeFile(path.join(publicDir, "sitemap-seo.xml"), toUrlsetXml(seoPages.map((page) => page.path)), "utf8");
await fs.writeFile(path.join(publicDir, "robots.txt"), toRobotsTxt(), "utf8");
await fs.writeFile(path.join(publicDir, "llms.txt"), toLlmsTxt(), "utf8");
await fs.writeFile(path.join(publicDir, "llms-full.txt"), toLlmsFullTxt(), "utf8");

console.log(`Generated SEO assets for ${allRoutes.length} routes on ${generatedDate}.`);
