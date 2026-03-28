const commonTrainingPoints = [
  "Внутренний чек-лист запуска ухода: состояние подопечного, факторы риска, эскалация экстренных сценариев.",
  "Инструктаж по коммуникации с семьей: ежедневный отчет, передача наблюдений, фиксация динамики.",
  "Контроль режима: питание, прием лекарств по назначениям врача, гигиена, сон, профилактика падений и пролежней.",
  "Кураторское сопровождение после выхода сиделки и плановая замена при необходимости."
];
const ARTICLES_ADDED_AT = "2026-03-27";

const scientificSources = {
  dementia: [
    { title: "WHO Fact Sheet: Dementia", url: "https://www.who.int/news-room/fact-sheets/dementia" },
    {
      title: "National Institute on Aging: Alzheimer’s Caregiving",
      url: "https://www.nia.nih.gov/health/alzheimers-and-dementia/caregiving"
    }
  ],
  parkinson: [
    {
      title: "NINDS: Parkinson's Disease",
      url: "https://www.ninds.nih.gov/health-information/disorders/parkinsons-disease"
    },
    {
      title: "NINDS: Parkinson’s Disease - Hope Through Research",
      url: "https://www.ninds.nih.gov/sites/default/files/2025-05/parkinsons-disease-hope-through-research.pdf"
    }
  ],
  stroke: [
    {
      title: "PubMed: Stroke rehabilitation in adults (guideline summary)",
      url: "https://pubmed.ncbi.nlm.nih.gov/38147522/"
    },
    {
      title: "PubMed: Home-based training for stroke caregivers (RCT)",
      url: "https://pubmed.ncbi.nlm.nih.gov/25759177/"
    }
  ],
  als: [
    {
      title: "PubMed/PMC: Caregiver burden in ALS (systematic review)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5784458/"
    },
    {
      title: "PubMed: Coping strategies in ALS/FTD caregivers",
      url: "https://pubmed.ncbi.nlm.nih.gov/34937437/"
    }
  ],
  tracheostomy: [
    {
      title: "PubMed: Tracheostomy home care and caregiver burden",
      url: "https://pubmed.ncbi.nlm.nih.gov/30986200/"
    },
    {
      title: "PubMed: Tracheostomy patient/caregiver experience review",
      url: "https://pubmed.ncbi.nlm.nih.gov/28914429/"
    }
  ],
  stoma: [
    { title: "NHS: Find stoma support", url: "https://www.nhs.uk/service-search/other-health-services/stoma-support" },
    { title: "Imperial NHS: Stoma care service", url: "https://www.imperial.nhs.uk/our-services/surgery/stoma-care" }
  ],
  oncology: [
    {
      title: "NCI: Family caregiving for cancer patients",
      url: "https://www.cancer.gov/about-cancer/coping/family-friends/family-caregivers-pdq"
    },
    { title: "WHO: Palliative care", url: "https://www.who.int/news-room/fact-sheets/detail/palliative-care" }
  ],
  diabetes: [
    { title: "WHO: Diabetes fact sheet", url: "https://www.who.int/news-room/fact-sheets/detail/diabetes" },
    { title: "CDC: Helping friends and family with diabetes", url: "https://www.cdc.gov/diabetes/caring/index.html" }
  ],
  frailty: [
    {
      title: "WHO: Integrated Care for Older People (ICOPE)",
      url: "https://www.who.int/publications-detail-redirect/9789241550109"
    },
    {
      title: "NIA: Cognitive health and older adults",
      url: "https://www.nia.nih.gov/health/brain-health/cognitive-health-and-older-adults"
    }
  ]
};

