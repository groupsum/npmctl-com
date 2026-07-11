/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, X, Terminal, ExternalLink, Download, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentRoute: string;
  setRoute: (route: string) => void;
}

export default function Header({ currentRoute, setRoute }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', external: false },
    { id: 'product', label: 'Product', external: false },
    { id: 'safety', label: 'Safety', external: false },
    { id: 'providers', label: 'Providers', external: false },
    { id: 'docs', label: 'Docs', external: false },
    { id: 'releases', label: 'Releases', external: false },
  ];

  const handleNavClick = (id: string) => {
    setRoute(id);
    window.location.hash = id === 'home' ? '/' : `#/${id}`;
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      {/* Scope Clarification Ticker Banner */}
      <div className="w-full overflow-hidden bg-slate-950 border-b border-slate-900 py-3 text-[11px] font-mono select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="flex items-center gap-12 pr-12 shrink-0">
              <span className="flex items-center gap-2 text-brand-amber font-bold tracking-widest text-[10px]">
                <AlertTriangle className="h-3.5 w-3.5 animate-pulse text-brand-amber shrink-0" />
                <span>NPM TARGET CLARIFICATION</span>
              </span>
              <span className="text-slate-100 font-sans font-medium tracking-wide">
                npmctl is a dedicated controller for <strong className="text-white underline decoration-brand-green underline-offset-2">Nginx Proxy Manager (NPM)</strong>, completely unrelated to Node/JS package manager (npm).
              </span>
              <span className="text-slate-700 font-sans font-bold">|</span>
              <button
                onClick={() => handleNavClick('safety')}
                className="inline-flex items-center gap-1.5 text-brand-green font-bold tracking-wider hover:text-emerald-300 transition-colors underline decoration-brand-green/30 hover:decoration-brand-green underline-offset-2 cursor-pointer uppercase text-[10px]"
              >
                Read Safety Model
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skip to Content Link for Screen Readers & Keyboard users */}
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-50 -translate-y-20 rounded bg-brand-green px-4 py-2 text-xs font-semibold text-slate-950 transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Lockup */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 font-display text-base font-bold text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-lg px-2 py-1"
          aria-label="npmctl Homepage"
        >
          <div className="flex items-center justify-center rounded bg-brand-green/10 px-1.5 py-0.5 font-mono text-xs font-bold text-brand-green border border-brand-green/20">
            [npmctl]
          </div>
          <span className="tracking-tight hover:text-white transition-colors">npmctl</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Desktop Navigation">
          {navigationItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
                  isActive
                    ? 'bg-slate-900 text-slate-100 font-semibold border border-slate-800'
                    : 'text-slate-400 hover:text-slate-100 border border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}


        </nav>

        {/* Action Buttons (Always visible on large screens, key items preserved on small screen header) */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('docs')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/40 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-brand-green outline-none"
            aria-label="Navigate to documentation to view a plan"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>View a plan</span>
          </button>
          
          <button
            onClick={() => handleNavClick('docs')}
            className="flex items-center gap-1.5 rounded-lg bg-brand-green px-3.5 py-1.5 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-brand-green outline-none shadow-md"
            aria-label="Install npmctl via docs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Install npmctl</span>
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 sm:hidden">
          {/* Quick Mini CTA for small screens to ensure "Install npmctl" is preserved */}
          <button
            onClick={() => handleNavClick('docs')}
            className="rounded-lg bg-brand-green px-2.5 py-1.5 text-[11px] font-bold text-slate-950 transition-all hover:bg-emerald-400"
            aria-label="Quick install npmctl"
          >
            Install
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-900 bg-slate-950 px-4 py-4 sm:hidden animate-fadeIn">
          <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
            {navigationItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-slate-100 font-semibold'
                      : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />}
                </button>
              );
            })}



            {/* Collapsed Secondary CTA */}
            <button
              onClick={() => handleNavClick('docs')}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/40 py-2.5 text-xs font-semibold text-slate-300"
            >
              <Terminal className="h-4 w-4" />
              <span>View a plan</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
