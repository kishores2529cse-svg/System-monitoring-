import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getConfidenceColor(score: number): { text: string; bg: string; border: string; raw: string } {
  if (score >= 85) {
    return { text: 'text-emerald-700 font-semibold', bg: 'bg-emerald-50', border: 'border-emerald-200', raw: '#059669' };
  } else if (score >= 65) {
    return { text: 'text-amber-700 font-semibold', bg: 'bg-amber-50', border: 'border-amber-200', raw: '#D97706' };
  } else {
    return { text: 'text-rose-700 font-semibold', bg: 'bg-rose-50', border: 'border-rose-200', raw: '#DC2626' };
  }
}

export function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'Critical':
      return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
    case 'High':
      return 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
    case 'Medium':
      return 'bg-sky-50 text-sky-700 border-sky-200 font-semibold';
    case 'Low':
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 font-semibold';
  }
}
