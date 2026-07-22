import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle, Check } from 'lucide-react';
import { useExam } from '../../contexts/ExamContext';
import { GlowingButton } from '../ui/GlowingButton';

export const MonacoWrapper: React.FC = () => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    codeMap,
    setCodeForLang,
    runCode,
    submitCode,
    isRunning,
    isSubmitting,
    autoSaveStatus
  } = useExam();

  const handleLanguageChange = (lang: 'go' | 'python' | 'javascript' | 'cpp') => {
    setSelectedLanguage(lang);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0F19] rounded-2xl border border-slate-300 overflow-hidden shadow-md">
      
      {/* Editor Control Header */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 font-sans">
        
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium font-serif-luxury">Language:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => handleLanguageChange('go')}
              className={`px-3 py-1 rounded-lg font-mono transition-colors ${
                selectedLanguage === 'go' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Go (1.22)
            </button>
            <button
              onClick={() => handleLanguageChange('python')}
              className={`px-3 py-1 rounded-lg font-mono transition-colors ${
                selectedLanguage === 'python' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Python 3.11
            </button>
            <button
              onClick={() => handleLanguageChange('javascript')}
              className={`px-3 py-1 rounded-lg font-mono transition-colors ${
                selectedLanguage === 'javascript' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Node.js
            </button>
            <button
              onClick={() => handleLanguageChange('cpp')}
              className={`px-3 py-1 rounded-lg font-mono transition-colors ${
                selectedLanguage === 'cpp' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              C++20
            </button>
          </div>
        </div>

        {/* Auto Save Status & Action Buttons */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            {autoSaveStatus}
          </span>

          <GlowingButton
            variant="secondary"
            size="sm"
            onClick={runCode}
            disabled={isRunning || isSubmitting}
            icon={<Play className="w-3.5 h-3.5 text-sky-600" />}
          >
            {isRunning ? 'Compiling...' : 'Run Code'}
          </GlowingButton>

          <GlowingButton
            variant="cyan"
            size="sm"
            onClick={submitCode}
            disabled={isRunning || isSubmitting}
            icon={<CheckCircle className="w-3.5 h-3.5" />}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Code'}
          </GlowingButton>
        </div>

      </div>

      {/* Monaco Code Editor Container */}
      <div className="flex-1 w-full min-h-[350px]">
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
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>

    </div>
  );
};
