export const siteContent = {
  product: {
    name: "npmctl",
    slug: "npmctl-com",
    tagline: "Command-center automation for npm package operations.",
    description: "npmctl coordinates package builds, releases, DNS workflows, and deployment operations through a governed command surface.",
    category: "Product website",
    canonicalUrl: "https://npmctl.com"
  },
  theme: { id: "default", label: "Default", mode: "light", tokens: { accent: "#2563EB" } },
  nav: {
    primary: [
      { label: "Platform", href: "/platform/" },
      { label: "Proof", href: "/proof/" },
      { label: "GitHub", href: "https://github.com/groupsum/npmctl" }
    ],
    compactLinks: [
      { label: "Proof", href: "/proof/" },
      { label: "GitHub", href: "https://github.com/groupsum/npmctl" },
      { label: "Desired state ops", href: "/articles/desired-state-beats-click-ops-for-site-operations/" },
      { label: "Operator lane", href: "/articles/from-check-to-deploy-in-one-operator-lane/" }
    ],
    cta: { label: "Get started", href: "/platform/" }
  },
  footer: {
    note: "npmctl is maintained by groupsum.",
    links: [
      { label: "GitHub", href: "https://github.com/groupsum/npmctl" }
    ]
  },
  ai: {
    llmsTxtTitle: "npmctl",
    coreFacts: [
      "npmctl coordinates package builds, releases, DNS workflows, and deployment operations through a governed command surface.",
      "The canonical website is https://npmctl.com.",
      "The site is deployed as a self-hosted Docker static site."
    ]
  },
  pages: [
    {
      slug: "/",
      kind: "home",
      title: "npmctl | Command-center automation for npm package operations.",
      description: "npmctl coordinates package builds, releases, DNS workflows, and deployment operations through a governed command surface.",
      h1: "npmctl",
      intro: "npmctl coordinates package builds, releases, DNS workflows, and deployment operations through a governed command surface. The site packages product positioning, structured metadata, and deployment evidence in a standalone MdWrk lander repository.",
      sections: [
        { id: "hero", kind: "hero", eyebrow: "Package operations", title: "Command-center automation for npm package operations.", subtitle: "npmctl coordinates package builds, releases, DNS workflows, and deployment operations through a governed command surface." },
        { id: "platform", kind: "feature_grid", title: "What this site owns", items: [
          { title: "Product narrative", description: "Canonical product messaging, audience positioning, and calls to action for npmctl.com." },
          { title: "Structured discovery", description: "Search, assistant, social, and linked-data metadata generated from the content pack." },
          { title: "Independent deploys", description: "CI, Docker deployment, and Namecheap DNS live in this repository." }
        ] },
        { id: "proof", kind: "proof_matrix", title: "Operational proof", items: [
          { claim: "The site is independently buildable.", status: "planned", evidence: "npm run build produces the local static artifact and Docker image build input." },
          { claim: "DNS ownership is explicit.", status: "planned", evidence: "site.manifest.json records the Namecheap zone and records owned by this repository." }
        ] },
        { id: "cta", kind: "cta", title: "Build from source", body: "Use npm ci, npm run check, npm run build, npm run dns:plan, and npm run proxy:plan before publishing." }
      ],
      schema: [
        { kind: "Organization", data: { name: "npmctl", url: "https://npmctl.com" } },
        { kind: "WebSite", data: { name: "npmctl", url: "https://npmctl.com" } }
      ]
    },
    {
      slug: "/platform/",
      kind: "feature",
      title: "npmctl platform",
      description: "Platform overview for npmctl.",
      h1: "Platform",
      intro: "This page captures the platform surface that the npmctl website introduces to operators, builders, and technical evaluators.",
      sections: [
        { id: "details", kind: "feature_detail", title: "Repository-owned site system", body: "The lander is intentionally thin: the application host renders a typed content pack, while metadata, sitemap, robots, and Docker deployment remain repo-local.", items: [
          { title: "MdWrk lander", description: "Reusable page sections and structured-data support." },
          { title: "Content pack", description: "Product-specific content, navigation, metadata, and discovery outputs." }
        ] },
        { id: "faq", kind: "faq", title: "Platform FAQ", items: [
          { question: "Where is this site deployed?", answer: "It is built as a static site and served by a self-hosted Docker service." },
          { question: "Who owns DNS?", answer: "This repository owns its declared Namecheap records through the DNS workflow." }
        ] }
      ]
    },
    {
      slug: "/proof/",
      kind: "package",
      title: "npmctl proof",
      description: "Build, DNS, and deployment proof for npmctl.",
      h1: "Proof",
      intro: "The proof page gives operators a quick inventory of the commands and artifacts required before publication.",
      sections: [
        { id: "commands", kind: "package_grid", title: "Verification commands", packages: [
          { name: "Install", description: "Install deterministic dependencies.", install: "npm ci", api: ["npm ci"] },
          { name: "Check", description: "Run type and content-pack checks.", install: "npm run check", api: ["npm run check"] },
          { name: "Build", description: "Build the content pack and static site.", install: "npm run build", api: ["npm run build"] },
          { name: "DNS plan", description: "Render the Namecheap record plan.", install: "npm run dns:plan", api: ["npmctl plan desired-state/dns.yaml"] }
        ] }
      ]
    },
    {
      slug: "/articles/desired-state-beats-click-ops-for-site-operations/",
      kind: "feature",
      title: "Desired state beats click-ops for site operations | npmctl",
      description: "Why npmctl treats DNS, proxy, certificates, and deploy state as planable, reviewable artifacts instead of manual dashboard work.",
      h1: "Desired state beats click-ops for site operations.",
      intro: "npmctl is most useful when it reduces operational drift instead of merely wrapping commands. The repo already reflects that viewpoint: DNS, proxy, build, and deploy work are represented as named scripts over declared files so operators can plan changes before they mutate live state.",
      sections: [
        { id: "lane", kind: "feature_detail", title: "The command surface is valuable because it narrows operator ambiguity", body: "A command surface matters when it makes the intended state legible. In this repository, npmctl is positioned around package builds, DNS workflows, proxy host plans, certificate-related publication, and Docker-backed deploys. That is stronger than a generic automation story because the artifacts being changed are visible first.", items: [
          { title: "Planned DNS changes", description: "DNS work is represented as desired state rather than remembered manual edits." },
          { title: "Planned proxy changes", description: "Proxy host updates are reviewed as file-backed plans before apply." },
          { title: "One operator lane", description: "Build, check, DNS, proxy, and deploy commands live beside each other in the same repo." }
        ] },
        { id: "proof", kind: "proof_matrix", title: "Repository signals that support this claim", items: [
          { claim: "Operator state is file-backed.", status: "observed", evidence: "The repo includes desired-state DNS and proxy documents for npmctl.com." },
          { claim: "The command lane is named.", status: "observed", evidence: "Scripts expose `check`, `build`, `dns:plan`, `proxy:plan`, and deploy flows directly." },
          { claim: "Publication does not rely on hidden context.", status: "observed", evidence: "Docker service naming, workflows, and desired-state inputs are all local repo surfaces." }
        ] },
        { id: "faq", kind: "faq", title: "Why this matters", items: [
          { question: "Why emphasize desired state?", answer: "Because planned state is easier to review, reason about, and repeat than click-driven operator memory." },
          { question: "What does npmctl improve?", answer: "It reduces ambiguity around what will change in DNS, proxy configuration, and site publication." },
          { question: "Who benefits?", answer: "Teams that want repeatable operator workflows without treating deployment state as an undocumented side channel." }
        ] }
      ]
    },
    {
      slug: "/articles/from-check-to-deploy-in-one-operator-lane/",
      kind: "feature",
      title: "From check to deploy in one operator lane | npmctl",
      description: "How npmctl connects validation, build, DNS planning, proxy planning, and deploy into a single reviewable operator path.",
      h1: "From check to deploy in one operator lane.",
      intro: "The npmctl.com repository is a good example of the product story because it keeps validation, build, DNS planning, proxy planning, and deploy in one place. That means the published site is also a proof surface for the operating model npmctl is trying to promote.",
      sections: [
        { id: "ownership", kind: "feature_detail", title: "The repo itself is an operator workflow specimen", body: "Instead of describing a command-center pattern abstractly, the repository runs the pattern on its own publication surface. Operators can inspect the check/build steps, the desired-state files, the Docker target, and the workflow lanes that publish the site.", items: [
          { title: "Named Docker target", description: "The repo deploys the `npmctl-com` service directly." },
          { title: "Workflow split by responsibility", description: "CI, DNS, and deploy workflows make the lane easier to reason about." },
          { title: "Repo-owned proof", description: "The site that describes npmctl is published through the same explicit workflow model it advocates." }
        ] },
        { id: "commands", kind: "package_grid", title: "The operator lane in commands", packages: [
          { name: "Check", description: "Verifies the content-pack and application surface.", install: "npm run check", api: ["npm run check"] },
          { name: "Build", description: "Builds the static site artifact.", install: "npm run build", api: ["npm run build"] },
          { name: "DNS plan", description: "Renders intended DNS state before apply.", install: "npm run dns:plan", api: ["npmctl plan desired-state/dns.yaml"] },
          { name: "Proxy plan", description: "Renders intended proxy host state before apply.", install: "npm run proxy:plan", api: ["npmctl plan desired-state/proxy.yaml"] }
        ] },
        { id: "cta", kind: "cta", title: "Use the repo as the example", body: "npmctl is easier to understand when the repo itself is read as an end-to-end operator lane. The publication surface is part of the product argument, not separate from it." }
      ]
    }
  ]
};

export default siteContent;
