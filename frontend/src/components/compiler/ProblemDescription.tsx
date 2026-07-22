import React from 'react';
import { BookOpen, Award } from 'lucide-react';
import { useExam } from '../../contexts/ExamContext';

export const ProblemDescription: React.FC = () => {
  const { problems, currentProblem, setCurrentProblemId } = useExam();

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs font-serif-luxury">
      
      {/* Header Selector */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 font-sans">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-600" />
          <select
            value={currentProblem.id}
            onChange={(e) => setCurrentProblemId(Number(e.target.value))}
            className="bg-white text-slate-900 font-serif-luxury font-semibold text-sm rounded-xl px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer shadow-2xs"
          >
            {problems.map(p => (
              <option key={p.id} value={p.id}>
                {p.id}. {p.title} ({p.difficulty})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 font-sans">
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {currentProblem.difficulty}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-sky-600" /> {currentProblem.points} pts
          </span>
        </div>
      </div>

      {/* Description Content */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed font-sans">
        
        {/* Main Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif-luxury">{currentProblem.title}</h2>
          <p className="whitespace-pre-line text-slate-700 font-sans leading-relaxed">{currentProblem.description}</p>
        </div>

        {/* Examples Section */}
        <div className="space-y-4 font-sans">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-serif-luxury">Sample Examples</h3>
          {currentProblem.examples.map((ex, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono shadow-2xs">
              <div className="text-slate-600 font-semibold font-serif-luxury">Example #{idx + 1}:</div>
              <div className="text-slate-800">
                <span className="text-sky-700 font-bold">Input:</span> {ex.input}
              </div>
              <div className="text-slate-800">
                <span className="text-emerald-700 font-bold">Output:</span> {ex.output}
              </div>
              {ex.explanation && (
                <div className="text-slate-600 font-sans italic text-[11px] pt-1">
                  Explanation: {ex.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Constraints Section */}
        <div className="space-y-2 pt-2 font-sans">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-serif-luxury">Constraints & Limits</h3>
          <ul className="list-disc list-inside space-y-1 font-mono text-xs text-slate-600">
            {currentProblem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
