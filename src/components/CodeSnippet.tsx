/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeSnippetProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  label?: string;
}

export default function CodeSnippet({ code, language = 'bash', showLineNumbers = false, label }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div 
      className="relative my-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-900/95 font-mono text-xs shadow-xl transition-all hover:border-slate-700"
      id={`code-block-${label ? label.replace(/\s+/g, '-').toLowerCase() : Math.random().toString(36).substr(2, 9)}`}
    >
      {/* Top Header/Window controls */}
      <div className="flex items-center justify-between border-b border-slate-850 bg-slate-950 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/30" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/30" />
          <span className="h-3 w-3 rounded-full bg-green-500/30" />
          {label && (
            <span className="ml-2 text-[10px] uppercase tracking-wider text-slate-500 font-medium">
              {label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {language && (
            <span className="text-[10px] text-slate-500 uppercase">{language}</span>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded bg-slate-900 px-2 py-1 text-[11px] text-slate-400 border border-slate-800 transition-all hover:bg-slate-800 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-brand-green outline-none"
            title="Copy to clipboard"
            aria-label={copied ? "Code copied successfully" : "Copy code snippet"}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-brand-green" />
                <span className="text-brand-green font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="overflow-x-auto p-4 max-h-[420px]">
        <pre className="text-slate-300">
          <code className="block whitespace-pre">
            {lines.map((line, idx) => {
              const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');
              if (isComment) {
                return (
                  <span key={idx} className="block text-slate-500 italic">
                    {showLineNumbers && <span className="inline-block w-6 select-none text-slate-700 text-right pr-2">{idx + 1}</span>}
                    {line}
                  </span>
                );
              }

              const lowerLang = language.toLowerCase();

              // YAML syntax colorizer
              if (lowerLang === 'yaml' || lowerLang === 'yml') {
                const parts = line.split(/(\s+)/);
                return (
                  <span key={idx} className="block min-h-[1.2rem]">
                    {showLineNumbers && <span className="inline-block w-6 select-none text-slate-700 text-right pr-2">{idx + 1}</span>}
                    {parts.map((part, pIdx) => {
                      if (part.match(/^[a-zA-Z0-9_-]+:$/)) {
                        return <span key={pIdx} className="text-brand-blue font-semibold">{part}</span>;
                      }
                      if (part === '-') {
                        return <span key={pIdx} className="text-brand-amber font-bold">{part}</span>;
                      }
                      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
                        return <span key={pIdx} className="text-brand-green">{part}</span>;
                      }
                      if (part === 'true' || part === 'false' || part.match(/^\d+$/)) {
                        return <span key={pIdx} className="text-purple-400 font-medium">{part}</span>;
                      }
                      return <span key={pIdx}>{part}</span>;
                    })}
                  </span>
                );
              }

              // JSON syntax colorizer
              if (lowerLang === 'json') {
                const parts = line.split(/(\s+)/);
                return (
                  <span key={idx} className="block min-h-[1.2rem]">
                    {showLineNumbers && <span className="inline-block w-6 select-none text-slate-700 text-right pr-2">{idx + 1}</span>}
                    {parts.map((part, pIdx) => {
                      if (part.startsWith('"') && part.endsWith('":')) {
                        return <span key={pIdx} className="text-brand-blue font-semibold">{part}</span>;
                      }
                      if (part.startsWith('"') && (part.endsWith('"') || part.endsWith('",'))) {
                        return <span key={pIdx} className="text-brand-green">{part}</span>;
                      }
                      if (part.match(/^\d+,?$/) || part.includes('true') || part.includes('false') || part.includes('null')) {
                        return <span key={pIdx} className="text-purple-400 font-medium">{part}</span>;
                      }
                      return <span key={pIdx}>{part}</span>;
                    })}
                  </span>
                );
              }

              // Default / Bash / CLI commands colorizer
              const parts = line.split(/(\s+)/);
              return (
                <span key={idx} className="block min-h-[1.2rem]">
                  {showLineNumbers && <span className="inline-block w-6 select-none text-slate-700 text-right pr-2">{idx + 1}</span>}
                  
                  {parts.map((part, pIdx) => {
                    if (part === '$') {
                      return <span key={pIdx} className="text-brand-green font-bold mr-1">{part}</span>;
                    }
                    if (part.startsWith('--') || part.startsWith('-')) {
                      return <span key={pIdx} className="text-brand-amber font-medium">{part}</span>;
                    }
                    if (part === 'npmctl' || part === 'pipx' || part === 'pip' || part === 'uv' || part === 'install' || part === 'python') {
                      return <span key={pIdx} className="text-brand-green font-bold">{part}</span>;
                    }
                    if (part === 'plan' || part === 'apply' || part === 'validate' || part === 'schema' || part === 'health' || part === 'adopt' || part === 'audit') {
                      return <span key={pIdx} className="text-brand-blue font-bold">{part}</span>;
                    }
                    if (part.match(/^[A-Z0-9_]+=/)) {
                      const [envVar, val] = part.split('=');
                      return <span key={pIdx} className="text-purple-400 font-medium">{envVar}=<span className="text-slate-400">{val}</span></span>;
                    }
                    return <span key={pIdx}>{part}</span>;
                  })}
                </span>
              );
            })}
          </code>
        </pre>
      </div>

      {/* ARIA Live Status announcement for copy confirmation */}
      <div className="sr-only" aria-live="polite">
        {copied ? "Code copied to clipboard" : ""}
      </div>
    </div>
  );
}
