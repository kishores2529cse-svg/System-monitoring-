import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, Code2, Sparkles } from 'lucide-react';
import { api } from '../../api/client';
import type { ProblemData } from '../../types';

interface CreateProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemCreated?: (problem: ProblemData) => void;
}

export const CreateProblemModal: React.FC<CreateProblemModalProps> = ({
  isOpen,
  onClose,
  onProblemCreated
}) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [points] = useState<number>(100);
  const [description, setDescription] = useState('');
  const [constraints, setConstraints] = useState('');
  const [tags, setTags] = useState('array,string');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [testCases, setTestCases] = useState<Array<{ input: string; expectedOutput: string; type: 'SAMPLE' | 'HIDDEN' }>>([
    { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]', type: 'SAMPLE' },
    { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]', type: 'HIDDEN' }
  ]);

  if (!isOpen) return null;

  const handleAddTestCase = () => {
    setTestCases(prev => [...prev, { input: '', expectedOutput: '', type: 'HIDDEN' }]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(prev => prev.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index: number, field: 'input' | 'expectedOutput' | 'type', value: string) => {
    setTestCases(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const newProb = await api.problems.create({
        title,
        difficulty,
        points,
        description,
        constraints: constraints ? constraints.split('\n') : ['1 <= N <= 10^5'],
        examples: testCases.filter(t => t.type === 'SAMPLE').map(t => ({
          input: t.input,
          output: t.expectedOutput
        })),
        tags: tags.split(',').map(t => t.trim()),
        starterCode: {
          go: `package main\n\nimport "fmt"\n\nfunc main() {\n    // Solve ${title}\n    fmt.Println("Result")\n}`,
          python: `def solution():\n    # Solve ${title}\n    pass`,
          javascript: `function solution() {\n    // Solve ${title}\n}`
        },
        testCases: testCases.map(t => ({
          input: t.input,
          expectedOutput: t.expectedOutput,
          type: t.type
        }))
      });

      setSuccessMessage('Question and Test Cases published successfully to Sandbox!');
      if (onProblemCreated) onProblemCreated(newProb);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 text-sky-400">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Create New Assessment Question</h2>
            <p className="text-xs text-slate-400">Add problem requirements, constraints, and test cases for candidates.</p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 p-3 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Difficulty */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Question Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Reverse Linked List II"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 focus:border-sky-400 focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Problem Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the problem, input/output requirements, and edge cases..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-100 focus:border-sky-400 focus:outline-none"
            />
          </div>

          {/* Constraints & Tags */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Constraints (One per line)</label>
              <textarea
                rows={2}
                value={constraints}
                onChange={e => setConstraints(e.target.value)}
                placeholder="1 <= N <= 10^5"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs text-slate-100 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="array, string, dynamic-programming"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Test Cases Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Test Cases ({testCases.length})</h3>
              </div>
              <button
                type="button"
                onClick={handleAddTestCase}
                className="flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/20"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Testcase
              </button>
            </div>

            <div className="space-y-3">
              {testCases.map((tc, idx) => (
                <div key={idx} className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Testcase #{idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={tc.type}
                        onChange={e => handleTestCaseChange(idx, 'type', e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-300"
                      >
                        <option value="SAMPLE">Sample Case (Visible)</option>
                        <option value="HIDDEN">Hidden Case (Evaluation)</option>
                      </select>
                      {testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTestCase(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] uppercase text-slate-400">Input Data</label>
                      <input
                        type="text"
                        required
                        value={tc.input}
                        onChange={e => handleTestCaseChange(idx, 'input', e.target.value)}
                        placeholder='e.g. nums = [2,7,11,15], target = 9'
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 font-mono text-xs text-slate-100 focus:border-sky-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] uppercase text-slate-400">Expected Output</label>
                      <input
                        type="text"
                        required
                        value={tc.expectedOutput}
                        onChange={e => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                        placeholder='e.g. [0, 1]'
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 font-mono text-xs text-emerald-300 focus:border-sky-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing Question...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Publish Question & Testcases</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
