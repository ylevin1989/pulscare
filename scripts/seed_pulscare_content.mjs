import pg from "pg";
import { seoHub, seoPages, commonSeoFaq } from "../client/src/seoContent.js";

const { Pool } = pg;

const databaseUrl = process.env.PULSCARE_DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing PULSCARE_DATABASE_URL");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl, ssl: process.env.PULSCARE_DB_SSL === "false" ? false : { rejectUnauthorized: false } });

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

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `
      INSERT INTO pc_site_profile (id, site_name, site_url, support_phone, support_label, max_widget_url, footer_blurb, home_content, legal_content, updated_at)
      VALUES (1, $1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, now())
      ON CONFLICT (id) DO UPDATE
      SET site_name = EXCLUDED.site_name,
          site_url = EXCLUDED.site_url,
          support_phone = EXCLUDED.support_phone,
          support_label = EXCLUDED.support_label,
          max_widget_url = EXCLUDED.max_widget_url,
          footer_blurb = EXCLUDED.footer_blurb,
          home_content = EXCLUDED.home_content,
          legal_content = EXCLUDED.legal_content,
          updated_at = now();
      `,
      [
        "Пульс Заботы",
        "https://pulscare.ru",
        "+79119104012",
        "Линия заботы",
        "https://max.ru/u/f9LHodD0cOK9bS67jG-4VDuTSVNFBV-fV0bniFl5mVY8LWf-hhPpnmp4kV4",
        "Высший стандарт патронажной помощи. Создаём пространство заботы и уважения с 2022 года.",
        JSON.stringify(homeContent),
        JSON.stringify(legalContent)
      ]
    );

    await client.query(
      `
      INSERT INTO pc_seo_hub (id, path, title, lead, intro, cta_text, faq, updated_at)
      VALUES (1, $1, $2, $3, $4, $5, $6::jsonb, now())
      ON CONFLICT (id) DO UPDATE
      SET path = EXCLUDED.path,
          title = EXCLUDED.title,
          lead = EXCLUDED.lead,
          intro = EXCLUDED.intro,
          cta_text = EXCLUDED.cta_text,
          faq = EXCLUDED.faq,
          updated_at = now();
      `,
      [seoHub.path, seoHub.title, seoHub.lead, seoHub.intro, seoHub.ctaText, JSON.stringify(seoHub.faq)]
    );

    await client.query("TRUNCATE TABLE pc_seo_common_faq RESTART IDENTITY");
    for (let i = 0; i < commonSeoFaq.length; i += 1) {
      const item = commonSeoFaq[i];
      await client.query(
        `INSERT INTO pc_seo_common_faq (sort_order, question, answer, updated_at) VALUES ($1,$2,$3,now())`,
        [i + 1, item.question, item.answer]
      );
    }

    await client.query("TRUNCATE TABLE pc_seo_pages RESTART IDENTITY");
    for (const page of seoPages) {
      await client.query(
        `
        INSERT INTO pc_seo_pages (
          slug, path, nav_label, title, meta_title, meta_description, added_at, lead,
          sections, low_frequency_queries, faq, scientific_links, updated_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12::jsonb,now()
        )
        `,
        [
          page.slug,
          page.path,
          page.navLabel,
          page.title,
          page.metaTitle,
          page.metaDescription,
          page.addedAt,
          page.lead,
          JSON.stringify(page.sections),
          JSON.stringify(page.lowFrequencyQueries),
          JSON.stringify(page.faq),
          JSON.stringify(page.scientificLinks)
        ]
      );
    }

    await client.query("COMMIT");
    const countRes = await client.query("SELECT count(*)::int AS cnt FROM pc_seo_pages");
    console.log(`Seed done. SEO pages: ${countRes.rows[0].cnt}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