const conditions = [
  {
    key: "alzheimer",
    conditionName: "болезни Альцгеймера",
    short: "Альцгеймер",
    audience: "пожилого человека с эпизодами дезориентации",
    concerns: ["ночная спутанность", "риск ухода из дома", "контроль лекарств"],
    sourceKeys: ["dementia", "frailty"]
  },
  {
    key: "dementia",
    conditionName: "деменции",
    short: "Деменция",
    audience: "пожилого человека с когнитивными нарушениями",
    concerns: ["агрессия", "тревожность", "повторяющееся поведение"],
    sourceKeys: ["dementia"]
  },
  {
    key: "parkinson",
    conditionName: "болезни Паркинсона",
    short: "Паркинсон",
    audience: "подопечного с тремором и нарушением походки",
    concerns: ["риск падений", "замирания", "режим препаратов"],
    sourceKeys: ["parkinson"]
  },
  {
    key: "stroke",
    conditionName: "последствиях инсульта",
    short: "После инсульта",
    audience: "пациента в восстановительном периоде",
    concerns: ["слабость одной стороны", "нарушение речи", "профилактика пролежней"],
    sourceKeys: ["stroke"]
  },
  {
    key: "oncology",
    conditionName: "онкологическом заболевании",
    short: "Онкология",
    audience: "онкопациента с выраженной слабостью",
    concerns: ["боль и утомляемость", "снижение аппетита", "поддержка семьи"],
    sourceKeys: ["oncology"]
  },
  {
    key: "als",
    conditionName: "БАСе (боковом амиотрофическом склерозе)",
    short: "БАС",
    audience: "тяжелобольного пациента с нарастающей слабостью",
    concerns: ["высокая нагрузка на семью", "позиционирование", "длительный уход"],
    sourceKeys: ["als"]
  },
  {
    key: "tracheostomy",
    conditionName: "трахеостоме",
    short: "Трахеостома",
    audience: "пациента после стационара с трахеостомой",
    concerns: ["дыхательный комфорт", "гигиена", "круглосуточное наблюдение"],
    sourceKeys: ["tracheostomy"]
  },
  {
    key: "gastrostomy",
    conditionName: "гастростоме",
    short: "Гастростома",
    audience: "лежачего пациента с ограниченной подвижностью",
    concerns: ["режим питания", "уход за кожей", "профилактика осложнений"],
    sourceKeys: ["stoma"]
  },
  {
    key: "colostomy",
    conditionName: "колостоме",
    short: "Колостома",
    audience: "подопечного после операции со стомой",
    concerns: ["деликатная гигиена", "психологический комфорт", "самообслуживание"],
    sourceKeys: ["stoma"]
  },
  {
    key: "diabetes",
    conditionName: "сахарном диабете у пожилых",
    short: "Диабет",
    audience: "пожилого человека с сопутствующими рисками",
    concerns: ["режим питания", "контроль самочувствия", "профилактика падений"],
    sourceKeys: ["diabetes", "frailty"]
  },
  {
    key: "fracture",
    conditionName: "переломе шейки бедра",
    short: "Перелом шейки бедра",
    audience: "маломобильного пожилого пациента",
    concerns: ["безопасное перемещение", "пролежни", "реабилитационный режим"],
    sourceKeys: ["frailty", "stroke"]
  },
  {
    key: "bedridden",
    conditionName: "уходе за лежачим больным",
    short: "Лежачий больной",
    audience: "лежачего подопечного с постоянной потребностью в помощи",
    concerns: ["гигиена", "пролежни", "повороты по графику"],
    sourceKeys: ["frailty"]
  },
  {
    key: "postop",
    conditionName: "восстановлении после операции",
    short: "После операции",
    audience: "подопечного после выписки из стационара",
    concerns: ["слабость", "контроль режима", "безопасность дома"],
    sourceKeys: ["frailty", "stroke"]
  },
  {
    key: "palliative",
    conditionName: "паллиативном сопровождении",
    short: "Паллиативный уход",
    audience: "пациента с выраженной симптомной нагрузкой",
    concerns: ["комфорт", "обезболивание по назначению врача", "поддержка семьи"],
    sourceKeys: ["oncology", "frailty"]
  },
  {
    key: "nightcare",
    conditionName: "сложном ночном уходе",
    short: "Ночной уход",
    audience: "пожилого человека с ночной тревожностью",
    concerns: ["бессонница", "ночные подъемы", "риск падений ночью"],
    sourceKeys: ["dementia", "frailty"]
  }
];

const moscowVariants = [
  { slug: "moskva-s-prozhivaniem", label: "с проживанием", hf: "сиделка с проживанием Москва" },
  { slug: "moskva-kruglosutochno", label: "круглосуточно", hf: "круглосуточная сиделка Москва" },
  { slug: "moskva-srochno", label: "срочно", hf: "срочно сиделка Москва" },
  { slug: "moskva-na-dom", label: "на дому", hf: "уход на дому Москва" }
];

const spbVariants = [
  { slug: "spb-s-prozhivaniem", label: "с проживанием", hf: "сиделка с проживанием СПб" },
  { slug: "spb-kruglosutochno", label: "круглосуточно", hf: "круглосуточная сиделка СПб" }
];

const spbExtraVariants = [
  ...spbVariants,
  { slug: "spb-na-dom", label: "на дому", hf: "уход на дому СПб" },
  { slug: "spb-srochno", label: "срочно", hf: "срочно сиделка СПб" }
];

