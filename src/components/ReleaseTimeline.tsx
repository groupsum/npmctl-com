/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { RELEASES, ReleaseInfo } from '../content';
import { 
  Calendar, CheckCircle2, ShieldCheck, Download, 
  Layers, Search, Copy, Check, Info, FileCode, CheckSquare, ChevronDown, ChevronUp
} from 'lucide-react';

export default function ReleaseTimeline() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'timeline' | 'pypi-log'>('timeline');
  const [expandedVersions, setExpandedVersions] = useState<Record<string, boolean>>({
    '0.3.10': true // expand latest by default
  });
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const toggleExpand = (ver: string) => {
    setExpandedVersions(prev => ({
      ...prev,
      [ver]: !prev[ver]
    }));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Filter releases based on search query
  const filteredReleases = RELEASES.filter((release) => {
    const query = searchQuery.toLowerCase();
    return (
      release.version.toLowerCase().includes(query) ||
      release.changelogSummary.toLowerCase().includes(query) ||
      release.packages.some(pkg => pkg.toLowerCase().includes(query)) ||
      release.changelogItems.some(item => item.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6" id="release-archive">
      {/* Top release statistics card */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Latest Stable Version</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-brand-green">v0.3.10</span>
            <span className="rounded bg-brand-green/10 border border-brand-green/20 px-1.5 py-0.5 text-[10px] font-semibold text-brand-green">Beta</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Published on PyPI (2026-05-19)</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Python Compatibility Range</span>
          <div className="mt-1">
            <span className="font-mono text-lg font-bold text-slate-200">Python 3.10 – 3.14</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Strictly tested across CPython distributions</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Package Provenance</span>
          <div className="mt-1 flex items-center gap-1.5 text-slate-200">
            <ShieldCheck className="h-5 w-5 text-brand-green shrink-0" />
            <span className="font-sans text-sm font-bold">OIDC Trusted Publishing</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">GitHub Actions attestations cryptographically verified</p>
        </div>
      </div>

      {/* Interactive Controls Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-xl border border-slate-850 bg-slate-900/20">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search release logs, version, packages..."
            className="block w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-brand-green/50 focus:outline-none focus:ring-1 focus:ring-brand-green/30"
          />
        </div>

        {/* View Mode Tabs */}
        <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-850">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`rounded px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'timeline' ? 'bg-brand-green text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Timeline Feed
          </button>
          <button
            onClick={() => setActiveTab('pypi-log')}
            className={`rounded px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'pypi-log' ? 'bg-brand-green text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PyPI Package Logs
          </button>
        </div>
      </div>

      {/* Main Registry Display */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
        <div className="border-b border-slate-850 bg-slate-900/50 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-sm font-bold text-slate-200">
              {activeTab === 'timeline' ? 'Core & Extension Publication Timeline' : 'PyPI Registry History'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {activeTab === 'timeline' 
                ? 'Chronological list of stable package releases, changelogs, and core artifacts.' 
                : 'Detailed release logs matching metadata, hashes, and size statistics direct from PyPI.'}
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {filteredReleases.length} version{filteredReleases.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {filteredReleases.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Info className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-xs">No releases found matching your search term.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-brand-green hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : activeTab === 'timeline' ? (
          /* VIEW 1: TIMELINE FEED */
          <div className="divide-y divide-slate-850">
            {filteredReleases.map((release) => {
              const isExpanded = !!expandedVersions[release.version];
              return (
                <div key={release.version} className="p-5 hover:bg-slate-900/5 transition-colors">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                    {/* Header: Version and dates */}
                    <div className="md:w-1/4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-slate-100">
                          v{release.version}
                        </span>
                        {release.version === '0.3.10' && (
                          <span className="rounded bg-brand-green/10 border border-brand-green/20 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-brand-green uppercase tracking-wider">
                            Latest
                          </span>
                        )}
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                          {release.pypiStatus}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-1.5 text-slate-400 text-xs">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-brand-green" />
                        <span>{release.date} <span className="text-[9px] bg-slate-900 px-1 py-0.2 rounded border border-slate-850">via {release.dateSource}</span></span>
                      </div>

                      <div className="mt-2.5 text-[10px] font-mono text-slate-400">
                        <span className="block">Python: {release.pythonRange}</span>
                        <span className="block mt-0.5">Maturity: {release.maturity}</span>
                      </div>
                    </div>

                    {/* Center Column: Changelog Summary */}
                    <div className="md:w-1/2 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-0.5">Changelog Summary</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {release.changelogSummary}
                        </p>
                      </div>

                      {/* Packages compiled in this release */}
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1.5">Published Artifacts</span>
                        <div className="flex flex-wrap gap-1">
                          {release.packages.map((pkg) => (
                            <span
                              key={pkg}
                              className="rounded bg-slate-900 border border-slate-850 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                            >
                              {pkg}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Expandable change items and hashes */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-900 space-y-4 animate-fadeIn">
                          {/* Itemized Changes */}
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1.5">Detailed Changes</span>
                            <ul className="space-y-1.5 pl-3 list-disc text-[11px] text-slate-400 leading-relaxed">
                              {release.changelogItems.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Cryptographic Artifact Hashes */}
                          <div className="space-y-1.5 bg-slate-950 p-2.5 rounded border border-slate-850">
                            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Integrity Signatures (SHA256)</span>
                            <div className="font-mono text-[9px] text-slate-500 space-y-1 select-all">
                              <div>
                                <span className="text-slate-400">wheel:</span> {release.sha256Wheel}
                              </div>
                              <div>
                                <span className="text-slate-400">sdist:</span> {release.sha256Sdist}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Copyable Install, Provenance and Expand toggles */}
                    <div className="md:w-1/4 flex flex-col justify-between items-start md:items-end gap-3 text-left md:text-right border-t border-slate-850 md:border-t-0 pt-3 md:pt-0 w-full">
                      <div className="space-y-1 w-full md:text-right">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Integrity Provenance</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-sans font-medium bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-brand-green" />
                          <span>OIDC Provenance Attested</span>
                        </span>
                      </div>

                      {/* Quick install syntax for older version */}
                      <div className="w-full">
                        <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-1 md:text-right">PyPI Installation Command</span>
                        <div className="flex rounded-md bg-slate-950 p-1 border border-slate-850/60 items-center justify-between w-full max-w-xs md:ml-auto">
                          <code className="text-[10px] text-slate-300 font-mono truncate pl-2 select-all">
                            pip install npmctl=={release.version}
                          </code>
                          <button
                            onClick={() => handleCopy(`pip install npmctl==${release.version}`)}
                            className="p-1 rounded hover:bg-slate-900 text-slate-400 hover:text-white shrink-0 ml-1.5"
                            aria-label={`Copy installation command for version ${release.version}`}
                          >
                            {copiedText === `pip install npmctl==${release.version}` ? (
                              <Check className="h-3 w-3 text-brand-green" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full justify-start md:justify-end pt-1">
                        <button
                          onClick={() => toggleExpand(release.version)}
                          className="flex items-center gap-1 rounded bg-slate-900 border border-slate-850 px-2.5 py-1 text-[10px] text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-200"
                        >
                          {isExpanded ? (
                            <>
                              <span>Collapse Details</span>
                              <ChevronUp className="h-3 w-3" />
                            </>
                          ) : (
                            <>
                              <span>Expand Details</span>
                              <ChevronDown className="h-3 w-3" />
                            </>
                          )}
                        </button>

                        <a
                          href={`https://pypi.org/project/npmctl/${release.version}/`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 rounded bg-slate-900 border border-slate-850 px-2.5 py-1 text-[10px] text-slate-300 transition-all hover:bg-slate-800 hover:text-slate-100"
                          aria-label={`View release v${release.version} on PyPI`}
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>PyPI Page</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* VIEW 2: PYPI PACKAGE REGISTRY LOGS (Detailed metadata table) */
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-400 divide-y divide-slate-850">
              <thead className="bg-slate-900 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Version / Status</th>
                  <th className="px-5 py-3">Publication Date</th>
                  <th className="px-5 py-3">Distribution Sizes</th>
                  <th className="px-5 py-3">Crypto Hash Checks</th>
                  <th className="px-5 py-3">Provenance Status</th>
                  <th className="px-5 py-3">Interactive CLI Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredReleases.map((release) => (
                  <tr key={release.version} className="hover:bg-slate-900/15 transition-all">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200">v{release.version}</span>
                        <span className="text-[9px] bg-brand-green/10 text-brand-green px-1 rounded border border-brand-green/20">
                          {release.pypiStatus}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-600 block mt-0.5">{release.maturity} release</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-slate-300 font-sans block">{release.date}</span>
                      <span className="text-[9px] text-slate-500">Source: {release.dateSource}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-slate-300">
                        <div><span className="text-slate-500">whl:</span> {release.fileSizeWheel}</div>
                        <div><span className="text-slate-500">tar.gz:</span> {release.fileSizeSdist}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="max-w-[200px] space-y-0.5">
                        <div className="flex items-center gap-1">
                          <CheckSquare className="h-3 w-3 text-emerald-500" />
                          <span className="text-[9px] text-slate-400 truncate select-all" title={release.sha256Wheel}>
                            whl: {release.sha256Wheel.substring(0, 16)}...
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckSquare className="h-3 w-3 text-emerald-500" />
                          <span className="text-[9px] text-slate-400 truncate select-all" title={release.sha256Sdist}>
                            src: {release.sha256Sdist.substring(0, 16)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-sans">
                      <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                        <ShieldCheck className="h-4 w-4 text-brand-green shrink-0" />
                        <span>OIDC Verified</span>
                      </div>
                      <span className="text-[9px] text-slate-500 block">Trusted Publisher lock</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex rounded bg-slate-950 p-1 border border-slate-850 items-center justify-between max-w-[220px]">
                        <code className="text-[10px] text-slate-300 font-mono truncate pl-1 select-all">
                          uv tool install npmctl=={release.version}
                        </code>
                        <button
                          onClick={() => handleCopy(`uv tool install npmctl==${release.version}`)}
                          className="p-1 rounded hover:bg-slate-900 text-slate-400 hover:text-white"
                          aria-label={`Copy uv tool install npmctl==${release.version}`}
                        >
                          {copiedText === `uv tool install npmctl==${release.version}` ? (
                            <Check className="h-3 w-3 text-brand-green" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
