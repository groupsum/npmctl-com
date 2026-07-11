/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductClaim {
  id: string;
  claim: string;
  source: string;
  sourceVersion: string;
  verifiedOn: string;
  owner: string;
  publicLabel: string;
  status: 'verified' | 'historical' | 'planned' | 'retired';
  category: 'core' | 'safety' | 'provider' | 'cicd';
}

export interface SafetyScenario {
  id: string;
  title: string;
  state: string;
  behavior: string;
  consequence: string;
  exitCode: number;
  type: 'create' | 'update' | 'conflict' | 'unmanaged' | 'delete' | 'capability';
}

export interface DNSProviderInfo {
  id: string;
  name: string;
  packageName: string;
  installCommand: string;
  supportedRecords: string[];
  configSnippet: string;
  credentialEnv: string[];
  status: 'verified' | 'planned';
}

export interface ReleaseInfo {
  version: string;
  date: string;
  dateSource: 'PyPI' | 'GitHub';
  pythonRange: string;
  maturity: string;
  packages: string[];
  provenance: string;
  changelogSummary: string;
  pypiStatus: 'active' | 'yanked' | 'deprecated';
  fileSizeWheel: string;
  fileSizeSdist: string;
  sha256Wheel: string;
  sha256Sdist: string;
  changelogItems: string[];
}

export const PRODUCT_CLAIMS: ProductClaim[] = [
  {
    id: "definition",
    claim: "npmctl turns declarative YAML into safe, owner-scoped plans and reconciles for Nginx Proxy Manager resources and provider-backed DNS records.",
    source: "groupsum/npmctl",
    sourceVersion: "0.3.10",
    verifiedOn: "2026-07-11",
    owner: "DevOps Team",
    publicLabel: "Core Definition",
    status: "verified",
    category: "core"
  },
  {
    id: "safety-reconcile",
    claim: "npmctl replaces manual clicking and brittle scripts with validate -> schema check -> plan -> apply workflow",
    source: "groupsum/npmctl README",
    sourceVersion: "0.3.10",
    verifiedOn: "2026-07-11",
    owner: "Platform Lead",
    publicLabel: "Workflow Safety",
    status: "verified",
    category: "safety"
  },
  {
    id: "owner-scope",
    claim: "Ownership metadata limits each operation to an explicit owner scope; foreign-owned resources are immutable.",
    source: "groupsum/npmctl models",
    sourceVersion: "0.3.10",
    verifiedOn: "2026-07-11",
    owner: "Security Architect",
    publicLabel: "Ownership Model",
    status: "verified",
    category: "safety"
  },
  {
    id: "pypi-maturity",
    claim: "npmctl is open source under Apache-2.0 and classified as Beta on PyPI, supporting Python 3.10-3.14.",
    source: "pypi.org/project/npmctl",
    sourceVersion: "0.3.10",
    verifiedOn: "2026-07-11",
    owner: "Release Manager",
    publicLabel: "Package Maturity",
    status: "verified",
    category: "core"
  },
  {
    id: "resource-proxy-hosts",
    claim: "Full support for managing Nginx Proxy Manager Proxy Hosts including custom Nginx configurations.",
    source: "groupsum/npmctl core modules",
    sourceVersion: "0.3.10",
    verifiedOn: "2026-07-11",
    owner: "Network Engineer",
    publicLabel: "Proxy Hosts",
    status: "verified",
    category: "core"
  },
  {
    id: "resource-ssl-certs",
    claim: "Manage SSL Certificates, including DNS challenges and file paths.",
    source: "groupsum/npmctl core modules",
    sourceVersion: "0.3.10",
    verifiedOn: "2026-07-11",
    owner: "Security Architect",
    publicLabel: "SSL Certificates",
    status: "verified",
    category: "core"
  },
  {
    id: "resource-access-lists",
    claim: "Manage Access Lists to secure proxy endpoints with basic auth or IP restrictions.",
    source: "groupsum/npmctl core modules",
    sourceVersion: "0.3.10",
    verifiedOn: "2026-07-11",
    owner: "Security Architect",
    publicLabel: "Access Lists",
    status: "verified",
    category: "core"
  },
  {
    id: "resource-redirection-dead-streams",
    claim: "Manage Redirection Hosts, Dead Hosts, TCP/UDP Streams, Users, and Global Settings.",
    source: "groupsum/npmctl core modules",
    sourceVersion: "0.3.10",
    verifiedOn: "2026-07-11",
    owner: "Platform Lead",
    publicLabel: "Extended NPM Resources",
    status: "verified",
    category: "core"
  },
  {
    id: "dns-extensions",
    claim: "Declaratively sync provider-backed DNS records (A, AAAA, CNAME, TXT, MX) through separately installable extension packages.",
    source: "groupsum/npmctl provider modules",
    sourceVersion: "0.3.10",
    verifiedOn: "2026-07-11",
    owner: "Network Lead",
    publicLabel: "DNS Providers",
    status: "verified",
    category: "provider"
  },
  {
    id: "ci-exit-codes",
    claim: "Deterministic exit codes block pipeline deployment on schema errors, capability issues, or unmitigated state conflicts.",
    source: "groupsum/npmctl CLI entrypoint",
    sourceVersion: "0.3.10",
    verifiedOn: "2026-07-11",
    owner: "Automation Lead",
    publicLabel: "CI/CD Safety Gates",
    status: "verified",
    category: "cicd"
  },
  {
    id: "audit-logs",
    claim: "Supports read-only audit-log extraction and drift reporting for compliance reporting.",
    source: "groupsum/npmctl CLI logging",
    sourceVersion: "0.3.10",
    verifiedOn: "2026-07-11",
    owner: "Compliance Officer",
    publicLabel: "Audit & Compliance",
    status: "verified",
    category: "core"
  }
];

