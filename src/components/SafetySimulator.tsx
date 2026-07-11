/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Play, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { SAFETY_SCENARIOS, SafetyScenario } from '../content';

export default function SafetySimulator() {
  const [selectedId, setSelectedId] = useState<string>(SAFETY_SCENARIOS[2].id); // Default to Foreign Conflict (exciting safety case)

  const activeScenario = SAFETY_SCENARIOS.find(s => s.id === selectedId) || SAFETY_SCENARIOS[0];

  const getExitCodeLabel = (code: number) => {
    switch (code) {
      case 0: return "0 (Success)";
      case 1: return "1 (Conflict / Active Guard)";
      case 2: return "2 (Usage/Validation/Migration Error)";
      case 3: return "3 (NPM API Connection Issue)";
      case 4: return "4 (API Capability Error)";
      default: return `${code} (Unknown)`;
    }
  };

  const getExitCodeStyles = (code: number) => {
    if (code === 0) return "bg-brand-green/10 text-brand-green border-brand-green/30";
    if (code === 1) return "bg-brand-red/10 text-brand-red border-brand-red/30";
    if (code === 4) return "bg-brand-amber/10 text-brand-amber border-brand-amber/30";
    return "bg-slate-800 text-slate-300 border-slate-700";
  };

  const getTypeIcon = (type: SafetyScenario['type']) => {
    switch (type) {
      case 'create':
        return <CheckCircle2 className="h-4 w-4 text-brand-green" />;
      case 'update':
        return <CheckCircle2 className="h-4 w-4 text-brand-blue" />;
      case 'conflict':
        return <ShieldAlert className="h-4 w-4 text-brand-red" />;
      case 'unmanaged':
        return <AlertTriangle className="h-4 w-4 text-brand-amber" />;
      case 'delete':
        return <HelpCircle className="h-4 w-4 text-slate-400" />;
      case 'capability':
        return <ShieldAlert className="h-4 w-4 text-brand-amber" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12" id="safety-simulation-panel">
      {/* List of Scenarios */}
      <div className="lg:col-span-5 flex flex-col gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1 block mb-1">
          Select Safety Scenario
        </span>
        {SAFETY_SCENARIOS.map((scenario) => {
          const isSelected = scenario.id === selectedId;
          return (
            <button
              key={scenario.id}
              onClick={() => setSelectedId(scenario.id)}
              className={`group flex items-start justify-between gap-3 rounded-lg border p-3.5 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-green/80 ${
                isSelected
                  ? 'border-brand-green/40 bg-brand-green/5 text-slate-100 shadow-md'
                  : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50 text-slate-400'
              }`}
              id={`scenario-btn-${scenario.id}`}
              aria-expanded={isSelected}
            >
              <div className="flex gap-2.5">
                <span className="mt-0.5">{getTypeIcon(scenario.type)}</span>
                <div>
                  <h4 className={`text-xs font-semibold ${isSelected ? 'text-brand-green' : 'text-slate-200 group-hover:text-slate-100'}`}>
                    {scenario.title}
                  </h4>
                  <p className="mt-1 line-clamp-1 text-[11px] text-slate-400 leading-normal">
                    {scenario.state}
                  </p>
                </div>
              </div>
              <ChevronRight className={`h-4 w-4 shrink-0 self-center text-slate-600 transition-transform ${isSelected ? 'translate-x-1 text-brand-green' : 'group-hover:translate-x-0.5'}`} />
            </button>
          );
        })}
      </div>

      {/* Interactive Detail Card */}
      <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Banner with Exit Code */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-5 py-3 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${activeScenario.exitCode === 0 ? 'bg-brand-green' : 'bg-brand-red'}`}></span>
              <span className={`relative inline-flex h-2 w-2 rounded-full ${activeScenario.exitCode === 0 ? 'bg-brand-green' : 'bg-brand-red'}`}></span>
            </span>
            <span className="font-mono text-xs font-bold text-slate-400">Simulation Target</span>
          </div>
          
          <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${getExitCodeStyles(activeScenario.exitCode)}`}>
            <span>Pipeline Code:</span>
            <span>{getExitCodeLabel(activeScenario.exitCode)}</span>
          </div>
        </div>

        {/* Contents */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <span className="inline-block rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-2">
              {activeScenario.type} scenario
            </span>
            <h3 className="font-display text-base font-bold text-slate-100">
              {activeScenario.title}
            </h3>

            {/* Simulated environment state */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-900/60 p-3.5 border border-slate-850">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Active System State</span>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed font-sans min-h-[48px]">
                  {activeScenario.state}
                </p>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-3.5 border border-slate-850">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">npmctl Interceptor Logic</span>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed font-sans min-h-[48px]">
                  {activeScenario.behavior}
                </p>
              </div>
            </div>

            {/* Safety Safeguard Explaination */}
            <div className="mt-5 border-t border-slate-850 pt-4">
              <div className="flex gap-2 rounded-lg bg-brand-green/5 p-4 border border-brand-green/10">
                <div className="rounded bg-brand-green/10 p-1 text-brand-green self-start">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-sans text-xs font-bold text-slate-200">Guaranteed System Safety Outcome</h5>
                  <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                    {activeScenario.consequence}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CLI Run Block */}
          <div className="mt-6 pt-4 border-t border-slate-850">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1.5">
              Simulated Command Execution
            </span>
            <div className="rounded bg-slate-900 p-3 font-mono text-xs text-slate-300 flex items-center justify-between border border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pr-3">
                <span className="text-brand-green select-none">$</span>
                <span>
                  npmctl plan desired-state.yaml <span className="text-brand-amber">--owner workload-a</span>
                </span>
              </div>
              <span className={`font-semibold shrink-0 text-[10px] uppercase tracking-wide rounded px-2 py-0.5 ${
                activeScenario.exitCode === 0 ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-red/20 text-brand-red'
              }`}>
                {activeScenario.exitCode === 0 ? "PASSED" : "BLOCKED"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
