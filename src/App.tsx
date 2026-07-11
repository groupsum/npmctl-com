/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Terminal, ShieldCheck, ShieldAlert, Key, Code, 
  HelpCircle, Server, Check, Copy, ArrowRight, 
  Layers, Lock, Play, Github, Download, FileText, 
  Settings, CheckCircle2, AlertTriangle, Users, Cpu, FileCheck2
} from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import SEOHandler from './components/SEOHandler';
import CodeSnippet from './components/CodeSnippet';
import GitOpsLoop from './components/GitOpsLoop';
import SafetySimulator from './components/SafetySimulator';
import ProviderGrid from './components/ProviderGrid';
import ReleaseTimeline from './components/ReleaseTimeline';
import { PRODUCT_CLAIMS, WORKFLOW_STEPS, GITHUB_ACTIONS_YAML } from './content';

export default function App() {
  const [route, setRoute] = useState(() => {
    const currentHash = window.location.hash;
    if (!currentHash || currentHash === '#/') return 'home';
    const cleanRoute = currentHash.replace('#/', '');
    return ['product', 'safety', 'providers', 'docs', 'releases'].includes(cleanRoute) ? cleanRoute : 'home';
  });

  const [activeDocTab, setActiveDocTab] = useState<'bash' | 'powershell'>('bash');
  const [pypiCopied, setPypiCopied] = useState(false);
  const [installMethod, setInstallMethod] = useState<'uv' | 'pipx' | 'pip'>('uv');
  const [docsInstallMethod, setDocsInstallMethod] = useState<'uv' | 'pipx' | 'pip'>('uv');

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      if (!currentHash || currentHash === '#/') {
        setRoute('home');
      } else {
        const cleanRoute = currentHash.replace('#/', '');
        if (['product', 'safety', 'providers', 'docs', 'releases'].includes(cleanRoute)) {
          setRoute(cleanRoute);
        } else {
          setRoute('home');
        }
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCopyPypi = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setPypiCopied(true);
      setTimeout(() => setPypiCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavToRoute = (id: string) => {
    setRoute(id);
    window.location.hash = id === 'home' ? '/' : `#/${id}`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans antialiased selection:bg-brand-green/30 selection:text-white">
      {/* Dynamic Title, Meta, and JSON-LD structured data handler */}
      <SEOHandler route={route} />

      {/* Persistent Nav Header */}
      <Header currentRoute={route} setRoute={setRoute} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-grow">
        
        {/* ==================================================================== */}
        {/* VIEW: HOME PAGE                                                      */}
        {/* ==================================================================== */}
        {route === 'home' && (
          <div className="animate-fadeIn">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 lg:py-24 border-b border-slate-900 bg-radial-[at_top_center] from-slate-900/40 via-transparent to-transparent">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                
                {/* PyPI Release Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 font-mono text-[11px] text-slate-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-green"></span>
                  </span>
                  <span>Beta on PyPI</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-semibold">v0.3.10</span>
                </div>

                {/* Main Heading */}
                <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
                  GitOps safety for <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-emerald-400 to-teal-400">
                    Nginx Proxy Manager
                  </span>
                </h1>

                {/* Subtitle / Approved definition */}
                <p className="mt-6 max-w-2xl mx-auto font-sans text-sm sm:text-base text-slate-400 leading-relaxed">
                  Declare proxy, certificate, access list, and DNS state in YAML. 
                  Validate document capabilities, compute an owner-scoped plan, 
                  and apply safe reconciles without manual UI errors.
                </p>

                {/* Quick install and CTA area */}
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <button
                    onClick={() => handleNavToRoute('docs')}
                    className="flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-green px-6 font-display text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 hover:scale-[1.01]"
                  >
                    <Download className="h-4 w-4" />
                    <span>Install npmctl v0.3.10</span>
                  </button>

                  <a
                    href="#interactive-workspace"
                    className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-6 font-display text-xs font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                  >
                    <Terminal className="h-4 w-4" />
                    <span>View a plan</span>
                  </a>
                </div>

                {/* Interactive Multi-Installer Selector (uv, pipx, pip in that order) */}
                <div className="mt-8 max-w-md mx-auto space-y-3">
                  <div className="flex justify-center gap-1.5">
                    {(['uv', 'pipx', 'pip'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setInstallMethod(method)}
                        className={`px-3 py-1 text-[11px] font-mono rounded-md border transition-all cursor-pointer ${
                          installMethod === method
                            ? 'bg-brand-green/10 text-brand-green border-brand-green/30 font-bold'
                            : 'bg-slate-900/40 text-slate-400 border-slate-850 hover:text-slate-200'
                        }`}
                      >
                        {method === 'uv' ? 'uv (recommended)' : method}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-lg border border-slate-850 bg-slate-900/40 p-1.5 flex items-center justify-between font-mono text-[11px] text-slate-400 focus-within:border-brand-green/40">
                    <span className="pl-3 truncate flex items-center gap-1.5">
                      <span className="text-brand-green select-none">$</span>
                      <span>
                        {installMethod === 'uv' && 'uv tool install npmctl'}
                        {installMethod === 'pipx' && 'pipx install npmctl'}
                        {installMethod === 'pip' && 'pip install --user npmctl'}
                      </span>
                    </span>
                    <button
                      onClick={() => handleCopyPypi(
                        installMethod === 'uv' ? 'uv tool install npmctl' :
                        installMethod === 'pipx' ? 'pipx install npmctl' :
                        'pip install --user npmctl'
                      )}
                      className="flex items-center gap-1 rounded bg-slate-950 px-2.5 py-1.5 text-[10px] text-slate-300 hover:bg-slate-900 hover:text-white transition-all outline-none focus-visible:ring-1 focus-visible:ring-brand-green cursor-pointer"
                      aria-label={`Copy ${installMethod} installation command`}
                    >
                      {pypiCopied ? (
                        <>
                          <Check className="h-3 w-3 text-brand-green" />
                          <span className="text-brand-green">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-[10px] font-mono text-slate-600">
                  Prerequisites: Python 3.10–3.14 & access credentials for Nginx Proxy Manager API.
                </p>

              </div>
            </section>

            {/* Workflow Section */}
            <section className="py-16 border-b border-slate-900">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-green font-bold">
                    The GitOps Cycle
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                    From YAML to a safe reconcile
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-slate-400">
                    Replace risky click-ops and brittle custom API scripts. npmctl implements a strict validation cycle.
                  </p>
                </div>

                {/* Five step sequence cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-12">
                  {WORKFLOW_STEPS.map((step) => (
                    <div key={step.num} className="relative flex flex-col rounded-xl border border-slate-900 bg-slate-900/20 p-5">
                      <span className="absolute right-4 top-4 font-mono text-2xl font-extrabold text-slate-800/50">
                        {step.num}
                      </span>
                      <span className="self-start rounded bg-brand-green/10 border border-brand-green/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-brand-green uppercase tracking-wide mb-4">
                        {step.badge}
                      </span>
                      <h4 className="font-display text-xs font-bold text-slate-200">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-[11px] text-slate-500 leading-relaxed flex-1">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Embedded GitOps Loop Simulator */}
                <GitOpsLoop />

              </div>
            </section>

            {/* Safety Model Explainer */}
            <section className="py-16 border-b border-slate-900 bg-slate-900/10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                  
                  {/* Left Column: Visual scenario or model summary */}
                  <div className="lg:col-span-5 space-y-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-amber font-bold block">
                      Protected Boundaries
                    </span>
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      Owner-Scoped Isolation
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      npmctl's core differentiator is a rigid **ownership metadata paradigm**. Every resource managed through YAML is stamped with designated owner attributes in NPM's configuration tables.
                    </p>

                    <div className="space-y-4">
                      <div className="flex gap-3 items-start">
                        <div className="mt-1 rounded bg-brand-green/10 p-1.5 text-brand-green">
                          <Lock className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">Foreign Resource Protection</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            Resources carrying other owner identifiers remain fully immutable and unmodifiable by the active pipeline, eliminating cross-team overwrites.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <div className="mt-1 rounded bg-brand-amber/10 p-1.5 text-brand-amber">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">Zero Overwrites for Manual Items</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            If a desired proxy matches a manually clicked item in NPM, npmctl treats it as an Unmanaged Collision, safely skipping mutation until explicitly adopted.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <div className="mt-1 rounded bg-brand-green/10 p-1.5 text-brand-green">
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">Opt-in Pruning</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            Absent resources are never deleted automatically unless `--prune-owned` is passed, ensuring typos in desired-state configuration don't cause sudden outages.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => handleNavToRoute('safety')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:text-emerald-400 group"
                        aria-label="View all safety scenarios"
                      >
                        <span>Explore our Safety Scenarios</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Code/Rules preview */}
                  <div className="lg:col-span-7 rounded-xl border border-slate-850 bg-slate-950 p-6 shadow-xl">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1">
                      Resource Ownership Metadata Tags
                    </span>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      npmctl maps these three metadata parameters to identify ownership states during planning:
                    </p>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg bg-slate-900 p-4 border border-slate-850">
                        <code className="text-brand-green font-semibold text-xs block">meta.managed_by</code>
                        <span className="block text-[10px] text-slate-500 mt-1 uppercase font-bold">Identifier</span>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                          Always set to `npmctl` to identify declarative origin.
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-900 p-4 border border-slate-850">
                        <code className="text-brand-blue font-semibold text-xs block">meta.owner</code>
                        <span className="block text-[10px] text-slate-500 mt-1 uppercase font-bold">Owner Scope</span>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                          Identifies the managing team or micro-service owner tag.
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-900 p-4 border border-slate-850">
                        <code className="text-brand-amber font-semibold text-xs block">meta.resource_id</code>
                        <span className="block text-[10px] text-slate-500 mt-1 uppercase font-bold">Uniqueness</span>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                          A unique hash identifying the state representation in Git.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-slate-900/40 border border-slate-850">
                      <h4 className="font-display text-xs font-bold text-slate-300">OpenAPI Validation Gateways</h4>
                      <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                        Before plan computation, npmctl issues health checks and matches target NPM schemas. If your YAML contains dead hosts or proxy features missing from target NPM version APIs, execution fails closed instantly.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Nginx Proxy Manager Resource Focus Section */}
            <section className="py-16 border-b border-slate-900 bg-slate-900/10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-6 space-y-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-green font-bold block">
                      Target Core Infrastructure
                    </span>
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      Nginx Proxy Manager Resource Focus
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      npmctl operates with a strict, dedicated focus on managing and reconciling Nginx Proxy Manager (NPM) admin resources. It is entirely independent of the JavaScript package registry or Node/JS package installations. 
                      It manages the entire NPM resource model safely through GitOps workflows:
                    </p>
                    
                    <div className="grid gap-4 sm:grid-cols-2 pt-2">
                      <div className="border border-slate-850 rounded-lg p-4 bg-slate-950">
                        <span className="font-mono text-xs font-bold text-brand-green block">NPM Native Core</span>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Synchronizes Proxy Hosts, SSL Certs, Access Lists, Redirections, TCP/UDP Streams, and Admin settings.
                        </p>
                      </div>
                      <div className="border border-slate-850 rounded-lg p-4 bg-slate-950">
                        <span className="font-mono text-xs font-bold text-brand-amber block">Isolated DNS Records</span>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Deploy external DNS record updates side-by-side with proxy rules using pluggable extensions.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-6 rounded-xl border border-slate-850 bg-slate-950 p-6 space-y-4">
                    <h4 className="font-display text-xs font-bold text-slate-200 uppercase tracking-wide">
                      Declarative Action Model
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Every operation maps exactly to Nginx Proxy Manager API resources. npmctl performs connection checks, validates schemas, and validates ownership metadata to block manual overwrites:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-xs text-slate-300 font-mono bg-slate-900/60 p-2.5 rounded border border-slate-850/60">
                        <div className="h-2 w-2 rounded-full bg-brand-green animate-pulse"></div>
                        <span>Core Proxy Hosts & SSL Challenges</span>
                        <span className="text-slate-600 text-[10px] ml-auto">100% Declarative CRUD</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-slate-300 font-mono bg-slate-900/60 p-2.5 rounded border border-slate-850/60">
                        <div className="h-2 w-2 rounded-full bg-brand-green animate-pulse"></div>
                        <span>Access Rules & Dead Hosts</span>
                        <span className="text-slate-600 text-[10px] ml-auto">Immutable if Foreign</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-slate-300 font-mono bg-slate-900/60 p-2.5 rounded border border-slate-850/60">
                        <div className="h-2 w-2 rounded-full bg-brand-amber animate-pulse"></div>
                        <span>Multi-Cloud Pluggable DNS Loops</span>
                        <span className="text-slate-600 text-[10px] ml-auto">Opt-in Extensions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Managed Resources Inventory */}
            <section className="py-16 border-b border-slate-900">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-green font-bold">
                    Resource Coverage
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                    Comprehensive NPM API support
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-slate-400">
                    Manage the entire lifecyle of Nginx Proxy Manager objects declaratively.
                  </p>
                </div>

                {/* Resource grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-5 flex flex-col gap-3">
                    <Server className="h-6 w-6 text-brand-green" />
                    <h3 className="font-display text-sm font-bold text-slate-200">Proxy Hosts</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Map domains, custom Nginx location paths, HTTP/2 constraints, websockets support, and forward variables.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-5 flex flex-col gap-3">
                    <CheckCircle2 className="h-6 w-6 text-brand-green" />
                    <h3 className="font-display text-sm font-bold text-slate-200">SSL Certificates</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Deploy and automate Let's Encrypt registrations, custom path file references, and DNS-challenge settings.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-5 flex flex-col gap-3">
                    <Lock className="h-6 w-6 text-brand-green" />
                    <h3 className="font-display text-sm font-bold text-slate-200">Access Lists</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Declare custom Basic Authentication boundaries, bypass parameters, and fine-grained IP address allow lists.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-5 flex flex-col gap-3">
                    <Layers className="h-6 w-6 text-brand-green" />
                    <h3 className="font-display text-sm font-bold text-slate-200">Redirection Hosts</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Configure HTTP redirects (301/302 permanent or temporary) and preserve URI routes safely across domains.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-5 flex flex-col gap-3">
                    <AlertTriangle className="h-6 w-6 text-brand-green" />
                    <h3 className="font-display text-sm font-bold text-slate-200">Dead Hosts</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Enforce explicit 404 response pages for deprecated endpoints, keeping your routing clean.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-5 flex flex-col gap-3">
                    <Cpu className="h-6 w-6 text-brand-green" />
                    <h3 className="font-display text-sm font-bold text-slate-200">TCP & UDP Streams</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Forward raw TCP/UDP streams (such as database connections or MQTT queues) over custom ingress ports.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-5 flex flex-col gap-3">
                    <Users className="h-6 w-6 text-brand-green" />
                    <h3 className="font-display text-sm font-bold text-slate-200">NPM Users</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Manage administrator accounts, emails, permissions, and scopes across NPM.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-5 flex flex-col gap-3">
                    <Settings className="h-6 w-6 text-brand-green" />
                    <h3 className="font-display text-sm font-bold text-slate-200">Global Settings</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Reconcile default proxy settings, custom fallback rules, and NPM API configurations.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* DNS Provider Extensions Banner */}
            <section className="py-16 border-b border-slate-900 bg-slate-900/10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 max-w-xl">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-amber font-bold block">
                      DNS Synchronization
                    </span>
                    <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                      Provider-Backed DNS extensions
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      In addition to NPM proxy hosts, npmctl synchronizes A, AAAA, CNAME, TXT, and MX records via separately installable packages for Cloudflare, AWS Route 53, DigitalOcean, GoDaddy, and Namecheap.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleNavToRoute('providers')}
                    className="shrink-0 flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-6 font-display text-xs font-bold text-slate-100 transition-all hover:bg-slate-800"
                    aria-label="View DNS extensions"
                  >
                    <span>View all 5 providers</span>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </button>
                </div>
              </div>
            </section>

            {/* CI/CD Fit and GitHub Actions */}
            <section className="py-16 border-b border-slate-900">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                  
                  {/* Left: Explainer */}
                  <div className="lg:col-span-5 space-y-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-green font-bold block">
                      Automation Ready
                    </span>
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      Built for GitOps Pipelines
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      npmctl operates as a headless CLI designed for execution inside GitHub Actions, GitLab CI, or Jenkins. 
                      Every execution enforces deterministic outcomes and exits cleanly or errors immediately with precise status returns.
                    </p>

                    <ul className="space-y-3 text-xs text-slate-400">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-brand-green shrink-0" />
                        <span>**Deterministic Exit Codes** block deployment on conflicts.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-brand-green shrink-0" />
                        <span>**Structured JSON Output** simplifies custom auditing hooks.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-brand-green shrink-0" />
                        <span>**API Schema Verification** guards against unsupported operations.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Right: GitHub Actions YAML */}
                  <div className="lg:col-span-7">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1">
                      GitHub Actions Sync Pipeline
                    </span>
                    <CodeSnippet 
                      code={GITHUB_ACTIONS_YAML} 
                      language="yaml" 
                      showLineNumbers={true} 
                      label="GitHub Actions Reconcile" 
                    />
                  </div>

                </div>
              </div>
            </section>

            {/* Evidence & Project Provenance Strip */}
            <section className="py-16 bg-slate-950">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="border border-slate-900 rounded-xl bg-slate-900/10 p-6 flex flex-wrap justify-between items-center gap-6">
                  
                  <div>
                    <h4 className="font-display text-xs font-bold text-slate-300">Verified Project Provenance</h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-sm leading-relaxed">
                      npmctl is completely open source and distributed transparently via PyPI. Build artifacts are verified utilizing cryptographic GitHub OIDC publication attestations.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://github.com/groupsum/npmctl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900"
                    >
                      <Github className="h-4 w-4 text-slate-400" />
                      <span>github.com/groupsum/npmctl</span>
                    </a>

                    <a
                      href="https://pypi.org/project/npmctl/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900"
                    >
                      <Download className="h-4 w-4 text-slate-400" />
                      <span>pypi.org/project/npmctl</span>
                    </a>

                    <a
                      href="https://discord.gg/npmctl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900"
                    >
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>Discord Chat</span>
                    </a>
                  </div>

                </div>
              </div>
            </section>

          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW: PRODUCT PAGE                                                   */}
        {/* ==================================================================== */}
        {route === 'product' && (
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn" id="product-overview">
            <div className="mb-10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-green font-bold">
                Technical Specification
              </span>
              <h1 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Resource Model & Desired State Engine
              </h1>
              <p className="mt-3 text-sm text-slate-400 max-w-2xl leading-relaxed">
                npmctl wraps Nginx Proxy Manager's REST API into a robust declarative schema, allowing you to define, audit, and provision proxy architecture as structured documents.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              
              {/* Left column: specification cards */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Desired-state YAML Specification */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
                  <h3 className="font-display text-sm font-bold text-slate-200">
                    The Desired-State Schema v2
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    All document definitions utilize standard structured properties. At the root of every declarative file, a required `meta` block enforces owner boundary tags and structural version locks:
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="rounded-lg bg-slate-950 p-4 border border-slate-850 font-mono text-xs">
                      <span className="text-brand-green block">meta:</span>
                      <span className="pl-4 text-slate-300 block">version: 2 <span className="text-slate-500 italic"># Specifies schema validation engine</span></span>
                      <span className="pl-4 text-slate-300 block">owner: workload-a <span className="text-slate-500 italic"># Strictly isolates plan boundary</span></span>
                      <span className="pl-4 text-slate-300 block">managed_by: npmctl <span className="text-slate-500 italic"># Read-only tag checked on target API</span></span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    During a dry-run or apply execution, npmctl matches the `meta.owner` parameter with your CLI runtime constraints. Any discrepancy results in validation failure before any changes are computed.
                  </p>
                </div>

                {/* OpenAPI Compatibility Gating */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
                  <h3 className="font-display text-sm font-bold text-slate-200">
                    OpenAPI target validation gating
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Rather than blindly sending requests to the Nginx Proxy Manager endpoints, npmctl acts as an intelligent proxy client:
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-950 p-4 border border-slate-850">
                      <h4 className="font-display text-xs font-bold text-slate-300">Schema Check</h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        Validates your local YAML configuration against Nginx Proxy Manager's REST API contract, alerting you to syntax or property drift before provisioning.
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-950 p-4 border border-slate-850">
                      <h4 className="font-display text-xs font-bold text-slate-300">Capability Matching</h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        Matches your declared objects with active capabilities. If your target NPM is running an older build that doesn't support Dead Hosts or specific SSL challenges, the CLI safely aborts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Audit & Compliance Logging */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
                  <h3 className="font-display text-sm font-bold text-slate-200">
                    Compliance & Read-Only Audit logs
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When auditing is required, npmctl supports extracting historical data without modifying state. Run audit queries to verify system health and export audit log sequences cleanly in JSON format.
                  </p>
                  
                  <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-850 font-mono text-xs text-slate-400">
                    <span>$ npmctl audit --owner workload-a --format json</span>
                  </div>
                </div>

              </div>

              {/* Right column: CLI commands list */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">
                    Core CLI Interface
                  </h3>
                  
                  <div className="mt-4 space-y-4 text-xs">
                    <div>
                      <code className="text-brand-green font-semibold">npmctl validate</code>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        Validates YAML syntax, formatting parameters, and meta-block structures.
                      </p>
                    </div>

                    <div>
                      <code className="text-brand-green font-semibold">npmctl schema check</code>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        Queries the target NPM endpoint and validates property configurations.
                      </p>
                    </div>

                    <div>
                      <code className="text-brand-green font-semibold">npmctl plan</code>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        Compares YAML state with active NPM configs to compute safe creates and updates.
                      </p>
                    </div>

                    <div>
                      <code className="text-brand-green font-semibold">npmctl apply</code>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        Executes calculated plan operations securely, enforcing owner bounds.
                      </p>
                    </div>

                    <div>
                      <code className="text-brand-green font-semibold">npmctl adopt</code>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        Tags manual or unmanaged resources with the specified owner ID.
                      </p>
                    </div>

                    <div>
                      <code className="text-brand-green font-semibold">npmctl health</code>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        Performs network, configuration, and credentials diagnostic checks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW: SAFETY PAGE                                                    */}
        {/* ==================================================================== */}
        {route === 'safety' && (
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn" id="safety-model-archive">
            
            <div className="mb-10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-red font-bold">
                Collision Rules & Pipeline Integrity
              </span>
              <h1 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                The npmctl Safety Blueprint
              </h1>
              <p className="mt-3 text-sm text-slate-400 max-w-2xl leading-relaxed">
                Rather than treating safety as a toggle, npmctl is designed around a deterministic interceptor model. Every action is gated by strict ownership boundaries and exit codes.
              </p>
            </div>

            {/* Safety Simulation Container */}
            <section className="mb-12">
              <SafetySimulator />
            </section>

            {/* Exit Code Table */}
            <section className="mt-12 rounded-xl border border-slate-800 bg-slate-900/10 p-6 space-y-4">
              <h3 className="font-display text-sm font-bold text-slate-200">
                Deterministic Exit Code Contract
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                To guarantee zero-risk integrations within continuous deployment pipelines, npmctl returns explicit status codes. These signals indicate exactly why an operation succeeded, drifted, or was blocked:
              </p>

              <div className="overflow-x-auto rounded-lg border border-slate-850 bg-slate-950">
                <table className="w-full text-left font-mono text-xs text-slate-400 divide-y divide-slate-850">
                  <thead className="bg-slate-900 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Exit Code</th>
                      <th className="px-4 py-3">Classification</th>
                      <th className="px-4 py-3">Behavior & Triggering State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-brand-green">0</td>
                      <td className="px-4 py-3 font-semibold text-slate-300">Success / Clean</td>
                      <td className="px-4 py-3 text-slate-400 font-sans">
                        Operations executed successfully or calculated plan resulted in zero-change (No-Op).
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-brand-red">1</td>
                      <td className="px-4 py-3 font-semibold text-slate-300">Conflict / Collision</td>
                      <td className="px-4 py-3 text-slate-400 font-sans">
                        An active owner conflict (foreign ownership) or unmanaged collision was detected during plan validation. State mutation was immediately aborted.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-brand-amber">2</td>
                      <td className="px-4 py-3 font-semibold text-slate-300">Validation / Schema Error</td>
                      <td className="px-4 py-3 text-slate-400 font-sans">
                        Local YAML failed schema validations, structural constraints, or is syntactically invalid.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-400">3</td>
                      <td className="px-4 py-3 font-semibold text-slate-300">NPM API Error</td>
                      <td className="px-4 py-3 text-slate-400 font-sans">
                        Nginx Proxy Manager is down, refused connection, returned an invalid token, or issued a transient 5xx server failure.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-brand-amber">4</td>
                      <td className="px-4 py-3 font-semibold text-slate-300">Capability Mismatch</td>
                      <td className="px-4 py-3 text-slate-400 font-sans">
                        Target Nginx Proxy Manager build does not support the endpoints or properties declared in your desired-state YAML.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW: PROVIDERS PAGE                                                 */}
        {/* ==================================================================== */}
        {route === 'providers' && (
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn" id="provider-catalogue">
            
            <div className="mb-10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-amber font-bold">
                DNS Extension Directory
              </span>
              <h1 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                DNS Provider Integration
              </h1>
              <p className="mt-3 text-sm text-slate-400 max-w-2xl leading-relaxed">
                Separate DNS record synchronization from your reverse proxy operations. npmctl handles records on your target provider alongside Proxy Host deployments via modular packages.
              </p>
            </div>

            {/* Provider Grid */}
            <ProviderGrid />

            {/* Note about extensions */}
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/10 p-5">
              <h4 className="font-display text-xs font-bold text-slate-300">Important Package Separation Notice</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-3xl">
                To keep the core CLI install footprint small, DNS providers are packaged separately. Installing `npmctl` alone only provides Nginx Proxy Manager core resource controllers. Supply the bracket notation when executing installations (e.g. `npmctl[cloudflare]`) to automatically provision DNS dependencies.
              </p>
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW: DOCS PAGE                                                      */}
        {/* ==================================================================== */}
        {route === 'docs' && (
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn" id="documentation-hub">
            
            <div className="mb-10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-green font-bold">
                Get Started Guide
              </span>
              <h1 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Installation & First-Run Guide
              </h1>
              <p className="mt-3 text-sm text-slate-400 max-w-2xl leading-relaxed">
                Follow this guide to install npmctl, connect to your Nginx Proxy Manager instance, and deploy your first owner-scoped proxy hosts.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              
              {/* Left Column: walkthrough */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Prerequisites */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
                  <h3 className="font-display text-sm font-bold text-slate-200">
                    1. Verify Prerequisites
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Make sure your environment meets the following baseline configurations before installing:
                  </p>
                  
                  <ul className="space-y-2 text-xs text-slate-400 list-disc pl-5">
                    <li>**Python Compatibility**: Python version 3.10, 3.11, 3.12, 3.13, or 3.14.</li>
                    <li>**NPM API Access**: An accessible Nginx Proxy Manager instance with administrative or API token credentials.</li>
                    <li>**DNS credentials**: (Optional) API tokens for Cloudflare, Route 53, or other target DNS provider extensions.</li>
                  </ul>
                </div>

                {/* Installation Commands */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-200">
                        2. Installation & Environment Configuration
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Select your preferred package installer below. We strongly advise using isolated environment managers.
                      </p>
                    </div>
                    
                    {/* Installer selector */}
                    <div className="flex rounded-md bg-slate-950 p-0.5 border border-slate-800">
                      {(['uv', 'pipx', 'pip'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setDocsInstallMethod(method)}
                          className={`rounded px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                            docsInstallMethod === method ? 'bg-brand-green text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {docsInstallMethod === 'uv' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-brand-green/5 border border-brand-green/20 rounded-lg text-xs text-brand-green leading-relaxed">
                        <strong>Recommended Choice:</strong> `uv` is a blazing fast Python package installer and tool manager. It isolates npmctl instantly in a managed workspace environment, resolving conflicts flawlessly.
                      </div>
                      
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                          Install & Run Commands (uv)
                        </span>
                        
                        <CodeSnippet 
                          code={`# Install npmctl globally as an isolated tool\nuv tool install npmctl\n\n# Install with specific DNS provider extension (e.g., Cloudflare)\nuv tool install npmctl --with npmctl-cloudflare\n\n# Or run immediately without permanent installation\nuv run --with npmctl-cloudflare npmctl health`} 
                          language="bash" 
                          label="Installation via uv (Bash / PowerShell)" 
                        />
                      </div>
                    </div>
                  )}

                  {docsInstallMethod === 'pipx' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 leading-relaxed">
                        <strong>Isolated Tool Management:</strong> `pipx` installs and runs Python command-line applications in isolated virtual environments, ensuring system package compatibility.
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                          Install & Run Commands (pipx)
                        </span>

                        <CodeSnippet 
                          code={`# Install npmctl in a virtual environment\npipx install npmctl\n\n# Install with specific DNS provider extension (e.g., Cloudflare)\npipx install npmctl[cloudflare]\n\n# Verify your shell access path\nnpmctl --version`} 
                          language="bash" 
                          label="Installation via pipx (Bash / PowerShell)" 
                        />
                      </div>
                    </div>
                  )}

                  {docsInstallMethod === 'pip' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-brand-amber/5 border border-brand-amber/20 rounded-lg text-xs text-brand-amber leading-relaxed">
                        <strong>Standard Pip Installation:</strong> Standard `pip` installation adds npmctl to your user site-packages. Ensure you use the <code className="font-mono bg-slate-950 px-1 py-0.5 rounded text-slate-200">--user</code> flag to prevent permission issues.
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                          Install Commands (pip)
                        </span>

                        <CodeSnippet 
                          code={`# Install npmctl to user site-packages\npip install --user npmctl\n\n# Install with specific DNS provider extension (e.g., Cloudflare)\npip install --user npmctl[cloudflare]\n\n# Upgrade existing installation\npip install --user --upgrade npmctl`} 
                          language="bash" 
                          label="Installation via standard pip" 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* First-Run CLI Flow */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
                  <h3 className="font-display text-sm font-bold text-slate-200">
                    3. Establish Connection & Reconcile Plan
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Configure connection variables, execute diagnostic checks, generate a dry-run plan, and apply the state.
                  </p>

                  <div className="space-y-4">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                      First Run Sequence Commands
                    </span>

                    <CodeSnippet 
                      code={`# Set target NPM API connection credentials\nexport NPM_URL="http://npm.internal.company.com/api"\nexport NPM_USERNAME="admin@company.com"\nexport NPM_PASSWORD="MySecureAdminPassword"\n\n# Verify NPM health and connection credentials\nnpmctl health\n\n# Validate formatting on desired-state files\nnpmctl validate desired-state.yaml\n\n# Verify target API endpoints & capability match\nnpmctl schema check\n\n# Compute owner-scoped plan for workload-a\nnpmctl plan desired-state.yaml --owner workload-a\n\n# Safely execute apply in dry-run mode\nnpmctl apply desired-state.yaml --owner workload-a --dry-run\n\n# Execute live apply with automatic pruning on old workload-a objects\nnpmctl apply desired-state.yaml --owner workload-a --prune-owned`} 
                      language="bash" 
                      label="Connection & Execution" 
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: helpful tips */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">
                    Connection Safety Tips
                  </h4>

                  <div className="space-y-3 text-[11px] text-slate-400 leading-relaxed">
                    <p>
                      **Zero Secrets in State**: Never commit actual API keys or credentials directly to your source-controlled `desired-state.yaml`. Keep secrets inside Git environment environment-secrets and reference them utilizing environment interpolation like <span className="font-mono bg-slate-900 px-1 py-0.5 rounded text-slate-300">{"${CLOUDFLARE_API_TOKEN}"}</span> inside configs.
                    </p>
                    <p>
                      **Plan before Apply**: Always generate plans inside your local command-line or CI validations before applying. This lets you inspect drifting attributes before executing mutations.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW: RELEASES PAGE                                                  */}
        {/* ==================================================================== */}
        {route === 'releases' && (
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn" id="release-log-container">
            
            <div className="mb-10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-green font-bold">
                Package Registry Snapshot
              </span>
              <h1 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Releases & Publication Provenance
              </h1>
              <p className="mt-3 text-sm text-slate-400 max-w-2xl leading-relaxed">
                Track stable release versions of npmctl and provider extensions published to PyPI. Check Python requirements, dates, and build attestation statuses.
              </p>
            </div>

            {/* Releases list */}
            <ReleaseTimeline />

          </div>
        )}

      </main>

      {/* Footer Section */}
      <Footer setRoute={setRoute} />
    </div>
  );
}