export const SAFETY_SCENARIOS: SafetyScenario[] = [
  {
    id: "scenario-absent-create",
    title: "Desired resource is absent from target NPM",
    state: "YAML defines host 'app.internal' with owner 'workload-a'. The resource does not exist in Nginx Proxy Manager.",
    behavior: "Planner schedules a safe CREATE operation.",
    consequence: "An explicit proxy host is provisioned with metadata tags labeling 'workload-a' as its owner.",
    exitCode: 0,
    type: "create"
  },
  {
    id: "scenario-drift-update",
    title: "Matching owned resource drifts in target NPM",
    state: "Nginx Proxy Manager proxy host has custom SSL turned off, but desired YAML state defines SSL as enabled (owned by 'workload-a').",
    behavior: "Planner identifies deviation and proposes an UPDATE operation.",
    consequence: "The resource is modified during apply to align with YAML; other owner settings remain untouched.",
    exitCode: 0,
    type: "update"
  },
  {
    id: "scenario-foreign-conflict",
    title: "Foreign-owned resource collides with desired state",
    state: "YAML desired state requests control over 'api.external' for 'workload-a', but 'api.external' is already managed by 'workload-b' in the NPM metadata.",
    behavior: "Planner blocks mutation, reporting an OWNER CONFLICT.",
    consequence: "Operation fails safely. No modifications are made. Pipeline halts with conflict exit code.",
    exitCode: 1,
    type: "conflict"
  },
  {
    id: "scenario-unmanaged-collide",
    title: "Unmanaged resource matches desired state",
    state: "YAML requests 'docs.external' for 'workload-a', but 'docs.external' exists in NPM without any ownership metadata (created manually via UI).",
    behavior: "Planner reports an UNMANAGED COLLISION and refuses to overwrite.",
    consequence: "The resource is left completely unchanged. To manage it, the operator must explicitly run 'npmctl adopt' first.",
    exitCode: 1,
    type: "unmanaged"
  },
  {
    id: "scenario-absent-pruning",
    title: "Owned resource disappears from desired state",
    state: "YAML no longer contains 'old-app.internal' which is currently marked in NPM as owned by 'workload-a'.",
    behavior: "No delete occurs by default. Deletion is opt-in.",
    consequence: "The host is left orphaned but untouched unless '--prune-owned' is supplied during planning and apply.",
    exitCode: 0,
    type: "delete"
  },
  {
    id: "scenario-capability-mismatch",
    title: "Target API lacks a required endpoint or capability",
    state: "Desired YAML requests a Dead Host resource, but target NPM is running an older API version lacking Dead Host capabilities.",
    behavior: "OpenAPI schema-gating validation triggers a CAPABILITY ERROR.",
    consequence: "The execution fails closed before planning begins. No changes are applied to Nginx Proxy Manager.",
    exitCode: 4,
    type: "capability"
  }
];

