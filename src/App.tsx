import siteContent from "../packages/site-content-pack/src/index";

type SitePage = (typeof siteContent.pages)[number];

const normalizePath = (value: string) => {
  const path = value === "" ? "/" : value.split(/[?#]/)[0] ?? "/";
  if (path === "/" || path === "") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
};

const homePage = siteContent.pages.find((page) => normalizePath(page.slug) === "/") ?? siteContent.pages[0];
const articlePages = siteContent.pages.filter((page) => normalizePath(page.slug).startsWith("/articles/"));
const homeHeroSection = homePage?.sections.find((section) => section.kind === "hero");
const homeEyebrow = homeHeroSection && "eyebrow" in homeHeroSection ? homeHeroSection.eyebrow : siteContent.product.category;
const compactLinks = siteContent.nav.compactLinks ?? [];
const currentYear = new Date().getUTCFullYear();
const footerLinks = [
  { label: "Home", href: "/" },
  ...siteContent.nav.primary,
  ...(siteContent.footer?.links ?? []),
].filter((link, index, array) => array.findIndex((candidate) => candidate.href === link.href) === index);

function pageKicker(page: SitePage) {
  if (normalizePath(page.slug).startsWith("/articles/")) return "Article";
  if (normalizePath(page.slug) === "/proof/") return "Proof";
  if (normalizePath(page.slug) === "/platform/") return "Command surface";
  return siteContent.product.name;
}

function pageSummary(page: SitePage) {
  return page.intro || page.description;
}

function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="site-brand" href="/" aria-label={`${siteContent.product.name} home`}>
          <img src="/assets/brand/npmctl/npmctl-brand-lockup.svg" alt={siteContent.product.name} />
        </a>
        <nav aria-label="Primary navigation">
          {siteContent.nav.primary.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <div className="footer-copy">
          <p>{siteContent.footer?.note}</p>
          <small>Copyright {currentYear} {siteContent.product.name}. All rights reserved.</small>
        </div>
        <div className="footer-links">
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <SiteChrome>
      <section className="home-hero" aria-labelledby="hero-title">
        <p className="eyebrow">{homeEyebrow}</p>
        <h1 id="hero-title">{homePage?.h1 || siteContent.product.name}</h1>
        <p>{homePage?.description || siteContent.product.description}</p>
      </section>

      <section className="article-list" aria-labelledby="articles-title">
        <div className="section-heading">
          <p className="eyebrow">Research</p>
          <h2 id="articles-title">Articles from the repository surface</h2>
        </div>
        <div className="articles">
          {articlePages.map((page) => (
            <a className="article-link" href={page.slug} key={page.slug}>
              <span>{pageKicker(page)}</span>
              <strong>{page.h1}</strong>
              <p>{pageSummary(page)}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="compact-links" aria-label="Site links">
        {compactLinks.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </section>
    </SiteChrome>
  );
}

function renderSection(_page: SitePage, section: any) {
  if (section.kind === "feature_detail") {
    return (
      <section className="article-section" key={section.id}>
        <h2>{section.title}</h2>
        <p>{section.body}</p>
        {section.items?.length ? (
          <div className="section-list">
            {section.items.map((item: any) => (
              <div className="section-card" key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    );
  }

  if (section.kind === "faq") {
    return (
      <section className="article-section" key={section.id}>
        <h2>{section.title}</h2>
        <div className="faq-list">
          {section.items.map((item: any) => (
            <div className="faq-item" key={item.question}>
              <strong>{item.question}</strong>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.kind === "proof_matrix") {
    return (
      <section className="article-section" key={section.id}>
        <h2>{section.title}</h2>
        <div className="proof-grid">
          {section.items.map((item: any) => (
            <div className="proof-card" key={item.claim}>
              <strong>{item.claim}</strong>
              <span>{item.status}</span>
              <p>{item.evidence}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.kind === "package_grid") {
    return (
      <section className="article-section" key={section.id}>
        <h2>{section.title}</h2>
        <div className="package-grid">
          {section.packages.map((pkg: any) => (
            <div className="package-card" key={pkg.name}>
              <strong>{pkg.name}</strong>
              <p>{pkg.description}</p>
              <code>{pkg.install}</code>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (section.kind === "cta") {
    return (
      <section className="article-section article-callout" key={section.id}>
        <h2>{section.title}</h2>
        <p>{section.body}</p>
      </section>
    );
  }

  return null;
}

function DetailPage({ page }: { page: SitePage }) {
  return (
    <SiteChrome>
      <article className="article-page">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <a href="/">{siteContent.product.name}</a>
          <span>/</span>
          <span>{page.h1}</span>
        </nav>
        <header className="article-hero">
          <p className="article-kicker">{pageKicker(page)}</p>
          <h1>{page.h1}</h1>
          <p className="article-excerpt">{pageSummary(page)}</p>
        </header>
        <section className="article-content">
          {page.sections.map((section) => renderSection(page, section))}
        </section>
      </article>
    </SiteChrome>
  );
}

export function App() {
  const path = typeof window === "undefined" ? "/" : normalizePath(window.location.pathname);
  const page = siteContent.pages.find((candidate) => normalizePath(candidate.slug) === path) ?? null;

  if (path === "/") return <HomePage />;
  if (page) return <DetailPage page={page} />;

  return (
    <SiteChrome>
      <section className="not-found">
        <p className="eyebrow">Not found</p>
        <h1>That page is not available.</h1>
        <a href="/">Return home</a>
      </section>
    </SiteChrome>
  );
}
