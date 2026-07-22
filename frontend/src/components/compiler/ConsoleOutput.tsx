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
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs font-serif-luxury">
      
      {/* Console Tab Bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-sans">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveConsoleTab('output')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeConsoleTab === 'output' ? 'bg-white text-sky-800 font-semibold border border-slate-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Console Output
          </button>
          <button
            onClick={() => setActiveConsoleTab('input')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeConsoleTab === 'input' ? 'bg-white text-sky-800 font-semibold border border-slate-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Custom Test Input
          </button>
          <button
            onClick={() => setActiveConsoleTab('testcases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeConsoleTab === 'testcases' ? 'bg-white text-sky-800 font-semibold border border-slate-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Test Cases ({compilerResult?.passedTests || 0}/{compilerResult?.totalTests || 3})
          </button>
        </div>

        {compilerResult && (
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-sky-600" /> {compilerResult.executionTimeMs}ms</span>
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-indigo-600" /> {compilerResult.memoryKb}KB</span>
          </div>
        )}
      </div>

      {/* Tab Body */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-800">
        
        {isRunning || isSubmitting ? (
          <div className="h-full flex items-center justify-center flex-col gap-2 py-8 text-slate-500 font-sans">
            <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
            <span>Compiling Go / Target code on isolated container worker...</span>
          </div>
        ) : activeConsoleTab === 'output' ? (
          <div>
            {compilerResult ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-semibold font-sans">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Status: {compilerResult.status}
                  </span>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 overflow-x-auto whitespace-pre-wrap shadow-inner">
                  {compilerResult.stdout}
                </pre>
              </div>
            ) : (
              <div className="text-slate-500 py-6 text-center font-sans">
                Click "Run Code" to compile and execute program against test cases.
              </div>
            )}
          </div>
        ) : activeConsoleTab === 'input' ? (
          <div className="space-y-2 font-sans">
            <label className="text-xs text-slate-700 font-semibold font-serif-luxury">Specify Custom Test Case Input Buffer:</label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500 resize-none font-mono text-xs shadow-2xs"
            />
          </div>
        ) : (
          <div className="space-y-3 font-sans">
            {compilerResult?.testDetails ? (
              compilerResult.testDetails.map(t => (
                <div key={t.testId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5 font-serif-luxury text-sm">
                      {t.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                      Test Case #{t.testId}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{t.timeMs}ms</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                    <div>
                      <span className="text-slate-500 font-sans">Input:</span>
                      <p className="text-slate-800 bg-white p-1.5 rounded border border-slate-200 mt-0.5">{t.input}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-sans">Expected vs Output:</span>
                      <p className="text-emerald-700 font-bold bg-white p-1.5 rounded border border-slate-200 mt-0.5">{t.actualOutput}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 py-6 text-center font-sans">
                No test case results yet. Submit code to run against all 15 test suite vectors.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