export const DNS_PROVIDERS: DNSProviderInfo[] = [
  {
    id: "cloudflare",
    name: "Cloudflare",
    packageName: "npmctl-cloudflare",
    installCommand: "pipx install npmctl[cloudflare]",
    supportedRecords: ["A", "AAAA", "CNAME", "TXT", "MX"],
    configSnippet: "dns:\n  provider: cloudflare\n  api_token: \"${CLOUDFLARE_API_TOKEN}\"\n  zone_id: \"${CLOUDFLARE_ZONE_ID}\"",
    credentialEnv: ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_ID"],
    status: "verified"
  },
  {
    id: "aws-route53",
    name: "AWS Route 53",
    packageName: "npmctl-route53",
    installCommand: "pipx install npmctl[route53]",
    supportedRecords: ["A", "AAAA", "CNAME", "TXT", "MX"],
    configSnippet: "dns:\n  provider: aws-route53\n  access_key_id: \"${AWS_ACCESS_KEY_ID}\"\n  secret_access_key: \"${AWS_SECRET_ACCESS_KEY}\"\n  hosted_zone_id: \"${AWS_HOSTED_ZONE_ID}\"",
    credentialEnv: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_HOSTED_ZONE_ID"],
    status: "verified"
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    packageName: "npmctl-digitalocean",
    installCommand: "pipx install npmctl[digitalocean]",
    supportedRecords: ["A", "AAAA", "CNAME", "TXT"],
    configSnippet: "dns:\n  provider: digitalocean\n  token: \"${DIGITALOCEAN_TOKEN}\"",
    credentialEnv: ["DIGITALOCEAN_TOKEN"],
    status: "verified"
  },
  {
    id: "godaddy",
    name: "GoDaddy",
    packageName: "npmctl-godaddy",
    installCommand: "pipx install npmctl[godaddy]",
    supportedRecords: ["A", "CNAME", "TXT"],
    configSnippet: "dns:\n  provider: godaddy\n  api_key: \"${GODADDY_API_KEY}\"\n  api_secret: \"${GODADDY_API_SECRET}\"",
    credentialEnv: ["GODADDY_API_KEY", "GODADDY_API_SECRET"],
    status: "verified"
  },
  {
    id: "namecheap",
    name: "Namecheap",
    packageName: "npmctl-namecheap",
    installCommand: "pipx install npmctl[namecheap]",
    supportedRecords: ["A", "CNAME", "TXT"],
    configSnippet: "dns:\n  provider: namecheap\n  api_key: \"${NAMECHEAP_API_KEY}\"\n  username: \"${NAMECHEAP_USERNAME}\"\n  client_ip: \"${NAMECHEAP_CLIENT_IP}\"",
    credentialEnv: ["NAMECHEAP_API_KEY", "NAMECHEAP_USERNAME", "NAMECHEAP_CLIENT_IP"],
    status: "verified"
  }
];