const moscowDistricts = [
  "Арбат", "Басманный", "Замоскворечье", "Красносельский", "Мещанский", "Пресненский", "Таганский", "Тверской", "Хамовники", "Якиманка",
  "Аэропорт", "Беговой", "Бескудниковский", "Войковский", "Головинский", "Дмитровский", "Западное Дегунино", "Коптево", "Левобережный", "Молжаниновский",
  "Савеловский", "Сокол", "Тимирязевский", "Ховрино", "Хорошевский", "Алексеевский", "Алтуфьевский", "Бабушкинский", "Бибирево", "Бутырский",
  "Лианозово", "Лосиноостровский", "Марфино", "Марьина Роща", "Останкинский", "Отрадное", "Ростокино", "Свиблово", "Северное Медведково", "Северный",
  "Южное Медведково", "Ярославский", "Богородское", "Вешняки", "Восточный", "Гольяново", "Ивановское", "Измайлово", "Косино-Ухтомский", "Метрогородок",
  "Новогиреево", "Новокосино", "Перово", "Преображенское", "Северное Измайлово", "Соколиная Гора", "Сокольники", "Внуково", "Дорогомилово", "Крылатское",
  "Кунцево", "Можайский", "Ново-Переделкино", "Очаково-Матвеевское", "Проспект Вернадского", "Раменки", "Солнцево", "Тропарево-Никулино", "Филевский Парк", "Фили-Давыдково",
  "Академический", "Гагаринский", "Зюзино", "Коньково", "Котловка", "Ломоносовский", "Обручевский", "Северное Бутово", "Теплый Стан", "Черемушки",
  "Южное Бутово", "Ясенево", "Бирюлево Восточное", "Бирюлево Западное", "Братеево", "Даниловский", "Донской", "Зябликово", "Москворечье-Сабурово", "Нагатино-Садовники",
  "Нагатинский Затон", "Нагорный", "Орехово-Борисово Северное", "Орехово-Борисово Южное", "Царицыно", "Чертаново Северное", "Чертаново Центральное", "Чертаново Южное", "Некрасовка", "Капотня"
];

const spbDistricts = [
  "Адмиралтейский", "Василеостровский", "Выборгский", "Калининский", "Кировский", "Колпинский", "Красногвардейский", "Красносельский", "Кронштадтский", "Курортный",
  "Московский", "Невский", "Петроградский", "Петродворцовый", "Приморский", "Пушкинский", "Фрунзенский", "Центральный", "Коломяги", "Лахта-Ольгино",
  "Юнтолово", "Шувалово-Озерки", "Озеро Долгое", "Комендантский Аэродром", "Черная Речка", "Парголово", "Шушары", "Купчино", "Рыбацкое", "Обухово",
  "Веселый Поселок", "Автово", "Ульянка", "Дачное", "Лигово", "Сосновая Поляна", "Стрельна", "Петергоф", "Ломоносов", "Сестрорецк",
  "Зеленогорск", "Павловск", "Пушкин", "Колпино", "Металлострой", "Пороховые", "Оккервиль", "Гражданка", "Полюстрово", "Смольнинское"
];

const regionMeta = {
  moskva: {
    cityLabel: "Москве",
    regionWord: "Москва",
    districtWord: "районе",
    hubLabel: "районы Москвы"
  },
  spb: {
    cityLabel: "Санкт-Петербурге",
    regionWord: "СПб",
    districtWord: "районе",
    hubLabel: "районы Санкт-Петербурга"
  }
};

const voiceLead = [
  "Мы подбираем сиделку под конкретный клинический сценарий, а не по формальному резюме.",
  "Ставим в приоритет безопасность подопечного и спокойствие семьи с первого дня.",
  "Организуем уход так, чтобы снизить ежедневную нагрузку на близких.",
  "Выстраиваем системный формат сопровождения с курацией и обратной связью."
];

const voiceSection = [
  "Уход строится на прогнозируемом режиме и контроле бытовых рисков.",
  "План действий заранее согласуется с семьей и корректируется по состоянию подопечного.",
  "Мы фиксируем наблюдения и передаем семье понятные отчеты.",
  "Ключевая цель - стабильность и снижение вероятности экстренных ситуаций дома."
];

function pick(arr, index, salt = 0) {
  return arr[(index + salt) % arr.length];
}

function slugifyRu(text) {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
  };

  return text
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSources(sourceKeys) {
  const map = new Map();
  sourceKeys.forEach((key) => {
    (scientificSources[key] || []).forEach((item) => {
      map.set(item.url, item);
    });
  });
  return Array.from(map.values());
}

