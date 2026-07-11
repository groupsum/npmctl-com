/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExternalLink, Terminal, Shield, Download, FileText, ArrowUp } from 'lucide-react';

interface FooterProps {
  setRoute: (route: string) => void;
}

export default function Footer({ setRoute }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (id: string) => {
    setRoute(id);
    window.location.hash = id === 'home' ? '/' : `#/${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-900 bg-slate-950 px-4 py-12 sm:px-6 lg:px-8" aria-label="Site Footer">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          
          {/* Col 1: Brand & Definition */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-brand-green/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-brand-green border border-brand-green/20">
                [npmctl]
              </span>
              <span className="font-display text-sm font-bold tracking-tight text-slate-100">npmctl</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              The declarative, owner-scoped GitOps controller for Nginx Proxy Manager. Automate resource provisioning and provider DNS records with clean validation gates.
            </p>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <span>Apache-2.0 Open Source License</span>
            </div>
          </div>

          {/* Col 2: Product Capabilities */}
          <div>
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Capabilities
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('product')} className="text-slate-400 hover:text-brand-green transition-colors">
                  Proxy Host Reconciler
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('safety')} className="text-slate-400 hover:text-brand-green transition-colors">
                  Owner-Scoped Safety
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('providers')} className="text-slate-400 hover:text-brand-green transition-colors">
                  DNS Provider Packages
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('docs')} className="text-slate-400 hover:text-brand-green transition-colors">
                  CI/CD Pipeline Integration
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Docs */}
          <div>
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Reference Docs
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('docs')} className="text-slate-400 hover:text-brand-green transition-colors">
                  Getting Started Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('safety')} className="text-slate-400 hover:text-brand-green transition-colors">
                  Exit Code Contract
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('releases')} className="text-slate-400 hover:text-brand-green transition-colors">
                  Provenance Snapshot
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/groupsum/npmctl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brand-green transition-colors inline-flex items-center gap-1"
                >
                  <span>Core Repository</span>
                  <ExternalLink className="h-3 w-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Downstream links */}
          <div>
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Package Registries
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <a
                  href="https://pypi.org/project/npmctl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brand-green transition-colors inline-flex items-center gap-1"
                >
                  <span>npmctl on PyPI</span>
                  <ExternalLink className="h-3 w-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/npmctl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brand-green transition-colors inline-flex items-center gap-1"
                  aria-label="Join npmctl Discord Community"
                >
                  <span>Discord Community</span>
                  <ExternalLink className="h-3 w-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/groupsum/npmctl/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brand-green transition-colors inline-flex items-center gap-1"
                >
                  <span>Release Provenance</span>
                  <ExternalLink className="h-3 w-3 text-slate-600" />
                </a>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500">
                  <Shield className="h-3 w-3 text-brand-green" />
                  <span>Beta release v0.3.10</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom strip */}
        <div className="mt-12 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono text-slate-500 text-center sm:text-left leading-normal">
            © 2026 npmctl. All rights reserved. This project is open-source under the Apache-2.0 license. <br />
            Nginx Proxy Manager remains the property of its respective maintainers. npmctl is an independent automation project.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 rounded bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-400 border border-slate-800 transition-all hover:bg-slate-800 hover:text-slate-100 outline-none focus-visible:ring-1 focus-visible:ring-brand-green"
            aria-label="Back to top of page"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>
      </div>
    </footer>
  );
}
