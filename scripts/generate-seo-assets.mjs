import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seoPages, seoHub } from "../client/src/seoContent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = "https://pulscare.ru";
const publicDir = path.resolve(__dirname, "../client/public");

const staticRoutes = ["/", seoHub.path, "/privacy-policy", "/public-offer", "/service-rules"];
const allRoutes = [...staticRoutes, ...seoPages.map((page) => page.path)];
const now = new Date().toISOString().slice(0, 10);

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toSitemapXml() {
  const urls = allRoutes
    .map((route) => {
      const priority = route === "/" ? "1.0" : route === seoHub.path ? "0.9" : "0.7";
      const changefreq = route === "/" ? "weekly" : "monthly";
      return `  <url>\n    <loc>${siteUrl}${escapeXml(route)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function toRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nHost: ${siteUrl}\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

function toLlmsTxt() {
  const header = [
    "# pulscare.ru",
    "",
    "Проект: Пульс Заботы",
    "Тематика: подбор сиделок и сложный домашний уход (Москва и Санкт-Петербург)",
    "",
    "## Основные страницы"
  ];

  const staticLines = staticRoutes.map((route) => `- ${siteUrl}${route}`);

  const seoHeader = ["", "## SEO-страницы по диагнозам и форматам"]; 
  const seoLines = seoPages.map((page) => `- ${siteUrl}${page.path} | ${page.title}`);

  return [...header, ...staticLines, ...seoHeader, ...seoLines, ""].join("\n");
}

await fs.mkdir(publicDir, { recursive: true });
await fs.writeFile(path.join(publicDir, "sitemap.xml"), toSitemapXml(), "utf8");
await fs.writeFile(path.join(publicDir, "robots.txt"), toRobotsTxt(), "utf8");
await fs.writeFile(path.join(publicDir, "llms.txt"), toLlmsTxt(), "utf8");

console.log(`Generated SEO assets for ${allRoutes.length} routes.`);