function makeLowFrequencyQueries(condition, region, variant, district) {
  return [
    `сиделка ${variant.label} для ${condition.audience} в ${region.cityLabel}`,
    district ? `сиделка ${variant.label} при ${condition.conditionName} в ${district} ${region.districtWord}` : `уход ${variant.label} при ${condition.conditionName} в ${region.cityLabel}`,
    `${variant.hf} ${condition.short.toLowerCase()} ${region.regionWord.toLowerCase()}`,
    district
      ? `подбор сиделки при ${condition.conditionName} ${district.toLowerCase()} ${region.districtWord}`
      : `подбор сиделки при ${condition.conditionName} ${region.cityLabel.toLowerCase()} недорого`,
    district
      ? `низкочастотный запрос: уход ${variant.label} ${condition.short.toLowerCase()} ${district.toLowerCase()}`
      : `помощь семье при ${condition.concerns[0]} и ${condition.concerns[1]} ${region.cityLabel.toLowerCase()}`
  ];
}

function makeBasePage(condition, variant, regionKey, index) {
  const region = regionMeta[regionKey];
  const slug = `sidelka-${condition.key}-${variant.slug}`;
  const path = `/${slug}`;

  return {
    slug,
    path,
    navLabel: `${condition.short} ${region.regionWord}`,
    title: `Сиделка ${variant.label} при ${condition.conditionName} в ${region.cityLabel}`,
    metaTitle: `Сиделка ${variant.label} при ${condition.short} в ${region.cityLabel} - Пульс Заботы`,
    metaDescription: `Подбор сиделки ${variant.label} при ${condition.conditionName} в ${region.cityLabel}: обучение персонала, контроль качества, поддержка семьи 24/7.`,
    addedAt: ARTICLES_ADDED_AT,
    lead: `${pick(voiceLead, index)} Профессиональный уход ${variant.label} при ${condition.conditionName} в ${region.cityLabel}.`,
    sections: [
      {
        heading: `Как организован уход при ${condition.conditionName}`,
        points: [
          `Оцениваем риски: ${condition.concerns.join(", ")}.`,
          "Формируем персональный режим дня, питания, отдыха и гигиены.",
          pick(voiceSection, index, 1),
          pick(voiceSection, index, 2)
        ]
      },
      { heading: "Обучение и контроль персонала", points: commonTrainingPoints },
      {
        heading: "Почему этот формат работает",
        points: [
          "Снижает риск бытовых осложнений и повторных экстренных обращений.",
          "Дает подопечному предсказуемый ритм и больше чувства безопасности.",
          "Уменьшает эмоциональное выгорание у родственников.",
          "Поддерживает преемственность ухода между домом и стационаром."
        ]
      }
    ],
    lowFrequencyQueries: makeLowFrequencyQueries(condition, region, variant),
    faq: [
      {
        question: `Можно ли срочно подобрать сиделку при ${condition.conditionName} в ${region.cityLabel}?`,
        answer:
          "Да. В срочных кейсах запускаем подбор в день обращения и закрываем базовую безопасность до финального согласования кандидата."
      },
      {
        question: "Как подтверждается квалификация сиделки?",
        answer:
          "Проверяем документы, рекомендации и практический опыт именно по профилю диагноза и формату ухода."
      },
      {
        question: "Есть ли поддержка после выхода специалиста?",
        answer:
          "Да, курация продолжается после запуска ухода: мы отслеживаем обратную связь семьи и корректируем формат при необходимости."
      }
    ],
    scientificLinks: uniqueSources(condition.sourceKeys)
  };
}

