/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  CheckCircle2, ShieldAlert, AlertTriangle, HelpCircle, 
  Terminal, ShieldCheck, ChevronRight, FileCode, Play
} from 'lucide-react';

interface ScenarioDetail {
  id: 'create' | 'update' | 'conflict' | 'adopt' | 'delete';
  tabLabel: string;
  badgeLabel: string;
  title: string;
  resourceName: string;
  targetType: string;
  ownerConstraint: string;
  yamlCode: string;
  planLog: string;
  safetyText: string;
  exitCode: number;
  nextStage: string;
  nextStageColor: 'green' | 'red' | 'amber';
}

const LOOP_SCENARIOS: ScenarioDetail[] = [
  {
    id: 'create',
    tabLabel: 'CREATE (api.customer-portal.com)',
    badgeLabel: 'CREATE',
    title: 'Provisioning a new proxy host declared in YAML',
    resourceName: 'api.customer-portal.com',
    targetType: 'proxy_host',
    ownerConstraint: 'gateway-team',
    yamlCode: `version: "2"
resources:
  - type: proxy_host
    name: api.customer-portal.com
    meta:
      owner: gateway-team
    spec:
      forward_host: customer-api.local
      forward_port: 8080
      ssl_forced: true`,
    planLog: `[CREATE] proxy_host 'api.customer-portal.com'
  + meta.owner: 'gateway-team'
  + spec.forward_host: 'customer-api.local'
  + spec.forward_port: 8080
  + spec.ssl_forced: true

Plan: 1 to create, 0 to update, 0 to delete.`,
    safetyText: 'Verifies that the host does not exist or has no owner, allowing a clean provision.',
    exitCode: 0,
    nextStage: 'READY TO APPLY',
    nextStageColor: 'green'
  },
  {
    id: 'update',
    tabLabel: 'UPDATE (dashboard.internal)',
    badgeLabel: 'UPDATE',
    title: 'Reconciling configuration drift on an owned resource',
    resourceName: 'dashboard.internal',
    targetType: 'proxy_host',
    ownerConstraint: 'gateway-team',
    yamlCode: `version: "2"
resources:
  - type: proxy_host
    name: dashboard.internal
    meta:
      owner: gateway-team
    spec:
      forward_host: dashboard-main.local
      forward_port: 9000
      ssl_forced: true # Changed from false`,
    planLog: `[UPDATE] proxy_host 'dashboard.internal' (ID: 42)
  ~ spec.ssl_forced: false -> true
  - meta.owner: 'gateway-team' (verified)

Plan: 0 to create, 1 to update, 0 to delete.`,
    safetyText: 'Detects configuration drift on a resource owned by you and updates only the changed parameters.',
    exitCode: 0,
    nextStage: 'READY TO APPLY',
    nextStageColor: 'green'
  },
  {
    id: 'conflict',
    tabLabel: 'CONFLICT (db-admin.internal)',
    badgeLabel: 'CONFLICT',
    title: 'Blocking overwrite of a resource owned by another team',
    resourceName: 'db-admin.internal',
    targetType: 'proxy_host',
    ownerConstraint: 'gateway-team',
    yamlCode: `version: "2"
resources:
  - type: proxy_host
    name: db-admin.internal
    meta:
      owner: gateway-team
    spec:
      forward_host: db-sec.local
      forward_port: 5432`,
    planLog: `[CONFLICT] proxy_host 'db-admin.internal' (ID: 19)
  x Error: Cannot modify db-admin.internal.
  x Current owner: 'database-team'
  x Requested owner: 'gateway-team'

Aborting. Pipeline failed on resource ownership conflict.`,
    safetyText: "Collision detected! Resource is owned by 'database-team'. Mutation is blocked to protect foreign workloads.",
    exitCode: 1,
    nextStage: 'PIPELINE BLOCKED',
    nextStageColor: 'red'
  },
  {
    id: 'adopt',
    tabLabel: 'ADOPT (legacy-blog.org)',
    badgeLabel: 'ADOPT',
    title: 'Taking explicit ownership of an existing unmanaged resource',
    resourceName: 'legacy-blog.org',
    targetType: 'proxy_host',
    ownerConstraint: 'gateway-team',
    yamlCode: `version: "2"
resources:
  - type: proxy_host
    name: legacy-blog.org
    meta:
      owner: gateway-team
    spec:
      forward_host: old-blog.local
      forward_port: 80`,
    planLog: `[COLLISION] proxy_host 'legacy-blog.org' (ID: 55)
  x Warning: Resource exists but is UNMANAGED.
  x Overwrite rejected. Run adopt to claim:
  x   npmctl adopt --owner gateway-team --name legacy-blog.org

Plan: 0 to create, 0 to update, 0 to delete (1 collision).`,
    safetyText: "Unmanaged resource exists. Blocks mutation until 'npmctl adopt --owner gateway-team --name legacy-blog.org' is run.",
    exitCode: 1,
    nextStage: 'ADOPTION REQUIRED',
    nextStageColor: 'amber'
  },
  {
    id: 'delete',
    tabLabel: 'DELETE (test-sandbox.org)',
    badgeLabel: 'DELETE',
    title: 'Pruning an owned proxy host which was deleted from YAML',
    resourceName: 'test-sandbox.org',
    targetType: 'proxy_host',
    ownerConstraint: 'gateway-team',
    yamlCode: `version: "2"
resources: [] # Removed proxy_host`,
    planLog: `[DELETE] proxy_host 'test-sandbox.org' (ID: 76)
  - meta.owner: 'gateway-team'

Plan: 0 to create, 0 to update, 1 to delete.
Note: Run with '--prune-owned' parameter authorized in CLI.`,
    safetyText: 'Only deletes owned resources, and requires the explicit --prune-owned flag.',
    exitCode: 0,
    nextStage: 'READY TO APPLY',
    nextStageColor: 'green'
  }
];