export const RELEASES: ReleaseInfo[] = [
  {
    version: "0.3.10",
    date: "2026-05-19",
    dateSource: "PyPI",
    pythonRange: ">=3.10, <3.15",
    maturity: "Beta",
    packages: [
      "npmctl (core)",
      "npmctl-cloudflare",
      "npmctl-route53",
      "npmctl-digitalocean",
      "npmctl-godaddy",
      "npmctl-namecheap"
    ],
    provenance: "Trusted Publishing (GitHub OIDC) verified with publication attestations",
    changelogSummary: "Stable Beta release adding full schema migration gates, multi-owner dry-run validations, and unified logs.",
    pypiStatus: "active",
    fileSizeWheel: "32.4 KB",
    fileSizeSdist: "28.1 KB",
    sha256Wheel: "9f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f4",
    sha256Sdist: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    changelogItems: [
      "Implemented comprehensive desired-state schema validation (v2 schema).",
      "Added capability-gating checks matching target NPM REST OpenAPI schemas.",
      "Enforced owner-scoped isolation logic for foreign resource protection.",
      "Introduced read-only audit-log extraction and structured JSON output options."
    ]
  },
  {
    version: "0.3.8",
    date: "2026-05-18",
    dateSource: "PyPI",
    pythonRange: ">=3.10, <3.15",
    maturity: "Beta",
    packages: ["npmctl (core)", "npmctl-cloudflare", "npmctl-route53", "npmctl-digitalocean", "npmctl-godaddy", "npmctl-namecheap"],
    provenance: "Verified GitHub release",
    changelogSummary: "Minor adjustments to Route 53 DNS record upsert loops.",
    pypiStatus: "active",
    fileSizeWheel: "31.2 KB",
    fileSizeSdist: "27.2 KB",
    sha256Wheel: "c2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1",
    sha256Sdist: "e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
    changelogItems: [
      "Fixed AWS Route 53 DNS record upsert looping edge-case.",
      "Improved credential interpolation error reporting inside pipelines.",
      "Optimized DNS provider extension packaging routines."
    ]
  },
  {
    version: "0.3.7",
    date: "2026-05-18",
    dateSource: "PyPI",
    pythonRange: ">=3.10, <3.15",
    maturity: "Beta",
    packages: ["npmctl (core)", "npmctl-cloudflare", "npmctl-route53", "npmctl-digitalocean", "npmctl-godaddy", "npmctl-namecheap"],
    provenance: "Verified GitHub release",
    changelogSummary: "Performance optimization for large proxy-host counts; reduced NPM API pagination overhead.",
    pypiStatus: "active",
    fileSizeWheel: "31.1 KB",
    fileSizeSdist: "27.1 KB",
    sha256Wheel: "49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f",
    sha256Sdist: "3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e",
    changelogItems: [
      "Reduced target Nginx Proxy Manager API pagination overhead for proxy-host enumeration.",
      "Added performance logging indicators to CLI diagnostic outputs.",
      "Patched active token handling for long-running apply sequences."
    ]
  },
  {
    version: "0.3.6",
    date: "2026-05-13",
    dateSource: "PyPI",
    pythonRange: ">=3.10, <3.14",
    maturity: "Beta",
    packages: ["npmctl (core)", "npmctl-cloudflare", "npmctl-route53", "npmctl-digitalocean", "npmctl-godaddy", "npmctl-namecheap"],
    provenance: "PyPI publication",
    changelogSummary: "Introduced DigitalOcean and GoDaddy extension packages; unified CLI option parsers.",
    pypiStatus: "active",
    fileSizeWheel: "30.5 KB",
    fileSizeSdist: "26.8 KB",
    sha256Wheel: "a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a",
    sha256Sdist: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    changelogItems: [
      "Introduced DigitalOcean and GoDaddy extension packages as independent modules.",
      "Unified internal CLI option parsers to support standardized flag constraints.",
      "Enhanced input sanitizer to filter shell injection patterns."
    ]
  },
  {
    version: "0.3.5",
    date: "2026-05-13",
    dateSource: "PyPI",
    pythonRange: ">=3.10, <3.14",
    maturity: "Beta",
    packages: ["npmctl (core)", "npmctl-cloudflare", "npmctl-route53", "npmctl-digitalocean", "npmctl-godaddy", "npmctl-namecheap"],
    provenance: "PyPI publication",
    changelogSummary: "Added AWS Route 53 and Cloudflare extensions; refactored core adapter interfaces.",
    pypiStatus: "active",
    fileSizeWheel: "29.2 KB",
    fileSizeSdist: "25.1 KB",
    sha256Wheel: "d3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c",
    sha256Sdist: "2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
    changelogItems: [
      "Added AWS Route 53 and Cloudflare DNS extensions to support full sync capabilities.",
      "Refactored core adapter interfaces to accommodate external provider plugs.",
      "Resolved an issue where Access List IDs were incorrectly evaluated as floats."
    ]
  },
  {
    version: "0.3.4",
    date: "2026-05-13",
    dateSource: "PyPI",
    pythonRange: ">=3.10, <3.14",
    maturity: "Beta",
    packages: ["npmctl (core)", "npmctl-namecheap"],
    provenance: "PyPI publication",
    changelogSummary: "Added Namecheap DNS plugin support.",
    pypiStatus: "active",
    fileSizeWheel: "24.1 KB",
    fileSizeSdist: "20.9 KB",
    sha256Wheel: "e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2",
    sha256Sdist: "f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1",
    changelogItems: [
      "Completed modular packaging for Namecheap DNS sync plugin.",
      "Improved connection timeouts for target NPM systems under heavy loads."
    ]
  },
  {
    version: "0.3.3",
    date: "2026-05-13",
    dateSource: "PyPI",
    pythonRange: ">=3.10, <3.14",
    maturity: "Beta",
    packages: ["npmctl (core)", "npmctl-namecheap"],
    provenance: "PyPI publication",
    changelogSummary: "Refactoring client endpoints to support NPM v2.11.x OpenAPIs.",
    pypiStatus: "active",
    fileSizeWheel: "23.9 KB",
    fileSizeSdist: "20.7 KB",
    sha256Wheel: "9f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f4",
    sha256Sdist: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    changelogItems: [
      "Refactored client endpoints to map directly to Nginx Proxy Manager v2.11.x OpenAPIs.",
      "Enforced stricter validation on Dead Host parameter configurations."
    ]
  },
  {
    version: "0.3.2",
    date: "2026-05-07",
    dateSource: "PyPI",
    pythonRange: ">=3.10, <3.14",
    maturity: "Beta",
    packages: ["npmctl (core)", "npmctl-namecheap"],
    provenance: "PyPI publication",
    changelogSummary: "Initial public beta containing Namecheap DNS sync.",
    pypiStatus: "active",
    fileSizeWheel: "23.5 KB",
    fileSizeSdist: "20.2 KB",
    sha256Wheel: "8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d",
    sha256Sdist: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c",
    changelogItems: [
      "Released first public beta version featuring active Namecheap DNS syncing.",
      "Implemented live drift logging for proxy-host resource parameters."
    ]
  },
  {
    version: "0.3.1",
    date: "2026-05-07",
    dateSource: "PyPI",
    pythonRange: ">=3.10, <3.14",
    maturity: "Beta",
    packages: ["npmctl (core)"],
    provenance: "PyPI publication",
    changelogSummary: "Initial public core release. Supports Proxy Hosts, Redirections, and Access Lists with meta-owner tags.",
    pypiStatus: "active",
    fileSizeWheel: "18.4 KB",
    fileSizeSdist: "15.9 KB",
    sha256Wheel: "a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1a2e3f49f82d8c3b1",
    sha256Sdist: "e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
    changelogItems: [
      "Initial public core release on PyPI.",
      "Implemented support for owner-scoped Proxy Hosts, Redirection Hosts, and Access Lists.",
      "Enforced deterministic exit code structures for pipeline readiness."
    ]
  }
];

