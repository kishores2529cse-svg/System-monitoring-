import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ProblemData, CompilerResult } from '../types';
import { api } from '../api/client';
import { INITIAL_PROBLEMS } from '../services/mockData';

interface ExamContextType {
  problems: ProblemData[];
  currentProblem: ProblemData;
  setCurrentProblemId: (id: number) => void;
  selectedLanguage: 'go' | 'python' | 'javascript' | 'cpp';
  setSelectedLanguage: (lang: 'go' | 'python' | 'javascript' | 'cpp') => void;
  codeMap: Record<string, string>;
  setCodeForLang: (code: string) => void;
  customInput: string;
  setCustomInput: (input: string) => void;
  activeConsoleTab: 'output' | 'testcases' | 'input';
  setActiveConsoleTab: (tab: 'output' | 'testcases' | 'input') => void;
  compilerResult: CompilerResult | null;
  isRunning: boolean;
  isSubmitting: boolean;
  secondsRemaining: number;
  autoSaveStatus: 'Saved' | 'Saving...' | 'Unsaved';
  runCode: () => Promise<void>;
  submitCode: () => Promise<void>;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [problems] = useState<ProblemData[]>(INITIAL_PROBLEMS);
  const [currentProblem, setCurrentProblem] = useState<ProblemData>(INITIAL_PROBLEMS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<'go' | 'python' | 'javascript' | 'cpp'>('go');
  
  const [codeMap, setCodeMap] = useState<Record<string, string>>({
    go: INITIAL_PROBLEMS[0].starterCode.go,
    python: INITIAL_PROBLEMS[0].starterCode.python,
    javascript: INITIAL_PROBLEMS[0].starterCode.javascript,
    cpp: INITIAL_PROBLEMS[0].starterCode.cpp
  });

  const [customInput, setCustomInput] = useState<string>('nums = [2,7,11,15], target = 9');
  const [activeConsoleTab, setActiveConsoleTab] = useState<'output' | 'testcases' | 'input'>('output');
  const [compilerResult, setCompilerResult] = useState<CompilerResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4365); // 01:12:45
  const [autoSaveStatus, setAutoSaveStatus] = useState<'Saved' | 'Saving...' | 'Unsaved'>('Saved');

  // Exam Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const setCurrentProblemId = (id: number) => {
    const prob = problems.find(p => p.id === id);
    if (prob) {
      setCurrentProblem(prob);
      setCodeMap({
        go: prob.starterCode.go,
        python: prob.starterCode.python,
        javascript: prob.starterCode.javascript,
        cpp: prob.starterCode.cpp
      });
    }
  };

  const setCodeForLang = (code: string) => {
    setAutoSaveStatus('Saving...');
    setCodeMap(prev => ({ ...prev, [selectedLanguage]: code }));
    setTimeout(() => setAutoSaveStatus('Saved'), 800);
  };

  const runCode = async () => {
    setIsRunning(true);
    setActiveConsoleTab('output');
    try {
      const code = codeMap[selectedLanguage];
      const res = await api.compiler.run(code, selectedLanguage, customInput);
      setCompilerResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    setIsSubmitting(true);
    setActiveConsoleTab('testcases');
    try {
      const code = codeMap[selectedLanguage];
      const res = await api.compiler.submit(code, selectedLanguage, currentProblem.id);
      setCompilerResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ExamContext.Provider value={{
      problems,
      currentProblem,
      setCurrentProblemId,
      selectedLanguage,
      setSelectedLanguage,
      codeMap,
      setCodeForLang,
      customInput,
      setCustomInput,
      activeConsoleTab,
      setActiveConsoleTab,
      compilerResult,
      isRunning,
      isSubmitting,
      secondsRemaining,
      autoSaveStatus,
      runCode,
      submitCode
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) throw new Error('useExam must be used within an ExamProvider');
  return context;
};
