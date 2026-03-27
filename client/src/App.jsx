import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { commonSeoFaq, seoHub, seoPages } from "./seoContent.js";

const SITE_URL = "https://pulscare.ru";
const MAX_WIDGET_URL = import.meta.env.VITE_MAX_WIDGET_URL || "https://max.ru";

function usePageMeta({ title, description, path, index = true, publishedAt }) {
  const location = useLocation();

  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (!description) return;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", description);
  }, [location.pathname, title, description]);

  useEffect(() => {
    const canonicalHref = `${SITE_URL}${path || location.pathname}`;
    let canonical = document.querySelector("link[rel='canonical']");

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalHref);
  }, [location.pathname, path]);

  useEffect(() => {
    const canonicalHref = `${SITE_URL}${path || location.pathname}`;

    const upsertPropertyMeta = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const upsertNameMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    upsertPropertyMeta("og:type", "website");
    upsertPropertyMeta("og:site_name", "Пульс Заботы");
    upsertPropertyMeta("og:title", title || "Пульс Заботы");
    if (description) {
      upsertPropertyMeta("og:description", description);
      upsertNameMeta("twitter:description", description);
    }
    upsertPropertyMeta("og:url", canonicalHref);
    upsertNameMeta("twitter:card", "summary_large_image");
    upsertNameMeta("twitter:title", title || "Пульс Заботы");
    upsertNameMeta("geo.region", "RU-MOW");
    upsertNameMeta("geo.placename", "Москва; Санкт-Петербург");
  }, [description, location.pathname, path, title]);

  useEffect(() => {
    let robots = document.querySelector("meta[name='robots']");
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }

    robots.setAttribute("content", index ? "index,follow,max-snippet:-1,max-image-preview:large" : "noindex,nofollow");
  }, [index, location.pathname]);

  useEffect(() => {
    if (!publishedAt) return;

    const iso = `${publishedAt}T00:00:00+03:00`;

    const upsertPropertyMeta = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const upsertNameMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    upsertPropertyMeta("article:published_time", iso);
    upsertPropertyMeta("article:modified_time", iso);
    upsertNameMeta("date", publishedAt);
  }, [location.pathname, publishedAt]);
}

function useStructuredData(id, data) {
  const location = useLocation();

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
    };
  }, [id, location.pathname, data]);
}

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

function SiteHeader({ onUrgent }) {
  return (
    <header className="container site-header">
      <Link to="/" className="brand">
        <img src="/Group 56.svg" alt="Логотип Пульс Заботы" width="223" height="69" />
      </Link>

      <nav className="nav" aria-label="Главная навигация">
        <a href="/#services">Услуги</a>
        <a href="/#about">О нас</a>
        <a href="/#safety">Безопасность</a>
        <a href="/#contacts">Контакты</a>
      </nav>

      <button className="btn btn-outline" type="button" onClick={() => onUrgent("urgent")}>
        Срочный вызов
      </button>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer" id="contacts">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/Group 318.svg" alt="Логотип Пульс Заботы" width="223" height="69" />
          <p>
            Высший стандарт патронажной помощи.
            <br />
            Создаём пространство заботы и уважения с 2015 года.
          </p>
        </div>

        <div className="footer-col footer-nav">
          <p className="footer-title">Навигация</p>
          <ul>
            <li>
              <a href="/#services">Услуги</a>
            </li>
            <li>
              <a href="/#about">О нас</a>
            </li>
            <li>
              <a href="/#contacts">Контакты</a>
            </li>
          </ul>
        </div>

        <div className="footer-col footer-legal">
          <p className="footer-title">Юридическая информация</p>
          <ul>
            <li>
              <Link to="/privacy-policy">Политика конфиденциальности</Link>
            </li>
            <li>
              <Link to="/public-offer">Договор оферты</Link>
            </li>
            <li>
              <Link to="/service-rules">Правила оказания услуг</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col footer-contact">
          <p className="footer-title">Связь</p>
          <div className="social-icons" aria-label="Мессенджеры">
            <img src="/VectorVK.svg" alt="VK" />
            <img src="/PathTG.svg" alt="Telegram" />
            <a href={MAX_WIDGET_URL} target="_blank" rel="noopener noreferrer" aria-label="MAX">
              <img src="/Max_logo.svg" alt="MAX" />
            </a>
          </div>
          <p className="support">Линия заботы</p>
          <a className="phone" href="tel:+78005553535">
            8 800 555 35 35
          </a>
        </div>
      </div>

      <p className="copyright">© 2026 Пульс Заботы. Все права защищены.</p>
    </footer>
  );
}

