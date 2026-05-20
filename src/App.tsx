import siteContent from "../packages/site-content-pack/src/index";

const links = [
  { label: "Command surface", href: "/platform/" },
  { label: "Proof", href: "/proof/" },
  { label: "GitHub", href: "https://github.com/groupsum/npmctl-com" }
];

const recentNotes = [
  {
    title: "Package operations",
    href: "/platform/",
    body: "Coordinate install, check, build, release, DNS, proxy, and deploy commands through one operator surface."
  },
  {
    title: "Infrastructure plans",
    href: "/proof/",
    body: "Use declarative desired state for DNS records, proxy hosts, certificates, and deployment lanes."
  },
  {
    title: "Repository-owned site",
    href: "https://github.com/groupsum/npmctl-com",
    body: "Keep npmctl.com independently buildable and deployable from its own repo."
  }
];

function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="site-brand" href="/" aria-label="npmctl home">
          <img src="/assets/brand/npmctl/npmctl-brand-lockup.svg" alt="npmctl" />
        </a>
        <nav aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>{siteContent.footer?.note}</p>
        <div>
          <a href="/">Home</a>
          <a href="/platform/">Command surface</a>
          <a href="/proof/">Proof</a>
        </div>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <SiteChrome>
      <section className="home-hero" aria-labelledby="hero-title">
        <p className="eyebrow">npmctl</p>
        <h1 id="hero-title">Command-center automation for package and site operations.</h1>
        <p>
          npmctl gives operators a single command surface for package workflows, DNS desired state,
          proxy hosts, certificates, and Docker-backed publication.
        </p>
      </section>
      <section className="article-list" aria-labelledby="articles-title">
        <div className="section-heading">
          <p className="eyebrow">Start here</p>
          <h2 id="articles-title">Operator surfaces</h2>
        </div>
        <div className="articles">
          {recentNotes.map((item) => (
            <a className="article-link" href={item.href} key={item.href}>
              <span>npmctl</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </a>
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}

function DetailPage({ kind }: { kind: "platform" | "proof" }) {
  const isPlatform = kind === "platform";
  return (
    <SiteChrome>
      <article className="article-page">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <a href="/">npmctl</a>
          <span>/</span>
          <span>{isPlatform ? "Command surface" : "Proof"}</span>
        </nav>
        <header className="article-hero">
          <p className="article-kicker">{isPlatform ? "Command surface" : "Proof"}</p>
          <h1>{isPlatform ? "One command lane for package operations." : "Evidence for npmctl.com publication."}</h1>
          <p className="article-excerpt">
            {isPlatform
              ? "npmctl coordinates lifecycle commands for packages, DNS plans, proxy host plans, certificates, and Docker deployments."
              : "The site repository owns the static build, Docker service, DNS plan, proxy plan, and deploy workflow for npmctl.com."}
          </p>
        </header>
      </article>
    </SiteChrome>
  );
}

export function App() {
  const path = typeof window === "undefined" ? "/" : window.location.pathname;
  if (path.startsWith("/platform")) return <DetailPage kind="platform" />;
  if (path.startsWith("/proof")) return <DetailPage kind="proof" />;
  return <HomePage />;
}