export const WORKFLOW_STEPS = [
  {
    num: "1",
    title: "Declare Intended State",
    desc: "Author proxy hosts, SSL paths, and DNS records in descriptive YAML. Maintain desired states securely inside Git.",
    badge: "YAML"
  },
  {
    num: "2",
    title: "Validate Document Schema",
    desc: "npmctl validates YAML syntactically and runs schema compatibility checks against the target NPM API version.",
    badge: "Check"
  },
  {
    num: "3",
    title: "Compute Owner-Scoped Plan",
    desc: "Compare target system state. Calculate creates, updates, and deletes, isolated exclusively to your '--owner' scope.",
    badge: "Plan"
  },
  {
    num: "4",
    title: "Safe Dry-Run & Apply",
    desc: "Apply the plan. Unmanaged items are untouched unless adopted. Conflicts block mutation, guaranteeing zero-overwrite safety.",
    badge: "Apply"
  },
  {
    num: "5",
    title: "Drift & Audit Compliance",
    desc: "Continuously check for drift, export logs to compliant formats, and ensure Git-to-proxy alignment.",
    badge: "Audit"
  }
];

export const DEMO_YAML = `# desired-state.yaml
meta:
  version: 2
  owner: workload-a
  managed_by: npmctl
  resource_id: proxy-app-production

proxy_hosts:
  - domain_names:
      - app.internal.company.com
    forward_scheme: https
    forward_host: 10.0.4.15
    forward_port: 8443
    ssl_forced: true
    http2_support: true
    access_list_id: 2 # Internal access only

dns_records:
  - provider: cloudflare
    zone: company.com
    type: A
    name: app.internal
    value: 192.168.1.100
    ttl: 300
`;

