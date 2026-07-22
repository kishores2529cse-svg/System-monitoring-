import React from 'react';
import { BookOpen, Award, Sparkles, Cpu, TimerReset } from 'lucide-react';
import { useExam } from '../../contexts/ExamContext';

export const ProblemDescription: React.FC = () => {
  const { problems, currentProblem, setCurrentProblemId } = useExam();

  return (
    <div className="flex flex-col h-full rounded-[24px] border border-white/20 bg-slate-950/70 shadow-[0_20px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl overflow-hidden font-serif-luxury">
      <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between gap-3 font-sans">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-300" />
          <select
            value={currentProblem.id}
            onChange={(e) => setCurrentProblemId(Number(e.target.value))}
            className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-sm font-semibold text-slate-100 shadow-inner focus:outline-none focus:border-cyan-400"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                {p.id}. {p.title} ({p.difficulty})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 font-sans">
          <span className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
            {currentProblem.difficulty}
          </span>
          <span className="flex items-center gap-1 rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
            <Award className="w-3.5 h-3.5 text-cyan-300" /> {currentProblem.points} pts
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm leading-relaxed text-slate-300">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-300">
            <Sparkles className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-[0.3em]">Studio brief</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{currentProblem.title}</h2>
          <p className="whitespace-pre-line leading-relaxed text-slate-300">{currentProblem.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(currentProblem.tags ?? ['Algorithms', 'Data Structures']).map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center gap-2 text-cyan-300">
              <Cpu className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-[0.3em]">Runtime focus</span>
            </div>
            <p className="text-sm text-slate-300">Optimize for clarity and efficient execution under the given limits.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center gap-2 text-emerald-300">
              <TimerReset className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-[0.3em]">Time budget</span>
            </div>
            <p className="text-sm text-slate-300">Use the built-in console to iterate quickly and verify edge cases.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Sample examples</h3>
          {currentProblem.examples.map((ex, idx) => (
            <div key={idx} className="space-y-2 rounded-2xl border border-white/10 bg-slate-900/70 p-3.5 text-xs font-mono">
              <div className="text-slate-400">Example #{idx + 1}</div>
              <div className="text-slate-200">
                <span className="font-semibold text-cyan-300">Input:</span> {ex.input}
              </div>
              <div className="text-slate-200">
                <span className="font-semibold text-emerald-300">Output:</span> {ex.output}
              </div>
              {ex.explanation && (
                <div className="pt-1 text-[11px] text-slate-400">{ex.explanation}</div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Constraints & limits</h3>
          <ul className="list-disc space-y-1 pl-5 font-mono text-xs text-slate-400">
            {currentProblem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
