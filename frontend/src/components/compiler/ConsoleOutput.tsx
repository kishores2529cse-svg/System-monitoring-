import React from 'react';
import { Terminal, CheckCircle2, XCircle, Clock, Cpu, SlidersHorizontal } from 'lucide-react';
import { useExam } from '../../contexts/ExamContext';

export const ConsoleOutput: React.FC = () => {
  const {
    activeConsoleTab,
    setActiveConsoleTab,
    compilerResult,
    customInput,
    setCustomInput,
    isRunning,
    isSubmitting
  } = useExam();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/70 shadow-[0_20px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5 font-sans">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveConsoleTab('output')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeConsoleTab === 'output'
                ? 'border border-cyan-400/30 bg-cyan-500/15 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Console
          </button>
          <button
            onClick={() => setActiveConsoleTab('input')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeConsoleTab === 'input'
                ? 'border border-cyan-400/30 bg-cyan-500/15 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Input
          </button>
          <button
            onClick={() => setActiveConsoleTab('testcases')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeConsoleTab === 'testcases'
                ? 'border border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Tests ({compilerResult?.passedTests || 0}/{compilerResult?.totalTests || 3})
          </button>
        </div>

        {compilerResult && (
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-cyan-400" /> {compilerResult.executionTimeMs}ms</span>
            <span className="flex items-center gap-1"><Cpu className="h-3 w-3 text-violet-400" /> {compilerResult.memoryKb}KB</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-200">
        {isRunning || isSubmitting ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-8 text-center font-sans text-slate-400">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            <span>Compiling your solution in an isolated sandbox worker…</span>
          </div>
        ) : activeConsoleTab === 'output' ? (
          <div className="space-y-3">
            {compilerResult ? (
              <>
                <div className="flex items-center gap-2 font-sans">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                    Status: {compilerResult.status}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-400">
                    Live feedback
                  </span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/90 p-3.5 text-[12px] text-emerald-300 shadow-inner">
                  {compilerResult.stdout || compilerResult.stderr || 'No output produced.'}
                </pre>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-slate-400">
                Run your solution to stream compiler output, runtime traces, and passing status here.
              </div>
            )}
          </div>
        ) : activeConsoleTab === 'input' ? (
          <div className="space-y-2 font-sans">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Custom input buffer</label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              rows={6}
              className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/80 p-3 font-mono text-xs text-slate-100 shadow-inner focus:border-cyan-400 focus:outline-none"
            />
          </div>
        ) : (
          <div className="space-y-3 font-sans">
            {compilerResult?.testDetails ? (
              compilerResult.testDetails.map((t) => (
                <div key={t.testId} className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-100">
                      {t.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-400" />}
                      Test Case #{t.testId}
                    </span>
                    <span className="text-[10px] text-slate-400">{t.timeMs}ms</span>
                  </div>
                  <div className="grid gap-2 text-[11px] md:grid-cols-2">
                    <div>
                      <div className="mb-1 text-slate-400">Input</div>
                      <p className="rounded-xl border border-white/10 bg-slate-900/70 p-2 text-slate-300">{t.input}</p>
                    </div>
                    <div>
                      <div className="mb-1 text-slate-400">Expected / observed</div>
                      <p className="rounded-xl border border-white/10 bg-slate-900/70 p-2 text-emerald-300">{t.expectedOutput} / {t.actualOutput}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-slate-400">
                Submit your code to see a detailed breakdown of each test vector.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