function MaxWidget() {
  return (
    <a
      className="max-widget"
      href={MAX_WIDGET_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="Написать в MAX"
    >
      <img src="/Max_logo.svg" alt="" aria-hidden="true" />
      <span>MAX</span>
    </a>
  );
}

function FeedbackModal({ open, mode, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", message: "", agree: true });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!open) return;
    setStatus("");
  }, [open]);

  if (!open) return null;

  const title = mode === "urgent" ? "Срочный вызов" : "Обратная связь";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.agree) {
      setStatus("Подтвердите согласие на обработку данных");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: mode })
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error || "Не удалось отправить форму");
      } else {
        setStatus("Спасибо! Мы свяжемся с вами в ближайшее время.");
        setForm({ name: "", phone: "", message: "", agree: true });
      }
    } catch {
      setStatus("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <h3>{title}</h3>
        <p className="modal-subtitle">Опишите задачу, и менеджер свяжется с вами.</p>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <label>
            Имя
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Ваше имя"
            />
          </label>

          <label>
            Телефон
            <input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              required
              placeholder="+7 (___) ___-__-__"
            />
          </label>

          <label>
            Сообщение
            <textarea
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              required
              rows={4}
              placeholder="Кратко опишите ситуацию"
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => setForm((p) => ({ ...p, agree: e.target.checked }))}
            />
            <span>
              Согласен на обработку персональных данных (
              <Link to="/privacy-policy" onClick={onClose}>
                политика
              </Link>
              )
            </span>
          </label>

          {status && <p className="form-status">{status}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Отправка..." : "Отправить"}
          </button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ onOpenFeedback }) {
  usePageMeta({
    title: "Пульс Заботы - сиделки и патронажная помощь на дому",
    description:
      "Профессиональный подбор сиделок на дому в Санкт-Петербурге и Москве: уход с проживанием, круглосуточный присмотр, помощь после инсульта и при сложных диагнозах.",
    path: "/"
  });

  return (
    <main>
      <section className="first-screen">
        <img className="hero-bg-overlay" src="/Group 302.svg" alt="" aria-hidden="true" />

        <section className="container hero" id="about">
          <div className="hero-copy">
            <h1>
              Профессиональный
              <br />
              уход за вашими
              <br />
              близкими <span>на дому</span>
            </h1>
            <p>
              Проверенные сиделки, личный менеджер и контроль
              <br />
              качества 24/7. Вернем спокойствие в вашу семью.
            </p>
            <button className="btn btn-primary" type="button" onClick={() => onOpenFeedback("match")}>
              Начать подбор
            </button>
          </div>

          <div className="hero-media">
            <img
              className="hero-image"
              src="/images/hero-home.jpg"
              alt="Руки близких людей"
              width="960"
              height="960"
              decoding="async"
              fetchPriority="high"
            />
            <img
              className="quote-bubble"
              src="/Group 304.svg"
              alt="Мы те, кто возвращает вашим близким радость каждого дня."
            />
          </div>
        </section>

        <section className="container stats" id="safety">
          <article className="pill">
            <p className="pill-meta">Работаем с 2015 года</p>
            <p className="pill-title">
              <span className="pill-line">
                Более&nbsp;<span className="pill-value">5000</span>
              </span>
              <span className="pill-line">довольных семей.</span>
            </p>
          </article>
          <article className="pill">
            <p className="pill-meta">100% проверка персонала</p>
            <p className="pill-title">
              <span className="pill-line">Отбор проходят</span>
              <span className="pill-line">
                только&nbsp;<span className="pill-value">5%</span>&nbsp;кандидатов.
              </span>
            </p>
          </article>
          <article className="pill">
            <p className="pill-meta">Личный куратор</p>
            <p className="pill-title">
              <span className="pill-line">Поддержка и</span>
              <span className="pill-line">
                контроль&nbsp;<span className="pill-value">24/7</span>.
              </span>
            </p>
          </article>
        </section>
      </section>

      <section className="container services" id="services">
        <p className="section-kicker">спектр поддержки</p>
        <h2>
          Ваш выбор в пользу
          {" "}
          <span>надёжности и опыта</span>
        </h2>

        <div className="cards-grid">
          <article className="service-card service-card-1">
            <div className="service-media">
              <img
                className="service-photo"
                src="/images/service-hourly.jpg"
                alt="Почасовой уход"
                width="288"
                height="348"
                loading="lazy"
                decoding="async"
              />
              <img className="service-decor service-decor-1" src="/Vector1.svg" alt="" aria-hidden="true" />
            </div>
            <h3>Почасовой уход</h3>
            <p>Короткие визиты, гигиена, помощь по дому и общение</p>
            <button className="price-btn" type="button">
              от 400 ₽/час <span>↗</span>
            </button>
          </article>

          <article className="service-card service-card-2">
            <div className="service-media">
              <img
                className="service-photo"
                src="/images/service-livein.jpg"
                alt="Сиделка с проживанием"
                width="288"
                height="348"
                loading="lazy"
                decoding="async"
              />
              <img className="service-decor service-decor-2" src="/Vector2.svg" alt="" aria-hidden="true" />
            </div>
            <h3>Сиделка с проживанием</h3>
            <p>Постоянное присутствие и контроль 24/7 у вас дома</p>
            <button className="price-btn" type="button">
              от 1800 ₽/сут <span>↗</span>
            </button>
          </article>

          <article className="service-card service-card-3">
            <div className="service-media">
              <img
                className="service-photo"
                src="/images/service-hospital.jpg"
                alt="Уход в больнице"
                width="288"
                height="348"
                loading="lazy"
                decoding="async"
              />
              <img className="service-decor service-decor-3" src="/Vector3.svg" alt="" aria-hidden="true" />
            </div>
            <h3>Уход в больнице</h3>
            <p>Поддержка и присмотр за близкими во время госпитализации</p>
            <button className="price-btn" type="button">
              от 1500 ₽/смена <span>↗</span>
            </button>
          </article>

          <article className="service-card service-card-4">
            <div className="service-media">
              <img
                className="service-photo"
                src="/images/service-special.jpg"
                alt="Специальный уход"
                width="288"
                height="348"
                loading="lazy"
                decoding="async"
              />
              <img className="service-decor service-decor-4" src="/Subtract4.svg" alt="" aria-hidden="true" />
            </div>
            <h3>Специальный уход</h3>
            <p>Помощь при деменции, восстановление после инсульта</p>
            <button className="price-btn" type="button">
              по запросу <span>↗</span>
            </button>
          </article>
        </div>
      </section>

      <section className="container story" id="blog">
        <article className="story-card">
          <p className="section-kicker">философия заботы</p>
          <h2>
            Профессиональный уход - это когда
            <br />
            <span>каждый человек чувствует себя достойным и ценным!</span>
          </h2>
          <Link className="story-link" to="/#about">
            Узнать нашу историю ↗
          </Link>
          <img className="story-logo" src="/Group 56.svg" alt="Пульс Заботы" />
          <img className="story-orbit" src="/Vector.svg" alt="" aria-hidden="true" />
        </article>
      </section>
    </main>
  );
}

