CREATE TABLE IF NOT EXISTS pc_site_profile (
  id smallint PRIMARY KEY DEFAULT 1,
  site_name text NOT NULL,
  site_url text NOT NULL,
  support_phone text NOT NULL,
  support_label text NOT NULL DEFAULT 'Линия заботы',
  max_widget_url text,
  footer_blurb text,
  home_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  legal_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pc_seo_hub (
  id smallint PRIMARY KEY DEFAULT 1,
  path text NOT NULL UNIQUE,
  title text NOT NULL,
  lead text NOT NULL,
  intro text NOT NULL,
  cta_text text NOT NULL,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pc_seo_common_faq (
  id bigserial PRIMARY KEY,
  sort_order integer NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pc_seo_pages (
  id bigserial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  path text NOT NULL UNIQUE,
  nav_label text NOT NULL,
  title text NOT NULL,
  meta_title text NOT NULL,
  meta_description text NOT NULL,
  added_at date NOT NULL,
  lead text NOT NULL,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  low_frequency_queries jsonb NOT NULL DEFAULT '[]'::jsonb,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  scientific_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pc_seo_pages_path ON pc_seo_pages(path);
CREATE INDEX IF NOT EXISTS idx_pc_seo_pages_slug ON pc_seo_pages(slug);
CREATE INDEX IF NOT EXISTS idx_pc_seo_common_faq_order ON pc_seo_common_faq(sort_order);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pulscare_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pulscare_admin;
