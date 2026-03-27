import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { commonSeoFaq, seoHub, seoPages } from "./seoContent.js";

const SITE_URL = "https://pulscare.ru";
const MAX_WIDGET_URL =
  import.meta.env.VITE_MAX_WIDGET_URL || "https://max.ru/u/f9LHodD0cOK9bS67jG-4VDuTSVNFBV-fV0bniFl5mVY8LWf-hhPpnmp4kV4";

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
            Создаём пространство заботы и уважения с 2022 года.
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
  const [isPulsing, setIsPulsing] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef = useRef(true);
  const rafId = useRef(null);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(() => {
        rafId.current = null;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const nextVisible = !(scrollTop > lastScrollTopRef.current && scrollTop > 100);
        if (nextVisible !== isVisibleRef.current) {
          isVisibleRef.current = nextVisible;
          setIsVisible(nextVisible);
        }
        lastScrollTopRef.current = scrollTop;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, []);

  const handleClick = () => {
    setIsPulsing(false);
    window.setTimeout(() => {
      setIsPulsing(true);
    }, 30000);
  };

  return (
    <a
      className={`max-widget ${isPulsing ? "max-pulse" : ""} ${isVisible ? "visible" : "hidden"}`}
      href={MAX_WIDGET_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="Написать в MAX"
      id="maxMessengerIcon"
      onClick={handleClick}
    >
      <img src="/Max_logo.svg" alt="" aria-hidden="true" />
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

        <section className="container hero">
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
            <picture className="hero-picture">
              <source
                type="image/avif"
                srcSet="/images/hero-home-480.avif 480w, /images/hero-home-640.avif 640w, /images/hero-home-960.avif 960w"
                sizes="(max-width: 1280px) min(100vw - 32px, 460px), 430px"
              />
              <source
                type="image/webp"
                srcSet="/images/hero-home-480.webp 480w, /images/hero-home-640.webp 640w, /images/hero-home-960.webp 960w"
                sizes="(max-width: 1280px) min(100vw - 32px, 460px), 430px"
              />
              <img
                className="hero-image"
                src="/images/hero-home-640.jpg"
                srcSet="/images/hero-home-480.jpg 480w, /images/hero-home-640.jpg 640w, /images/hero-home-960.jpg 960w"
                sizes="(max-width: 1280px) min(100vw - 32px, 460px), 430px"
                alt="Руки близких людей"
                width="960"
                height="960"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
              />
            </picture>
          </div>
        </section>

        <section className="container stats" id="safety">
          <article className="pill">
            <p className="pill-meta">Работаем с 2022 года</p>
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

      <section className="container about-section" id="about">
        <p className="section-kicker">о нас</p>
        <h2>
          «Пульс Заботы» - это команда, которая
          <span> превращает уход в понятную и надежную систему</span>
        </h2>

        <div className="about-grid">
          <article className="about-card about-card-history">
            <div className="about-media">
              <img
                src="/images/service-hourly.jpg"
                alt="Тёплая домашняя обстановка"
                width="288"
                height="348"
                loading="lazy"
                decoding="async"
              />
            </div>
            <h3>Наша история</h3>
            <p>
              «Пульс Заботы» работает с 2022 года. Мы начинали как небольшая команда координаторов, которые хотели
              решить простую, но острую задачу: чтобы семья получала помощь быстро, без лишней бюрократии и тревоги.
              Сегодня мы сопровождаем заявки в Москве и Санкт-Петербурге, сохраняя тот же принцип - быть рядом именно
              тогда, когда поддержка нужна больше всего.
            </p>
            <p>
              За эти годы мы отточили процесс подбора: от первого разговора и уточнения медицинских задач до выхода
              специалиста и дальнейшего контроля качества. Нам важно не просто «закрыть заявку», а выстроить
              устойчивый, человеческий маршрут ухода.
            </p>
          </article>

          <article className="about-card about-card-process">
            <div className="about-media">
              <img
                src="/images/service-hospital.jpg"
                alt="Профессиональный уход в стационаре"
                width="288"
                height="348"
                loading="lazy"
                decoding="async"
              />
            </div>
            <h3>Как мы работаем</h3>
            <p>
              Мы подбираем сиделок с проживанием и патронажных медсестер для людей, которым требуется особая забота:
              после операций, при хронических состояниях, возрастных изменениях и сложной реабилитации. Формат
              выбирается под ваш ритм: на дому, в стационаре, по графику визитов или с постоянным сопровождением.
            </p>
            <p>
              Каждую заявку курирует координатор, который помогает семье на всех этапах. Такой подход снижает
              организационную нагрузку и возвращает главное - спокойствие за близкого человека.
            </p>
          </article>

          <article className="about-card about-card-facts">
            <div className="about-media">
              <img
                src="/images/service-special.jpg"
                alt="Индивидуальный подход и развитие навыков"
                width="288"
                height="348"
                loading="lazy"
                decoding="async"
              />
            </div>
            <h3>Факты о «Пульсе Заботы»</h3>
            <ul>
              <li>В большинстве случаев начинаем подбор в день обращения.</li>
              <li>Работаем с гибкими форматами ухода: от почасового до 24/7 с проживанием.</li>
              <li>Сопровождаем семью после старта ухода и помогаем корректировать формат при изменении состояния.</li>
              <li>Делаем акцент не только на навыках, но и на бережной коммуникации с подопечным.</li>
            </ul>
            <p>
              Для нас профессиональный уход - это когда у семьи есть время на жизнь, а у подопечного есть достойная,
              тёплая и регулярная поддержка каждый день.
            </p>
          </article>
        </div>
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

function LegalPage({ title, lead, note, children }) {
  return (
    <main className="legal-main">
      <section className="container legal-hero">
        <p className="legal-kicker">Юридическая информация</p>
        <h1>{title}</h1>
        <p className="legal-lead">{lead}</p>
        {note ? <p className="legal-note">{note}</p> : null}
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
      lead="Настоящая Политика действует в отношении всей информации, которую сервис «Пульс Заботы» может получить о пользователе при подборе сиделки, консультации, использовании сайта и иных каналов связи."
      note="Документ составлен с учетом требований Федерального закона №152-ФЗ «О персональных данных», №149-ФЗ «Об информации, информационных технологиях и о защите информации», а также иных применимых норм РФ."
    >
      <h2>1. Оператор персональных данных</h2>
      <p>
        Оператор: <strong>[укажите полное наименование юридического лица / ИП]</strong>.
        <br />
        Адрес: <strong>[юридический адрес]</strong>.
        <br />
        E-mail для обращений по ПДн: <strong>[email]</strong>.
        <br />
        Телефон: <strong>[телефон]</strong>.
      </p>

      <h2>2. Категории персональных данных</h2>
      <p>Оператор может обрабатывать следующие данные пользователей:</p>
      <ul>
        <li>ФИО, номер телефона, адрес электронной почты.</li>
        <li>Регион/адрес оказания услуги, предпочтения по подбору сиделки, сведения о графике.</li>
        <li>Информация из обращений в мессенджерах, по телефону, по e-mail и через формы сайта.</li>
        <li>Технические данные: IP-адрес, cookie, сведения о браузере и устройстве, данные веб-аналитики.</li>
      </ul>

      <h2>3. Цели обработки персональных данных</h2>
      <ul>
        <li>Обработка входящих обращений и обратная связь с пользователем.</li>
        <li>Подбор подходящих кандидатов-сиделок по запросу пользователя.</li>
        <li>Сопровождение пользователя в процессе согласования условий с кандидатом.</li>
        <li>Исполнение требований законодательства РФ и ведение внутренней отчетности.</li>
        <li>Повышение качества работы сайта и сервиса.</li>
      </ul>

      <h2>4. Правовые основания обработки</h2>
      <ul>
        <li>Согласие субъекта персональных данных.</li>
        <li>Необходимость исполнения договора/действий по запросу пользователя до заключения договора.</li>
        <li>Исполнение обязанностей, возложенных законодательством РФ.</li>
      </ul>

      <h2>5. Порядок и условия обработки</h2>
      <ul>
        <li>Обработка осуществляется законно, добросовестно и пропорционально заявленным целям.</li>
        <li>Используются как автоматизированные, так и неавтоматизированные способы обработки.</li>
        <li>Оператор принимает необходимые правовые, организационные и технические меры защиты ПДн.</li>
        <li>
          Передача данных третьим лицам допускается только при наличии правового основания, в том числе для
          обеспечения подбора кандидатов по запросу пользователя.
        </li>
      </ul>

      <h2>6. Сроки хранения и удаление данных</h2>
      <p>
        Персональные данные хранятся не дольше, чем этого требуют цели обработки и требования законодательства. При
        достижении целей обработки либо при отзыве согласия (если нет иных законных оснований обработки) данные
        подлежат удалению или обезличиванию.
      </p>
      <p>
        <strong>
          Срок удаления персональных данных по обращению субъекта — не позднее 3 (трех) месяцев с даты получения
          обоснованного запроса, если более короткий срок не предусмотрен законом.
        </strong>
      </p>

      <h2>7. Права субъекта персональных данных</h2>
      <ul>
        <li>Получать сведения об обработке своих персональных данных.</li>
        <li>Требовать уточнения, блокирования или удаления недостоверных/избыточных данных.</li>
        <li>Отозвать согласие на обработку персональных данных.</li>
        <li>Обжаловать действия Оператора в уполномоченный орган (Роскомнадзор) или в суд.</li>
      </ul>

      <h2>8. Порядок направления обращений</h2>
      <p>
        Запросы по вопросам обработки персональных данных направляются на адрес: <strong>[email]</strong>. В запросе
        рекомендуется указать ФИО, контакты для ответа, суть обращения и сведения, подтверждающие связь с сервисом.
      </p>

      <h2>9. Использование cookie</h2>
      <p>
        Сайт может использовать cookie и иные технологии аналитики для корректной работы и улучшения сервиса.
        Пользователь может изменить настройки cookie в браузере.
      </p>

      <h2>10. Заключительные положения</h2>
      <p>
        Оператор вправе вносить изменения в настоящую Политику. Актуальная версия всегда размещается на сайте.
        Продолжение использования сервиса после публикации новой редакции означает согласие пользователя с
        соответствующими изменениями.
      </p>

      <div className="legal-signoff">
        <p>
          <strong>Дата публикации:</strong> 27 марта 2026 года
        </p>
        <p>
          <strong>Версия документа:</strong> 1.0
        </p>
      </div>
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
      lead="Настоящий документ является предложением заключить договор оказания информационно-консультационных услуг по подбору кандидата-сиделки. Документ определяет права, обязанности и границы ответственности сторон."
      note="Важно: Сервис «Пульс Заботы» оказывает услугу подбора и сопровождения коммуникации, но не является стороной фактических трудовых/гражданско-правовых отношений между заказчиком и сиделкой."
    >
      <h2>1. Термины и определения</h2>
      <ul>
        <li>
          <strong>Сервис / Исполнитель</strong> — «Пульс Заботы», осуществляющий подбор кандидатов.
        </li>
        <li>
          <strong>Заказчик</strong> — физическое или юридическое лицо, обратившееся за подбором сиделки.
        </li>
        <li>
          <strong>Кандидат / Сиделка</strong> — третье лицо, информация о котором передается Заказчику.
        </li>
        <li>
          <strong>Услуга</strong> — поиск и предоставление релевантных кандидатур, информационное сопровождение.
        </li>
      </ul>

      <h2>2. Предмет оферты</h2>
      <p>
        Исполнитель обязуется оказать Заказчику услуги по подбору сиделки на основании запроса Заказчика, а Заказчик
        обязуется принять и оплатить такие услуги в порядке, предусмотренном офертой.
      </p>
      <p>
        Исполнитель не оказывает медицинских услуг, не осуществляет уход лично, не управляет действиями сиделки в
        процессе ее работы у Заказчика и не является работодателем сиделки.
      </p>

      <h2>3. Порядок заключения договора (акцепт)</h2>
      <p>
        Акцептом оферты признается совершение Заказчиком действий, подтверждающих согласие с условиями оферты,
        включая: отправку заявки на подбор, подтверждение в мессенджере/по телефону, оплату услуг, либо иные
        действия, явно свидетельствующие о намерении получить услугу.
      </p>

      <h2>4. Права и обязанности Исполнителя</h2>
      <ul>
        <li>Принимать и обрабатывать запрос Заказчика на подбор кандидата.</li>
        <li>Предоставлять информацию о кандидатах в объеме, доступном Исполнителю.</li>
        <li>Сопровождать коммуникацию сторон на этапе первичного подбора.</li>
        <li>Отказывать в обслуживании при злоупотреблениях, нарушениях закона или условий оферты.</li>
      </ul>

      <h2>5. Права и обязанности Заказчика</h2>
      <ul>
        <li>Предоставлять достоверные сведения, необходимые для корректного подбора.</li>
        <li>Самостоятельно проверять документы, квалификацию и репутацию выбранной сиделки.</li>
        <li>Самостоятельно заключать договор с сиделкой на выбранных условиях.</li>
        <li>Соблюдать применимое законодательство при взаимодействии с сиделкой.</li>
      </ul>

      <h2>6. Статус сиделки и разграничение ответственности</h2>
      <p>
        Сиделка является самостоятельным третьим лицом и <strong>не состоит в трудовых отношениях</strong> с
        Исполнителем, если иное прямо не оформлено отдельным письменным договором.
      </p>
      <p>
        Исполнитель <strong>не несет ответственность</strong> за действия, бездействие, квалификацию, здоровье,
        поведение, причинение убытков, вреда имуществу или здоровью, моральный вред и иные последствия, возникшие в
        отношениях между Заказчиком и сиделкой после их контакта/заключения договора.
      </p>
      <p>
        Все решения о найме, допуске к уходу, режиме работы и условиях взаимодействия с сиделкой Заказчик принимает
        самостоятельно и на свой риск.
      </p>

      <h2>7. Ограничение ответственности Исполнителя</h2>
      <ul>
        <li>Исполнитель не гарантирует трудоустройство конкретной сиделки у конкретного Заказчика.</li>
        <li>Исполнитель не гарантирует достижение медицинского, бытового или иного результата ухода.</li>
        <li>
          Совокупная ответственность Исполнителя по требованиям Заказчика ограничивается размером фактически
          оплаченных Заказчиком услуг по подбору за соответствующий период.
        </li>
        <li>
          Исполнитель не отвечает за перерывы в связи, сбои мессенджеров/операторов/хостинга, действия третьих лиц и
          иные обстоятельства вне разумного контроля Исполнителя.
        </li>
      </ul>

      <h2>8. Стоимость и порядок расчетов</h2>
      <p>
        Стоимость услуг определяется по тарифам Исполнителя, действующим на дату обращения. Конкретная стоимость,
        формат и сроки оказания услуги согласуются с Заказчиком индивидуально.
      </p>

      <h2>9. Возвраты и отказ от услуги</h2>
      <p>
        Возвраты рассматриваются в индивидуальном порядке с учетом объема фактически оказанных услуг на момент
        обращения. При полном или частичном оказании услуги сумма возврата может быть уменьшена пропорционально объему
        выполненных действий.
      </p>

      <h2>10. Персональные данные и конфиденциальность</h2>
      <p>
        Обработка персональных данных осуществляется в соответствии с <Link to="/privacy-policy">Политикой конфиденциальности</Link>. Акцепт оферты подтверждает ознакомление с указанной Политикой.
      </p>

      <h2>11. Порядок урегулирования споров</h2>
      <p>
        Споры и разногласия разрешаются путем переговоров и претензионного порядка. Срок ответа на претензию — до 30
        календарных дней с момента ее получения. При недостижении соглашения спор подлежит рассмотрению в суде по
        месту нахождения Исполнителя, если иное не предусмотрено законодательством РФ.
      </p>

      <h2>12. Форс-мажор</h2>
      <p>
        Стороны освобождаются от ответственности за неисполнение обязательств вследствие обстоятельств непреодолимой
        силы, подтвержденных компетентными органами.
      </p>

      <h2>13. Реквизиты Исполнителя</h2>
      <p>
        Наименование: <strong>[укажите]</strong>
        <br />
        ИНН/ОГРН: <strong>[укажите]</strong>
        <br />
        Адрес: <strong>[укажите]</strong>
        <br />
        E-mail: <strong>[укажите]</strong>
        <br />
        Телефон: <strong>[укажите]</strong>
      </p>

      <div className="legal-signoff">
        <p>
          <strong>Дата публикации:</strong> 27 марта 2026 года
        </p>
        <p>
          <strong>Версия документа:</strong> 1.0
        </p>
      </div>
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
      lead="Настоящие Правила регулируют порядок подбора и сопровождения подопечных сервисом «Пульс Заботы», права и обязанности сторон, а также границы ответственности."
      note="«Пульс Заботы» оказывает организационно-информационные услуги по подбору кандидатов. Сиделка не является сотрудником сервиса, если это отдельно не оформлено письменным трудовым договором."
    >
      <h2>Содержание</h2>
      <ul>
        <li>
          <a href="#terms">1. Термины и участники</a>
        </li>
        <li>
          <a href="#service-conditions">2. Условия обслуживания</a>
        </li>
        <li>
          <a href="#company-duties">3. Обязанности сервиса</a>
        </li>
        <li>
          <a href="#client-duties">4. Обязанности заказчика</a>
        </li>
        <li>
          <a href="#caregiver-status">5. Статус и требования к сиделке</a>
        </li>
        <li>
          <a href="#caregiver-duties">6. Обязанности сиделки</a>
        </li>
        <li>
          <a href="#payments">7. Порядок расчетов</a>
        </li>
        <li>
          <a href="#liability">8. Гарантии и ответственность сторон</a>
        </li>
        <li>
          <a href="#personal-data">9. Персональные данные</a>
        </li>
        <li>
          <a href="#final">10. Заключительные положения</a>
        </li>
      </ul>

      <h2 id="terms">1. Термины и участники</h2>
      <p>
        <strong>Сервис / Исполнитель</strong> — «Пульс Заботы», осуществляющий подбор кандидатов и сопровождение
        взаимодействия сторон.
      </p>
      <p>
        <strong>Заказчик</strong> — лицо, заказывающее услуги подбора сиделки и/или помощи по дому.
      </p>
      <p>
        <strong>Подопечный</strong> — лицо, в отношении которого планируется уход или бытовая помощь.
      </p>
      <p>
        <strong>Сиделка / Исполнитель ухода</strong> — самостоятельное третье лицо (самозанятый, ИП или физлицо),
        которое оказывает услуги Заказчику напрямую.
      </p>

      <h2 id="service-conditions">2. Условия обслуживания</h2>
      <ul>
        <li>Услуги оказываются на основании заявки Заказчика и согласованных параметров ухода.</li>
        <li>Заказчик обязан предоставить достоверную информацию о состоянии подопечного и условиях проживания.</li>
        <li>
          Заказчик обеспечивает необходимые расходные материалы для ухода (гигиена, перевязочные материалы, бытовые
          средства), если иное не согласовано отдельно.
        </li>
        <li>
          Инвазивные медицинские манипуляции (инъекции, капельницы, катетеры и иные процедуры, требующие медицинской
          лицензии) не входят в базовый перечень услуг сиделки.
        </li>
        <li>В помещении оказания услуг рекомендуется исключить свободный доступ к деньгам, ценностям и документам.</li>
      </ul>

      <h2 id="company-duties">3. Обязанности сервиса</h2>
      <ul>
        <li>Принять заявку, уточнить запрос и подобрать релевантных кандидатов.</li>
        <li>Организовать первичную коммуникацию Заказчика с кандидатами.</li>
        <li>Сопровождать заказ на старте и при необходимости предлагать замену кандидата.</li>
        <li>Вести учет коммуникаций и истории заказа в пределах внутренних процедур сервиса.</li>
      </ul>

      <h2 id="client-duties">4. Обязанности заказчика</h2>
      <ul>
        <li>Предоставлять правдивые сведения и своевременно сообщать об изменениях по заказу.</li>
        <li>Самостоятельно проверять документы, опыт и личность выбранной сиделки.</li>
        <li>Заключать договор с сиделкой напрямую и осуществлять расчеты в согласованном порядке.</li>
        <li>Обеспечивать безопасные и корректные условия оказания услуг на месте работы.</li>
      </ul>

      <h2 id="caregiver-status">5. Статус и требования к сиделке</h2>
      <p>
        Сиделка является независимым исполнителем и не состоит в трудовых отношениях с «Пульс Заботы», если иное
        прямо не оформлено письменным договором.
      </p>
      <ul>
        <li>Сиделка вправе принять или отклонить предложенный заказ.</li>
        <li>Сиделка обязуется соблюдать нормы этики, конфиденциальности и безопасности подопечного.</li>
        <li>Сиделка не вправе передавать третьим лицам сведения о семье подопечного и его состоянии.</li>
      </ul>

      <h2 id="caregiver-duties">6. Обязанности сиделки</h2>
      <p>Конкретный перечень задач определяется договоренностью между Заказчиком и сиделкой и может включать:</p>
      <ul>
        <li>помощь в гигиене, приеме пищи и бытовой поддержке подопечного;</li>
        <li>контроль приема назначенных врачом препаратов (без назначения лечения);</li>
        <li>помощь в перемещении, сопровождении, простом быте и коммуникации;</li>
        <li>уведомление Заказчика о существенных изменениях самочувствия подопечного.</li>
      </ul>

      <h2 id="payments">7. Порядок расчетов</h2>
      <ul>
        <li>Стоимость услуг подбора определяется тарифами сервиса на дату обращения.</li>
        <li>Условия оплаты услуг сиделки определяются отдельным соглашением между Заказчиком и сиделкой.</li>
        <li>Возвраты по услугам подбора рассматриваются индивидуально с учетом фактически выполненных действий.</li>
      </ul>

      <h2 id="liability">8. Гарантии и ответственность сторон</h2>
      <p>
        «Пульс Заботы» гарантирует добросовестный подбор кандидатов и организационное сопровождение в пределах
        оказываемой услуги.
      </p>
      <p>
        Сервис <strong>не несет ответственность</strong> за действия/бездействие сиделки, качество фактического ухода,
        наступление вреда жизни, здоровью или имуществу в отношениях между Заказчиком и сиделкой, поскольку не
        является стороной их прямого договора оказания услуг.
      </p>
      <p>
        Все претензии по фактическому исполнению ухода, причинению ущерба, спорным расчетам и поведению сиделки
        урегулируются между Заказчиком и сиделкой в соответствии с законодательством РФ. Сервис может оказывать
        информационное содействие в урегулировании спора без принятия на себя ответственности за итог.
      </p>

      <h2 id="personal-data">9. Персональные данные</h2>
      <p>
        Обработка персональных данных осуществляется в соответствии с <Link to="/privacy-policy">Политикой обработки персональных данных</Link> и требованиями Федерального закона №152-ФЗ.
      </p>
      <p>
        Отзыв согласия и запросы на удаление/уточнение данных принимаются по контактам, указанным в Политике.
        Стандартный срок исполнения обоснованного запроса — до 3 (трех) месяцев, если более короткий срок не
        установлен законом.
      </p>

      <h2 id="final">10. Заключительные положения</h2>
      <ul>
        <li>Правила являются публичным документом и действуют с даты размещения на сайте.</li>
        <li>Сервис вправе обновлять документ; актуальная редакция публикуется на сайте.</li>
        <li>Если отдельное положение признается недействительным, остальные положения продолжают действовать.</li>
      </ul>

      <div className="legal-signoff">
        <p>
          <strong>Дата публикации:</strong> 27 марта 2026 года
        </p>
        <p>
          <strong>Версия документа:</strong> 1.0
        </p>
      </div>
    </LegalPage>
  );
}

function NotFoundPage() {
  usePageMeta({
    title: "Страница не найдена (404) - Пульс Заботы",
    description: "Запрошенная страница не найдена. Вернитесь на главную страницу Пульс Заботы.",
    index: false
  });

  return (
    <main className="legal-main">
      <section className="container legal-hero">
        <p className="legal-kicker">404</p>
        <h1>Страница не найдена</h1>
        <p className="legal-lead">
          Такой страницы нет или адрес был изменён. Перейдите на главную и выберите нужный раздел.
        </p>
        <p>
          <Link className="story-link" to="/">
            На главную
          </Link>
        </p>
      </section>
    </main>
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <MaxWidget />
      <SiteFooter />
      <FeedbackModal open={modalOpen} mode={feedbackMode} onClose={() => setFeedbackMode(null)} />
    </div>
  );
}