function makeDistrictPage(condition, variant, regionKey, district, index) {
  const region = regionMeta[regionKey];
  const districtSlug = slugifyRu(district);
  const slug = `sidelka-${condition.key}-${variant.slug}-v-${districtSlug}`;
  const path = `/${slug}`;
  const districtLabel = `${district} ${region.districtWord}`;

  return {
    slug,
    path,
    navLabel: `${condition.short}: ${district}`,
    title: `Сиделка ${variant.label} при ${condition.conditionName} в ${districtLabel} (${region.regionWord})`,
    metaTitle: `Сиделка ${variant.label} ${district} ${region.regionWord} - уход при ${condition.short}`,
    metaDescription: `Уход ${variant.label} при ${condition.conditionName} в ${districtLabel}: НЧ-запросы, научные источники, обучение персонала и FAQ по району.`,
    addedAt: ARTICLES_ADDED_AT,
    lead: `${pick(voiceLead, index, 2)} Для семей в ${districtLabel} мы выстраиваем маршрут ухода ${variant.label} при ${condition.conditionName}.`,
    sections: [
      {
        heading: `Особенности ухода в ${districtLabel}`,
        points: [
          `Учитываем логистику и доступность для семьи в ${district} ${region.districtWord}.`,
          `Основные риски в кейсах этого профиля: ${condition.concerns.join(", ")}.`,
          pick(voiceSection, index, 0),
          pick(voiceSection, index, 3)
        ]
      },
      { heading: "Обучение и контроль персонала", points: commonTrainingPoints },
      {
        heading: "Маршрут для семьи по району",
        points: [
          `Фиксируем график ухода и контактное окно для родственников в ${districtLabel}.`,
          "Согласовываем резервный план на случай экстренного ухудшения состояния.",
          "Подключаем куратора на старте и в точках изменения клинической картины.",
          "Проводим регулярную сверку качества ухода по чек-листу."
        ]
      }
    ],
    lowFrequencyQueries: makeLowFrequencyQueries(condition, region, variant, district),
    faq: [
      {
        question: `Работаете ли вы в ${district} ${region.districtWord}?`,
        answer:
          `Да, мы принимаем заявки из ${districtLabel} и подбираем специалиста под профиль диагноза и формат ${variant.label}.`
      },
      {
        question: `Можно ли подобрать сиделку срочно в ${districtLabel}?`,
        answer:
          "Да, в срочных кейсах запускаем подбор в день обращения и первично закрываем задачи безопасности."
      },
      {
        question: "Как учитываются особенности маршрута и графика семьи?",
        answer:
          "Перед стартом фиксируем окно посещений родственников, правила связи и график отчетности, чтобы уход был прозрачным."
      }
    ],
    scientificLinks: uniqueSources(condition.sourceKeys)
  };
}

const baseMoscowPages = conditions.flatMap((condition, idx) =>
  moscowVariants.map((variant, vIdx) => makeBasePage(condition, variant, "moskva", idx * 10 + vIdx))
);

const baseSpbPages = conditions.flatMap((condition, idx) =>
  spbVariants.map((variant, vIdx) => makeBasePage(condition, variant, "spb", idx * 10 + vIdx))
);

const districtExtraMoscowPages = moscowDistricts.map((district, idx) => {
  const condition = conditions[idx % conditions.length];
  const variant = moscowVariants[idx % moscowVariants.length];
  return makeDistrictPage(condition, variant, "moskva", district, idx + 1000);
});

const districtExtraSpbPages = spbDistricts.map((district, idx) => {
  const condition = conditions[(idx + 3) % conditions.length];
  const variant = spbExtraVariants[idx % spbExtraVariants.length];
  return makeDistrictPage(condition, variant, "spb", district, idx + 2000);
});

export const seoPages = [...baseMoscowPages, ...baseSpbPages, ...districtExtraMoscowPages, ...districtExtraSpbPages];

export const commonSeoFaq = [
  {
    question: "Вы работаете только по шаблону или подстраиваете уход под диагноз?",
    answer:
      "Всегда адаптируем алгоритм под конкретный клинический сценарий. Шаблонные чек-листы используем как базу контроля, а не как ограничение."
  },
  {
    question: "Есть ли сопровождение семьи после старта ухода?",
    answer:
      "Да, после запуска сиделки остается куратор, который отслеживает качество и помогает корректировать формат при изменении состояния подопечного."
  },
  {
    question: "Работаете ли вы с сочетанными диагнозами?",
    answer:
      "Да, включая сложные комбинации: деменция + маломобильность, онкология + паллиативный этап, постинсультные ограничения и другие сочетания."
  }
];

export const seoHub = {
  path: "/articles",
  title: "240 SEO-страниц по сложному уходу: Москва, районы Москвы, СПб и районы Санкт-Петербурга",
  lead:
    "Раздел построен под высоко-, средне- и низкочастотные запросы: с проживанием, круглосуточно, срочно и на дому при сложных диагнозах.",
  intro:
    "Сейчас в разделе: 60 базовых страниц по Москве, 30 базовых по СПб и еще 150 районных страниц с уникальными формулировками, FAQ и научными ссылками.",
  ctaText:
    "Нужен точный подбор сиделки под ваш диагноз и район? Оставьте заявку: сформируем персональный маршрут ухода и предложим релевантных кандидатов.",
  faq: [
    {
      question: "Зачем делать отдельные страницы под районы Москвы и СПб?",
      answer:
        "Районная детализация закрывает длинные низкочастотные запросы и повышает релевантность для семей, которые ищут помощь в конкретной локации."
    },
    {
      question: "Чем эти страницы отличаются от типовых SEO-текстов?",
      answer:
        "Каждая страница содержит клинический профиль, блок обучения сиделок, районный FAQ, НЧ-кластер и подтверждающие научные источники."
    }
  ]
};