export default function GitOpsLoop() {
  const [activeId, setActiveId] = useState<ScenarioDetail['id']>('create');

  const active = LOOP_SCENARIOS.find(s => s.id === activeId) || LOOP_SCENARIOS[0];

  const getTabStyles = (id: ScenarioDetail['id']) => {
    const isSelected = activeId === id;
    switch (id) {
      case 'create':
        return isSelected 
          ? 'border-brand-green bg-brand-green/10 text-brand-green ring-1 ring-brand-green/30 font-bold' 
          : 'border-slate-800 hover:border-brand-green/50 hover:text-brand-green text-slate-400';
      case 'update':
        return isSelected 
          ? 'border-brand-blue bg-brand-blue/10 text-brand-blue ring-1 ring-brand-blue/30 font-bold' 
          : 'border-slate-800 hover:border-brand-blue/50 hover:text-brand-blue text-slate-400';
      case 'conflict':
        return isSelected 
          ? 'border-brand-red bg-brand-red/10 text-brand-red ring-1 ring-brand-red/30 font-bold' 
          : 'border-slate-800 hover:border-brand-red/50 hover:text-brand-red text-slate-400';
      case 'adopt':
        return isSelected 
          ? 'border-brand-amber bg-brand-amber/10 text-brand-amber ring-1 ring-brand-amber/30 font-bold' 
          : 'border-slate-800 hover:border-brand-amber/50 hover:text-brand-amber text-slate-400';
      case 'delete':
        return isSelected 
          ? 'border-purple-500 bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30 font-bold' 
          : 'border-slate-800 hover:border-purple-500/50 hover:text-purple-400 text-slate-400';
    }
  };

  const getBadgeStyles = (id: ScenarioDetail['id']) => {
    switch (id) {
      case 'create': return 'bg-brand-green/10 text-brand-green border-brand-green/20';
      case 'update': return 'bg-brand-blue/10 text-brand-blue border-brand-blue/20';
      case 'conflict': return 'bg-brand-red/10 text-brand-red border-brand-red/20';
      case 'adopt': return 'bg-brand-amber/10 text-brand-amber border-brand-amber/20';
      case 'delete': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  const getStageStyles = (color: ScenarioDetail['nextStageColor']) => {
    switch (color) {
      case 'green': return 'bg-brand-green text-slate-950 font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.3)]';
      case 'red': return 'bg-brand-red text-white font-extrabold shadow-[0_0_12px_rgba(239,68,68,0.3)]';
      case 'amber': return 'bg-brand-amber text-slate-950 font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.3)]';
    }
  };

  // Custom highlights helper for YAML syntax color formatting
  const renderHighlightedYaml = (code: string) => {
    const lines = code.trim().split('\n');
    return lines.map((line, idx) => {
      const isComment = line.trim().startsWith('#');
      if (isComment) {
        return (
          <div key={idx} className="text-slate-500 italic">
            {line}
          </div>
        );
      }
      
      const parts = line.split(/(\s+)/);
      return (
        <div key={idx} className="min-h-[1.2rem]">
          {parts.map((part, pIdx) => {
            // Keys (ends with colon)
            if (part.match(/^[a-zA-Z0-9_-]+:$/)) {
              return <span key={pIdx} className="text-brand-blue font-semibold">{part}</span>;
            }
            // Array dashes
            if (part === '-') {
              return <span key={pIdx} className="text-brand-amber font-bold">{part}</span>;
            }
            // String values
            if (part.startsWith('"') && part.endsWith('"')) {
              return <span key={pIdx} className="text-brand-green">{part}</span>;
            }
            if (part.startsWith("'") && part.endsWith("'")) {
              return <span key={pIdx} className="text-brand-green">{part}</span>;
            }
            // Boolean or Numbers
            if (part === 'true' || part === 'false' || part.match(/^\d+$/)) {
              return <span key={pIdx} className="text-purple-400 font-medium">{part}</span>;
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  // Custom highlights helper for Plan Log syntax color formatting
  const renderHighlightedPlan = (code: string) => {
    const lines = code.trim().split('\n');
    return lines.map((line, idx) => {
      const isHeaderLine = line.startsWith('[CREATE]') || line.startsWith('[UPDATE]') || line.startsWith('[CONFLICT]') || line.startsWith('[COLLISION]') || line.startsWith('[DELETE]');
      const isSummary = line.startsWith('Plan:');
      
      let textColorClass = "text-slate-300";
      if (isHeaderLine) {
        if (line.includes('[CREATE]')) textColorClass = "text-brand-green font-bold";
        if (line.includes('[UPDATE]')) textColorClass = "text-brand-blue font-bold";
        if (line.includes('[CONFLICT]')) textColorClass = "text-brand-red font-bold";
        if (line.includes('[COLLISION]')) textColorClass = "text-brand-amber font-bold";
        if (line.includes('[DELETE]')) textColorClass = "text-purple-400 font-bold";
      } else if (line.trim().startsWith('+')) {
        textColorClass = "text-brand-green/90";
      } else if (line.trim().startsWith('~')) {
        textColorClass = "text-brand-blue/90";
      } else if (line.trim().startsWith('-')) {
        textColorClass = "text-purple-400/95";
      } else if (line.trim().startsWith('x ')) {
        if (line.includes('Error:') || line.includes('rejected') || line.includes('failed')) {
          textColorClass = "text-brand-red/90";
        } else if (line.includes('Warning:') || line.includes('UNMANAGED') || line.includes('adopt')) {
          textColorClass = "text-brand-amber/90";
        } else {
          textColorClass = "text-slate-400";
        }
      } else if (isSummary) {
        textColorClass = "text-white font-bold border-t border-slate-850/60 pt-2 mt-2";
      }

      return (
        <div key={idx} className={`min-h-[1.2rem] ${textColorClass}`}>
          {line}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6" id="gitops-loops-container">
      
      {/* 5-Tab Selector Bar */}
      <div className="flex flex-wrap gap-2 justify-center">
        {LOOP_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setActiveId(scenario.id)}
            className={`rounded-lg border px-3.5 py-2 text-xs font-mono font-medium transition-all cursor-pointer ${getTabStyles(scenario.id)}`}
            aria-label={`Select ${scenario.tabLabel} scenario`}
            aria-current={activeId === scenario.id ? 'true' : 'false'}
          >
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${
                scenario.id === 'create' ? 'bg-brand-green' :
                scenario.id === 'update' ? 'bg-brand-blue' :
                scenario.id === 'conflict' ? 'bg-brand-red' :
                scenario.id === 'adopt' ? 'bg-brand-amber' : 'bg-purple-400'
              }`} />
              {scenario.tabLabel}
            </span>
          </button>
        ))}
      </div>

      {/* Main Console Box Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-sm">
        
        {/* Detail Title Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <span className={`rounded border px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase ${getBadgeStyles(active.id)}`}>
              OPERATION: {active.badgeLabel}
            </span>
            <h3 className="font-display text-sm sm:text-base font-bold text-slate-100">
              {active.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Resource Name:</span>
            <span className="font-mono text-xs font-bold text-slate-300">{active.resourceName}</span>
            <span className="text-slate-600 font-mono">|</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Target:</span>
            <span className="font-mono text-xs text-brand-green">{active.targetType}</span>
          </div>
        </div>

        {/* Inner Two-Column Shell */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Column 1: YAML desired-state */}
          <div className="flex flex-col rounded-lg border border-slate-850 bg-slate-950 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-900 bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="h-2 w-2 rounded-full bg-brand-blue" />
                &lt;&gt; desired-state.yaml
              </span>
              <span className="font-mono text-[10px] text-slate-600">YAML Schema V2</span>
            </div>
            
            <div className="font-mono text-[11px] p-4 min-h-[190px] overflow-x-auto select-all bg-slate-950 text-slate-300">
              {renderHighlightedYaml(active.yamlCode)}
            </div>

            {/* Safety Verification Footer inside Column 1 */}
            <div className="border-t border-slate-900 bg-slate-900/30 p-3.5 flex items-start gap-2.5">
              <div className="rounded bg-brand-green/10 p-1 text-brand-green shrink-0 mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Safety Verification:
                </span>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-0.5">
                  {active.safetyText}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Expected Plan Output */}
          <div className="flex flex-col rounded-lg border border-slate-850 bg-slate-950 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-900 bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Terminal className="h-3.5 w-3.5 text-brand-green" />
                _ Expected CLI Plan Log
              </span>
              <span className="font-mono text-[10px] text-slate-600">npmctl plan --owner {active.ownerConstraint}</span>
            </div>
            
            <div className="font-mono text-[11px] p-4 min-h-[190px] overflow-x-auto select-all bg-slate-950 leading-relaxed">
              {renderHighlightedPlan(active.planLog)}
            </div>

            {/* Pipeline Status Footer inside Column 2 */}
            <div className="border-t border-slate-900 bg-slate-900/30 p-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Engine:</span>
                <span className="font-mono text-[11px] text-slate-300 font-semibold">v0.3.10 Core</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Exit Code:</span>
                <span className={`font-mono text-xs font-extrabold rounded px-2 py-0.5 border ${
                  active.exitCode === 0 
                    ? 'bg-brand-green/10 text-brand-green border-brand-green/30' 
                    : 'bg-brand-red/10 text-brand-red border-brand-red/30'
                }`}>
                  {active.exitCode}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Row at bottom right outside the inner columns */}
        <div className="flex justify-end items-center gap-3 mt-5">
          <span className="text-xs text-slate-400 font-medium font-sans">
            Next proposed pipeline stage:
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs tracking-wider border border-white/5 uppercase ${getStageStyles(active.nextStageColor)}`}>
            <span>{active.nextStage}</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </span>
        </div>

      </div>
    </div>
  );
}
