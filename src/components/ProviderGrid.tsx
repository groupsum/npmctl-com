/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Server, ShieldCheck, Key, Code, HelpCircle, Check, Copy } from 'lucide-react';
import { DNS_PROVIDERS, DNSProviderInfo } from '../content';

export default function ProviderGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecordFilter, setSelectedRecordFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedConfigId, setExpandedConfigId] = useState<string | null>(null);

  // Collect all unique supported records across providers to populate filter options
  const allRecordTypes = ['ALL', 'A', 'AAAA', 'CNAME', 'TXT', 'MX'];

  const filteredProviders = DNS_PROVIDERS.filter((provider) => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          provider.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRecord = selectedRecordFilter === 'ALL' || 
                          provider.supportedRecords.includes(selectedRecordFilter);

    return matchesSearch && matchesRecord;
  });

  const handleCopyInstall = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Copy failed: ', err);
    }
  };

  return (
    <div className="space-y-6" id="dns-provider-directory">
      {/* Search & Filter Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-800 bg-slate-900/20 p-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search providers (e.g. Cloudflare, Route 53)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-400 outline-none transition-all focus:border-brand-green/50 focus-visible:ring-1 focus-visible:ring-brand-green"
            aria-label="Search DNS provider extensions"
          />
        </div>

        {/* Record Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mr-1.5">
            Filter by Record:
          </span>
          {allRecordTypes.map((rec) => (
            <button
              key={rec}
              onClick={() => setSelectedRecordFilter(rec)}
              className={`rounded px-2.5 py-1 font-mono text-[10px] font-semibold transition-all ${
                selectedRecordFilter === rec
                  ? 'bg-brand-green text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 border border-slate-850 hover:text-slate-100'
              }`}
            >
              {rec}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Providers */}
      {filteredProviders.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map((provider) => {
            const isExpanded = expandedConfigId === provider.id;
            const isCopied = copiedId === provider.id;

            return (
              <div
                key={provider.id}
                className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/30 p-5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/50 hover:shadow-xl"
                id={`provider-card-${provider.id}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 border border-slate-800 text-brand-green">
                      <Server className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-200">
                        {provider.name}
                      </h3>
                      <span className="font-mono text-[10px] text-brand-green bg-brand-green/5 border border-brand-green/10 px-1.5 py-0.5 rounded font-semibold">
                        {provider.packageName}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    v0.3.10
                  </span>
                </div>

                {/* Supported records */}
                <div className="mt-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    Supported Record Types
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {provider.supportedRecords.map((rec) => (
                      <span
                        key={rec}
                        className="rounded bg-slate-950 border border-slate-850 px-2 py-0.5 font-mono text-[10px] text-slate-300 font-medium"
                      >
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Installation line */}
                <div className="mt-4 rounded bg-slate-950 p-2 border border-slate-850 flex items-center justify-between font-mono text-[11px] text-slate-300 overflow-hidden">
                  <span className="truncate text-slate-400 select-all pr-2">
                    {provider.installCommand}
                  </span>
                  <button
                    onClick={() => handleCopyInstall(provider.id, provider.installCommand)}
                    className="rounded bg-slate-900 p-1 text-slate-400 border border-slate-800 transition-all hover:bg-slate-800 hover:text-slate-200 focus-visible:ring-1 focus-visible:ring-brand-green outline-none"
                    aria-label={`Copy install command for ${provider.name}`}
                  >
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5 text-brand-green" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {/* Environment credentials requirements */}
                <div className="mt-4 flex-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
                    <Key className="h-3 w-3 text-brand-amber" />
                    Required Environment Variables
                  </span>
                  <div className="flex flex-col gap-1 font-mono text-[10px]">
                    {provider.credentialEnv.map((env) => (
                      <div key={env} className="flex items-center gap-1.5 text-slate-300">
                        <span className="h-1 w-1 rounded-full bg-slate-500" />
                        <span>{env}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collapse / Config snippet button */}
                <div className="mt-5 border-t border-slate-850 pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => setExpandedConfigId(isExpanded ? null : provider.id)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/40 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-950/80 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-brand-green/80 outline-none"
                    aria-expanded={isExpanded}
                  >
                    <Code className="h-3.5 w-3.5 text-brand-green" />
                    <span>{isExpanded ? 'Hide YAML Config' : 'Show YAML Config'}</span>
                  </button>

                  {/* Config Code block */}
                  {isExpanded && (
                    <div className="mt-2 rounded-lg bg-slate-950 p-3 border border-slate-850 font-mono text-[10px] text-slate-300 overflow-x-auto whitespace-pre animate-fadeIn">
                      <span className="text-slate-400 italic block mb-1"># desired-state.yaml snippet</span>
                      <span>{provider.configSnippet}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 border-dashed py-12 px-4 text-center">
          <HelpCircle className="h-8 w-8 text-slate-500" />
          <h4 className="mt-2 text-sm font-bold text-slate-300">No providers matched your criteria</h4>
          <p className="mt-1 text-xs text-slate-400 max-w-sm leading-relaxed">
            Try resetting your record filter to 'ALL' or matching a different search keyword like Cloudflare or Namecheap.
          </p>
        </div>
      )}
    </div>
  );
}
