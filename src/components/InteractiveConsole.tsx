/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sparkles, ArrowRight, Eye, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { DEMO_YAML, DEMO_PLAN_OUTPUT } from '../content';

export default function InteractiveConsole() {
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  // Define structured interactive mappings
  const mappingDetails: Record<string, { title: string; desc: string; planHighlight: string[] }> = {
    owner: {
      title: "Owner-Scoped Boundary",
      desc: "By specifying 'owner: workload-a', npmctl stamps this identifier onto every resource it provisions. When validating, it isolates planning to only resources carrying this ownership mark, ensuring different pipelines never touch each other's resources.",
      planHighlight: ["Owner identified: workload-a", "owner: workload-a", "Ownership tag: meta.owner=workload-a"]
    },
    proxy_hosts: {
      title: "Proxy Host Declaration",
      desc: "Declarative definition of proxy rules including the source domain, forward destination, forced SSL, HTTP/2 support, and internal access constraints. These values are mapped securely to Nginx Proxy Manager's REST API.",
      planHighlight: ["+ CREATE Proxy Host: app.internal.company.com", "schema: https, forward: 10.0.4.15:8443", "SSL: forced, HTTP/2: true", "Access List: 2"]
    },
    dns_records: {
      title: "Provider-Backed DNS Extension",
      desc: "Allows synchronizing external records with DNS providers (like Cloudflare, AWS Route 53, etc.) during proxy host reconcile, completely inside the same declarative file.",
      planHighlight: ["+ CREATE DNS Record: app.internal.company.com (A -> 192.168.1.100 via cloudflare)"]
    },
    unmanaged: {
      title: "Unmanaged & Foreign Safety",
      desc: "npmctl automatically checks all resources in NPM. If a resource matches your YAML but is unmanaged or owned by workload-b, npmctl displays a NO-OP or Conflict block, halting before execution to avoid accidental overwrites.",
      planHighlight: ["~ NO-OP: api.internal.company.com (Owned by workload-b, unchanged)", "~ NO-OP: docs.internal.company.com (Unmanaged resource, untouched)"]
    }
  };

  const getLineClass = (line: string) => {
    let base = "px-3 py-1 border-l-2 border-transparent transition-all duration-250 block cursor-pointer outline-none focus-visible:bg-slate-800/60 focus-visible:border-brand-green ";
    
    if (activeHighlight === 'owner' && (line.includes('owner:') || line.includes('managed_by:') || line.includes('resource_id:'))) {
      return base + "bg-emerald-500/10 border-brand-green text-emerald-300 font-semibold";
    }
    if (activeHighlight === 'proxy_hosts' && (line.includes('proxy_hosts:') || line.includes('forward_') || line.includes('ssl_forced') || line.includes('access_list_id'))) {
      return base + "bg-blue-500/10 border-brand-blue text-blue-300 font-semibold";
    }
    if (activeHighlight === 'dns_records' && (line.includes('dns_records:') || line.includes('provider: cloudflare') || line.includes('zone:') || line.includes('ttl:'))) {
      return base + "bg-amber-500/10 border-brand-amber text-amber-300 font-semibold";
    }
    
    return base + "hover:bg-slate-800/40 text-slate-300";
  };

  const getPlanLineClass = (line: string) => {
    let base = "px-4 py-1 block transition-all duration-200 ";
    
    if (activeHighlight && mappingDetails[activeHighlight]) {
      const matchTerms = mappingDetails[activeHighlight].planHighlight;
      const isMatched = matchTerms.some(term => line.includes(term));
      if (isMatched) {
        if (activeHighlight === 'owner') return base + "bg-emerald-500/20 text-emerald-200 font-semibold border-r-2 border-brand-green";
        if (activeHighlight === 'proxy_hosts') return base + "bg-blue-500/20 text-blue-200 font-semibold border-r-2 border-brand-blue";
        if (activeHighlight === 'dns_records') return base + "bg-amber-500/20 text-amber-200 font-semibold border-r-2 border-brand-amber";
        if (activeHighlight === 'unmanaged') return base + "bg-red-500/20 text-red-200 font-semibold border-r-2 border-brand-red";
      }
    }

    if (line.includes('+ CREATE')) {
      return base + "text-brand-green font-semibold";
    }
    if (line.includes('~ NO-OP')) {
      return base + "text-slate-400 italic";
    }
    if (line.includes('=====')) {
      return base + "text-slate-500";
    }
    
    return base + "text-slate-300";
  };

  return (
    <div className="my-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-sm" id="interactive-workspace">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-100">
            <Layers className="h-5 w-5 text-brand-green" />
            Interactive Reconcile Workspace
          </h3>
          <p className="text-sm text-slate-400">
            Click elements in the YAML desired-state config to see how the plan is safely generated.
          </p>
        </div>
        
        {/* Helper Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveHighlight(activeHighlight === 'owner' ? null : 'owner')}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
              activeHighlight === 'owner' 
                ? 'bg-brand-green text-slate-950 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Owner Scoping
          </button>
          <button
            onClick={() => setActiveHighlight(activeHighlight === 'proxy_hosts' ? null : 'proxy_hosts')}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
              activeHighlight === 'proxy_hosts' 
                ? 'bg-brand-blue text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Proxy Config
          </button>
          <button
            onClick={() => setActiveHighlight(activeHighlight === 'dns_records' ? null : 'dns_records')}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
              activeHighlight === 'dns_records' 
                ? 'bg-brand-amber text-slate-950 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. DNS Sync
          </button>
          <button
            onClick={() => setActiveHighlight(activeHighlight === 'unmanaged' ? null : 'unmanaged')}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
              activeHighlight === 'unmanaged' 
                ? 'bg-brand-red text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Drift & Collision
          </button>
        </div>
      </div>

      {/* Grid workspace */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Left Side: YAML input */}
        <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-850 bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-green" />
              1. Desired State (desired-state.yaml)
            </span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500 uppercase">YAML</span>
          </div>
          
          <div className="font-mono text-xs py-3 overflow-y-auto max-h-[360px] select-none">
            {DEMO_YAML.trim().split('\n').map((line, idx) => (
              <span 
                key={idx} 
                className={getLineClass(line)}
                onClick={() => {
                  if (line.includes('owner:') || line.includes('managed_by:') || line.includes('resource_id:')) {
                    setActiveHighlight(activeHighlight === 'owner' ? null : 'owner');
                  } else if (line.includes('proxy_hosts:') || line.includes('forward_') || line.includes('ssl_forced') || line.includes('access_list_id')) {
                    setActiveHighlight(activeHighlight === 'proxy_hosts' ? null : 'proxy_hosts');
                  } else if (line.includes('dns_records:') || line.includes('provider: cloudflare') || line.includes('zone:') || line.includes('ttl:')) {
                    setActiveHighlight(activeHighlight === 'dns_records' ? null : 'dns_records');
                  } else {
                    setActiveHighlight(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (line.includes('owner:') || line.includes('managed_by:') || line.includes('resource_id:')) {
                      setActiveHighlight(activeHighlight === 'owner' ? null : 'owner');
                    } else if (line.includes('proxy_hosts:') || line.includes('forward_') || line.includes('ssl_forced') || line.includes('access_list_id')) {
                      setActiveHighlight(activeHighlight === 'proxy_hosts' ? null : 'proxy_hosts');
                    } else if (line.includes('dns_records:') || line.includes('provider: cloudflare') || line.includes('zone:') || line.includes('ttl:')) {
                      setActiveHighlight(activeHighlight === 'dns_records' ? null : 'dns_records');
                    } else {
                      setActiveHighlight(null);
                    }
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Code line ${idx + 1}: ${line}`}
              >
                {line}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Calculated Plan */}
        <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-850 bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-brand-amber animate-pulse" />
              2. npmctl Plan Engine (Output Log)
            </span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500 uppercase">stdout</span>
          </div>
          
          <div className="font-mono text-xs py-3 overflow-y-auto max-h-[360px] select-none">
            {DEMO_PLAN_OUTPUT.trim().split('\n').map((line, idx) => (
              <span 
                key={idx} 
                className={getPlanLineClass(line)}
              >
                {line}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Explainer card block */}
      <div className="mt-6 rounded-lg bg-slate-950 p-4 border border-slate-850">
        {activeHighlight && mappingDetails[activeHighlight] ? (
          <div className="flex items-start gap-3 animate-fadeIn">
            <div className="mt-1 rounded bg-brand-green/10 p-1.5 text-brand-green">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-display font-medium text-slate-200 text-sm">
                {mappingDetails[activeHighlight].title}
              </h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {mappingDetails[activeHighlight].desc}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-4 text-center">
            <p className="flex items-center gap-2 text-xs text-slate-400 font-medium italic">
              <Eye className="h-4 w-4 text-brand-green" />
              Select any block inside the workspace to analyze details on owner boundaries and safety constraints.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
