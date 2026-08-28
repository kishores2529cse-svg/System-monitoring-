import React from 'react';
import Editor from '@monaco-editor/react';
import { Check, RotateCcw, Copy, Sparkles } from 'lucide-react';
import { useExam } from '../../contexts/ExamContext';
import type { SupportedLanguage } from '../../types';

export const MonacoWrapper: React.FC = React.memo(() => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    codeMap,
    setCodeForLang,
    autoSaveStatus
  } = useExam();

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
  };

  const languageOptions: Array<{ value: SupportedLanguage; label: string; short: string }> = [
    { value: 'go', label: 'Go (1.22)', short: 'Go' },
    { value: 'python', label: 'Python 3.11', short: 'Py' },
    { value: 'javascript', label: 'JavaScript', short: 'JS' },
    { value: 'typescript', label: 'TypeScript', short: 'TS' },
    { value: 'cpp', label: 'C++20', short: 'C++' },
    { value: 'java', label: 'Java 21', short: 'Java' },
    { value: 'rust', label: 'Rust', short: 'Rust' },
    { value: 'csharp', label: 'C#', short: 'C#' }
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeMap[selectedLanguage]);
  };

  const handleReset = () => {
    const current = codeMap[selectedLanguage];
    if (current && current.trim()) {
      setCodeForLang('');
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#050816] shadow-[0_24px_100px_rgba(2,6,23,0.55)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900/80 px-4 py-2.5 font-sans">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            Studio
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/80 p-1 text-xs">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleLanguageChange(option.value)}
                className={`rounded-lg px-2.5 py-1 font-mono transition-colors ${
                  selectedLanguage === option.value
                    ? 'border border-cyan-400/30 bg-cyan-500/20 text-cyan-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {option.short}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-mono text-emerald-300">
            <Check className="h-3.5 w-3.5" />
            {autoSaveStatus}
          </span>
          <button
            onClick={handleCopy}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:text-slate-200"
            title="Copy code"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:text-slate-200"
            title="Reset snippet"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[350px] w-full">
        <Editor
          height="100%"
          language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
          theme="vs-dark"
          value={codeMap[selectedLanguage]}
          onChange={(val) => setCodeForLang(val || '')}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 },
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
});
