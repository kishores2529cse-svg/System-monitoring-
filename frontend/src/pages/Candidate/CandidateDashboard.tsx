import React from 'react';
import { ChevronDown, Lock } from 'lucide-react';

export const CandidateDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F3F7FB] text-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Level 5</p>
              <h1 className="mt-3 text-2xl font-extrabold text-slate-950">Permutations</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-600 text-sm font-medium">
              <ChevronDown className="w-4 h-4" />
              Overview
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">L5 - Practice - PS - Permutation - Level I</p>
                <p className="mt-2 text-xs text-slate-500">Opened: Friday, 3 July 2026, 10:17 PM</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                <Lock className="w-4 h-4 text-slate-400" /> Locked
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-white p-5 border border-slate-200 text-sm leading-6 text-slate-600">
              <span className="font-semibold text-slate-900">Not available unless:</span>
              <span className="ml-1">The activity <strong className="text-slate-900">L5 - Maths - Quiz 2</strong> is complete and passed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
