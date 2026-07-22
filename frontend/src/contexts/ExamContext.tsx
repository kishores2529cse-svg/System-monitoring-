import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ProblemData, CompilerResult, SupportedLanguage } from '../types';
import { api } from '../api/client';
import { INITIAL_PROBLEMS } from '../services/mockData';

interface ExamContextType {
  problems: ProblemData[];
  currentProblem: ProblemData;
  setCurrentProblemId: (id: number) => void;
  selectedLanguage: SupportedLanguage;
  setSelectedLanguage: (lang: SupportedLanguage) => void;
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
  const [problems, setProblems] = useState<ProblemData[]>(INITIAL_PROBLEMS);
  const [currentProblem, setCurrentProblem] = useState<ProblemData>(INITIAL_PROBLEMS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('go');

  const refreshProblems = async () => {
    try {
      const list = await api.problems.getAll();
      if (list && list.length > 0) {
        setProblems(list);
        // If current problem is not in list, pick the first
        if (!list.some(p => p.id === currentProblem.id)) {
          setCurrentProblem(list[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshProblems();
  }, []);

  const [codeMap, setCodeMap] = useState<Record<SupportedLanguage, string>>({
    c: INITIAL_PROBLEMS[0].starterCode.c ?? '',
    cpp: INITIAL_PROBLEMS[0].starterCode.cpp ?? '',
    java: INITIAL_PROBLEMS[0].starterCode.java ?? '',
    python: INITIAL_PROBLEMS[0].starterCode.python ?? '',
    javascript: INITIAL_PROBLEMS[0].starterCode.javascript ?? '',
    typescript: INITIAL_PROBLEMS[0].starterCode.typescript ?? '',
    go: INITIAL_PROBLEMS[0].starterCode.go ?? '',
    rust: INITIAL_PROBLEMS[0].starterCode.rust ?? '',
    csharp: INITIAL_PROBLEMS[0].starterCode.csharp ?? '',
    kotlin: INITIAL_PROBLEMS[0].starterCode.kotlin ?? '',
    swift: INITIAL_PROBLEMS[0].starterCode.swift ?? ''
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
        c: prob.starterCode.c ?? '',
        cpp: prob.starterCode.cpp ?? '',
        java: prob.starterCode.java ?? '',
        python: prob.starterCode.python ?? '',
        javascript: prob.starterCode.javascript ?? '',
        typescript: prob.starterCode.typescript ?? '',
        go: prob.starterCode.go ?? '',
        rust: prob.starterCode.rust ?? '',
        csharp: prob.starterCode.csharp ?? '',
        kotlin: prob.starterCode.kotlin ?? '',
        swift: prob.starterCode.swift ?? ''
      });
      if (prob.testCases && prob.testCases.length > 0) {
        setCustomInput(prob.testCases[0].input);
      }
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
      const res = await api.compiler.run(code, selectedLanguage, customInput, currentProblem.id);
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