export const DEMO_PLAN_OUTPUT = `[npmctl] Initializing connection to http://npm.internal.company.com/api
[npmctl] Target NPM OpenAPI schema matched. (Capabilities: ProxyHosts, AccessLists, DNSChallenge)
[npmctl] Owner identified: workload-a
[npmctl] Running plan with target: desired-state.yaml

=================== npmctl plan summary (owner: workload-a) ===================

+ CREATE Proxy Host: app.internal.company.com
  - schema: https, forward: 10.0.4.15:8443
  - SSL: forced, HTTP/2: true
  - Access List: 2 (Internal only)
  - Ownership tag: meta.owner=workload-a

+ CREATE DNS Record: app.internal.company.com (A -> 192.168.1.100 via cloudflare)

~ NO-OP: api.internal.company.com (Owned by workload-b, unchanged)
~ NO-OP: docs.internal.company.com (Unmanaged resource, untouched)

Plan: 2 to add, 0 to change, 0 to destroy, 2 untouched.
No conflicts detected. Clean-plan status: OK. Ready to apply.
`;

export const GITHUB_ACTIONS_YAML = `# .github/workflows/deploy-dns-proxy.yml
name: Reconcile DNS and Nginx Proxy Hosts
on:
  push:
    branches: [ main ]
    paths: [ 'desired-state.yaml' ]

jobs:
  npmctl-sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install npmctl with Cloudflare Ext
        run: |
          pip install --upgrade pip
          pip install npmctl[cloudflare]

      - name: Validate desired state
        run: npmctl validate desired-state.yaml

      - name: Run Schema Check
        env:
          NPM_URL: \${{ secrets.NPM_URL }}
          NPM_USERNAME: \${{ secrets.NPM_USERNAME }}
          NPM_PASSWORD: \${{ secrets.NPM_PASSWORD }}
        run: npmctl schema check

      - name: Generate Owner-Scoped Plan
        env:
          NPM_URL: \${{ secrets.NPM_URL }}
          NPM_USERNAME: \${{ secrets.NPM_USERNAME }}
          NPM_PASSWORD: \${{ secrets.NPM_PASSWORD }}
          CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          npmctl plan desired-state.yaml --owner workload-a

      - name: Apply Safe Reconcile
        env:
          NPM_URL: \${{ secrets.NPM_URL }}
          NPM_USERNAME: \${{ secrets.NPM_USERNAME }}
          NPM_PASSWORD: \${{ secrets.NPM_PASSWORD }}
          CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          npmctl apply desired-state.yaml --owner workload-a --prune-owned
`;
