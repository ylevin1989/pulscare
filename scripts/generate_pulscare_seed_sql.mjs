import fs from "node:fs/promises";
import path from "node:path";
import { seoHub, seoPages, commonSeoFaq } from "../client/src/seoContent.js";

const outPath = path.resolve(process.cwd(), "db/seed_pulscare_content.sql");

const homeContent = {
  hero: {
    title_lines: ["Профессиональный", "уход за вашими", "близкими на дому"],
    lead: "Проверенные сиделки, личный менеджер и контроль качества 24/7. Вернем спокойствие в вашу семью.",
    cta: "Начать подбор"
  },
  safety_cards: [
    { meta: "Работаем с 2022 года", lines: ["Более 5000", "довольных семей."] },
    { meta: "100% проверка персонала", lines: ["Отбор проходят", "только 5% кандидатов."] },
    { meta: "Личный куратор", lines: ["Поддержка и", "контроль 24/7."] }
  ],
  about: {
    kicker: "о нас",
    title: "«Пульс Заботы» - это команда, которая превращает уход в понятную и надежную систему"
  },
  services: {
    kicker: "спектр поддержки",
    title: "Ваш выбор в пользу надёжности и опыта"
  }
};

const legalContent = {
  pages: [
    {
      slug: "privacy-policy",
      title: "Политика обработки персональных данных",
      lead: "Как мы собираем, используем и защищаем персональные данные пользователей сервиса.",
      note: "Актуально на 2026-03-28"
    },
    {
      slug: "public-offer",
      title: "Публичная оферта",
      lead: "Условия предоставления услуг по подбору сиделок.",
      note: "Актуально на 2026-03-28"
    },
    {
      slug: "service-rules",
      title: "Правила оказания услуг",
      lead: "Порядок работы сервиса, права и обязанности сторон.",
      note: "Актуально на 2026-03-28"
    }
  ]
};

function q(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function qj(value) {
  return `${q(JSON.stringify(value))}::jsonb`;
}

const lines = [];
lines.push("BEGIN;");

lines.push(`
INSERT INTO pc_site_profile (id, site_name, site_url, support_phone, support_label, max_widget_url, footer_blurb, home_content, legal_content, updated_at)
VALUES (1, ${q("Пульс Заботы")}, ${q("https://pulscare.ru")}, ${q("+78005553535")}, ${q("Линия заботы")}, ${q("https://max.ru/u/f9LHodD0cOK9bS67jG-4VDuTSVNFBV-fV0bniFl5mVY8LWf-hhPpnmp4kV4")}, ${q("Высший стандарт патронажной помощи. Создаём пространство заботы и уважения с 2022 года.")}, ${qj(homeContent)}, ${qj(legalContent)}, now())
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  site_url = EXCLUDED.site_url,
  support_phone = EXCLUDED.support_phone,
  support_label = EXCLUDED.support_label,
  max_widget_url = EXCLUDED.max_widget_url,
  footer_blurb = EXCLUDED.footer_blurb,
  home_content = EXCLUDED.home_content,
  legal_content = EXCLUDED.legal_content,
  updated_at = now();
`);

lines.push(`
INSERT INTO pc_seo_hub (id, path, title, lead, intro, cta_text, faq, updated_at)
VALUES (1, ${q(seoHub.path)}, ${q(seoHub.title)}, ${q(seoHub.lead)}, ${q(seoHub.intro)}, ${q(seoHub.ctaText)}, ${qj(seoHub.faq)}, now())
ON CONFLICT (id) DO UPDATE SET
  path = EXCLUDED.path,
  title = EXCLUDED.title,
  lead = EXCLUDED.lead,
  intro = EXCLUDED.intro,
  cta_text = EXCLUDED.cta_text,
  faq = EXCLUDED.faq,
  updated_at = now();
`);

lines.push("TRUNCATE TABLE pc_seo_common_faq RESTART IDENTITY;");
commonSeoFaq.forEach((item, index) => {
  lines.push(
    `INSERT INTO pc_seo_common_faq (sort_order, question, answer, updated_at) VALUES (${index + 1}, ${q(item.question)}, ${q(item.answer)}, now());`
  );
});

lines.push("TRUNCATE TABLE pc_seo_pages RESTART IDENTITY;");
seoPages.forEach((page) => {
  lines.push(`
INSERT INTO pc_seo_pages (
  slug, path, nav_label, title, meta_title, meta_description, added_at, lead,
  sections, low_frequency_queries, faq, scientific_links, updated_at
) VALUES (
  ${q(page.slug)}, ${q(page.path)}, ${q(page.navLabel)}, ${q(page.title)}, ${q(page.metaTitle)}, ${q(page.metaDescription)}, ${q(page.addedAt)}, ${q(page.lead)},
  ${qj(page.sections)}, ${qj(page.lowFrequencyQueries)}, ${qj(page.faq)}, ${qj(page.scientificLinks)}, now()
);
`);
});

lines.push("COMMIT;");

await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, lines.join("\n"), "utf8");
console.log(`Generated ${outPath} with ${seoPages.length} SEO pages.`);