function SeoFaq({ items }) {
  return (
    <section className="seo-faq" aria-label="Часто задаваемые вопросы">
      <h2>FAQ</h2>
      <div className="seo-faq-grid">
        {items.map((item) => (
          <article key={item.question} className="seo-faq-item">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SeoServicePage({ page, onOpenFeedback }) {
  usePageMeta({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    publishedAt: page.addedAt
  });

  const faqItems = useMemo(() => [...page.faq, ...commonSeoFaq], [page.faq]);

  const medicalLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: page.title,
      description: page.metaDescription,
      url: `${SITE_URL}${page.path}`,
      about: page.navLabel
    }),
    [page.metaDescription, page.navLabel, page.path, page.title]
  );

  const faqLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    }),
    [faqItems]
  );

  useStructuredData(`seo-medical-${page.slug}`, medicalLd);
  useStructuredData(`seo-faq-${page.slug}`, faqLd);

  return (
    <main className="seo-main">
      <section className="container seo-hero">
        <p className="legal-kicker">Экспертный уход</p>
        <h1>{page.title}</h1>
        <p className="seo-meta-line">
          Добавлено:{" "}
          <time dateTime={page.addedAt}>
            {new Date(`${page.addedAt}T00:00:00+03:00`).toLocaleDateString("ru-RU")}
          </time>
        </p>
        <p className="seo-lead">{page.lead}</p>
        <button className="btn btn-primary seo-hero-btn" type="button" onClick={() => onOpenFeedback("seo-page")}>
          Подобрать сиделку
        </button>
      </section>

      <section className="container seo-content">
        {page.sections.map((section) => (
          <article key={section.heading} className="seo-section-card">
            <h2>{section.heading}</h2>
            <ul>
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}

        <article className="seo-section-card seo-keywords">
          <h2>Низкочастотные запросы по теме</h2>
          <p>
            Ниже собраны длинные и узкие поисковые формулировки, под которые мы оптимизировали эту страницу. Они
            отражают реальные сложные кейсы семей.
          </p>
          <ul>
            {page.lowFrequencyQueries.map((query) => (
              <li key={query}>{query}</li>
            ))}
          </ul>
        </article>

        <article className="seo-section-card seo-sources">
          <h2>Научные и клинические источники</h2>
          <p>
            Мы используем проверяемые медицинские и научные публикации как основу редакционной подготовки материалов.
          </p>
          <ul>
            {page.scientificLinks.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </article>

        <SeoFaq items={faqItems} />
      </section>
    </main>
  );
}

function SeoHubPage({ onOpenFeedback }) {
  usePageMeta({
    title: "240 статей по сложному уходу - Москва, районы Москвы, СПб и районы СПб | Пульс Заботы",
    description:
      "Крупный SEO-раздел Пульс Заботы: 240 страниц по диагнозам, форматам ухода и районам Москвы/СПб, НЧ и ВЧ кластеры, FAQ и научные источники.",
    path: seoHub.path
  });

  return (
    <main className="seo-main">
      <section className="container seo-hero">
        <p className="legal-kicker">Статьи от нас</p>
        <h1>{seoHub.title}</h1>
        <p className="seo-lead">{seoHub.lead}</p>
      </section>

      <section className="container seo-content">
        <article className="seo-section-card">
          <h2>Что вы найдете в этом разделе</h2>
          <p>{seoHub.intro}</p>
        </article>

        <section className="seo-grid" aria-label="Список SEO-страниц">
          {seoPages.map((page) => (
            <article key={page.slug} className="seo-tile">
              <h3>{page.navLabel}</h3>
              <p className="seo-tile-date">
                Добавлено:{" "}
                <time dateTime={page.addedAt}>
                  {new Date(`${page.addedAt}T00:00:00+03:00`).toLocaleDateString("ru-RU")}
                </time>
              </p>
              <p>{page.lead}</p>
              <Link className="story-link" to={page.path}>
                Открыть страницу
              </Link>
            </article>
          ))}
        </section>

        <article className="seo-section-card seo-cta-box">
          <h2>Подбор под вашу ситуацию</h2>
          <p>{seoHub.ctaText}</p>
          <button className="btn btn-primary" type="button" onClick={() => onOpenFeedback("seo-hub")}>
            Оставить заявку
          </button>
        </article>

        <SeoFaq items={seoHub.faq} />
      </section>
    </main>
  );
}

function LegalPage({ title, lead, children }) {
  return (
    <main className="legal-main">
      <section className="container legal-hero">
        <p className="legal-kicker">Юридическая информация</p>
        <h1>{title}</h1>
        <p className="legal-lead">{lead}</p>
      </section>
      <section className="container legal-content">{children}</section>
    </main>
  );
}

function PrivacyPolicyPage() {
  usePageMeta({
    title: "Политика обработки персональных данных - Пульс Заботы",
    description:
      "Политика обработки персональных данных сервиса Пульс Заботы: состав данных, цели обработки и порядок удаления.",
    path: "/privacy-policy"
  });

  return (
    <LegalPage
      title="Политика обработки персональных данных"
      lead="Настоящая Политика действует в отношении всей информации, которую сервис «Пульс Заботы» получает от пользователей."
    >
      <h2>1. Общие положения</h2>
      <p>Документ составлен с учетом 152-ФЗ «О персональных данных» и иных применимых норм РФ.</p>
      <h2>2. Состав данных</h2>
      <ul>
        <li>Имя, телефон, e-mail, содержание обращения.</li>
        <li>Технические данные аналитики (IP, cookie, параметры браузера).</li>
      </ul>
      <h2>3. Срок хранения и удаление</h2>
      <p>
        Данные хранятся не дольше целей обработки. По обоснованному запросу субъекта удаление производится в срок до 3
        месяцев, если иной срок не установлен законодательством.
      </p>
    </LegalPage>
  );
}

function OfferPage() {
  usePageMeta({
    title: "Публичная оферта о подборе сиделки - Пульс Заботы",
    description: "Условия публичной оферты сервиса Пульс Заботы по подбору сиделок.",
    path: "/public-offer"
  });

  return (
    <LegalPage
      title="Публичная оферта о подборе сиделки"
      lead="Сервис оказывает информационно-организационные услуги по подбору кандидатов."
    >
      <h2>1. Предмет оферты</h2>
      <p>«Пульс Заботы» подбирает кандидатов и сопровождает коммуникацию сторон.</p>
      <h2>2. Ограничение ответственности</h2>
      <p>
        Сиделка не является сотрудником сервиса (если иное не оформлено отдельно). Ответственность по фактическому
        уходу регулируется отношениями между Заказчиком и сиделкой.
      </p>
    </LegalPage>
  );
}

function ServiceRulesPage() {
  usePageMeta({
    title: "Правила оказания услуг - Пульс Заботы",
    description: "Правила оказания услуг сервиса Пульс Заботы: обязанности сторон и порядок обслуживания.",
    path: "/service-rules"
  });

  return (
    <LegalPage
      title="Правила оказания услуг"
      lead="Порядок обслуживания, права и обязанности сторон, а также юридические границы ответственности."
    >
      <h2>1. Условия обслуживания</h2>
      <ul>
        <li>Заказчик предоставляет достоверную информацию о подопечном.</li>
        <li>Инвазивные медицинские процедуры не входят в базовый набор услуг сиделки.</li>
      </ul>
      <h2>2. Обязанности сервиса</h2>
      <p>Принять заявку, предложить кандидатов, сопровождать на этапе согласования и замены.</p>
      <h2>3. Обязанности заказчика</h2>
      <p>Заключать договор с сиделкой напрямую, проверять документы и обеспечивать безопасные условия работы.</p>
    </LegalPage>
  );
}

export default function App() {
  const [feedbackMode, setFeedbackMode] = useState(null);

  const modalOpen = useMemo(() => feedbackMode !== null, [feedbackMode]);
  const organizationLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      name: "Пульс Заботы",
      url: SITE_URL,
      telephone: "+7-800-555-35-35",
      areaServed: ["Москва", "Санкт-Петербург"],
      sameAs: [MAX_WIDGET_URL]
    }),
    []
  );
  const websiteLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Пульс Заботы",
      url: SITE_URL,
      inLanguage: "ru-RU"
    }),
    []
  );

  useStructuredData("org-ld", organizationLd);
  useStructuredData("website-ld", websiteLd);

  return (
    <div className="page-shell">
      <ScrollManager />
      <img
        className="bg-swirl"
        src="/images/6b71b9f0-77ce-4ad2-96d8-fcfeadaffa58.svg"
        alt=""
        aria-hidden="true"
      />
      <SiteHeader onUrgent={setFeedbackMode} />

      <Routes>
        <Route path="/" element={<HomePage onOpenFeedback={setFeedbackMode} />} />
        <Route path={seoHub.path} element={<SeoHubPage onOpenFeedback={setFeedbackMode} />} />
        {seoPages.map((page) => (
          <Route
            key={page.slug}
            path={page.path}
            element={<SeoServicePage page={page} onOpenFeedback={setFeedbackMode} />}
          />
        ))}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/public-offer" element={<OfferPage />} />
        <Route path="/service-rules" element={<ServiceRulesPage />} />
      </Routes>

      <MaxWidget />
      <SiteFooter />
      <FeedbackModal open={modalOpen} mode={feedbackMode} onClose={() => setFeedbackMode(null)} />
    </div>
  );
}
