import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC<{ theme?: 'light' | 'dark' }> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';

  return (
    <footer className={`w-full text-xs py-12 px-4 sm:px-6 lg:px-8 font-serif-luxury relative z-10 transition-colors duration-300 ${
      isDark
        ? 'bg-[#090909] border-t border-neutral-800/80 text-neutral-400'
        : 'bg-slate-100/90 border-t border-slate-200/80 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Col */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800' 
                : 'bg-sky-50 border-sky-200'
            }`}>
              <Shield className={`w-4 h-4 ${isDark ? 'text-[#7CFF4D]' : 'text-sky-600'}`} />
            </div>
            <span className={`font-bold tracking-tight text-base font-serif-luxury ${isDark ? 'text-white' : 'text-slate-900'}`}>CodeShield AI</span>
          </div>
          <p className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} leading-relaxed font-sans text-xs`}>
            Enterprise-grade, AI-powered online assessment & monitoring platform. Next-generation proctoring with evidence-backed confidence scoring.
          </p>
          <div className={`flex items-center gap-2 pt-2 text-[11px] font-mono ${
            isDark ? 'text-[#7CFF4D]' : 'text-emerald-700'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-[#7CFF4D]' : 'bg-emerald-500'}`}></span>
            <span>All AI Proctor Nodes Operational</span>
          </div>
        </div>

        {/* Security Features */}
        <div>
          <h4 className={`font-semibold uppercase tracking-wider text-[11px] mb-3 font-serif-luxury ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Security Core</h4>
          <ul className="space-y-2 font-sans text-xs">
            <li className="flex items-center gap-1.5"><CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#7CFF4D]' : 'text-sky-600'}`} /> Neural Face Mesh Tracking</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#7CFF4D]' : 'text-sky-600'}`} /> Multi-Monitor & Blur Guard</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#7CFF4D]' : 'text-sky-600'}`} /> Safe Exam Browser Lockdown</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#7CFF4D]' : 'text-sky-600'}`} /> Audio & Voice Isolation</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className={`font-semibold uppercase tracking-wider text-[11px] mb-3 font-serif-luxury ${isDark ? 'text-white' : 'text-slate-900'}`}>Platform Links</h4>
          <ul className="space-y-2 font-serif-luxury text-xs">
            <li><a href="/dashboard" className={`transition-colors ${isDark ? 'hover:text-[#7CFF4D]' : 'hover:text-sky-700'}`}>Candidate Hub</a></li>
            <li><a href="/admin/dashboard" className={`transition-colors ${isDark ? 'hover:text-[#7CFF4D]' : 'hover:text-sky-700'}`}>Admin Command Center</a></li>
            <li><a href="/exam/101" className={`transition-colors ${isDark ? 'hover:text-[#7CFF4D]' : 'hover:text-sky-700'}`}>Go Coding Workspace</a></li>
            <li><a href="/leaderboard" className={`transition-colors ${isDark ? 'hover:text-[#7CFF4D]' : 'hover:text-sky-700'}`}>Global Leaderboard</a></li>
            <li><a href="/admin/logs" className={`transition-colors ${isDark ? 'hover:text-[#7CFF4D]' : 'hover:text-sky-700'}`}>Proctor Audit Logs</a></li>
          </ul>
        </div>

        {/* Compliance & Standards */}
        <div>
          <h4 className={`font-semibold uppercase tracking-wider text-[11px] mb-3 font-serif-luxury ${isDark ? 'text-white' : 'text-slate-900'}`}>Enterprise Standards</h4>
          <p className={`${isDark ? 'text-neutral-500' : 'text-slate-500'} mb-3 font-sans text-xs`}>SOC 2 Type II Certified, GDPR compliant proctoring telemetry with zero biometric retention.</p>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 border rounded text-[10px] font-mono shadow-2xs ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300' 
                : 'bg-white border-slate-200 text-slate-700'
            }`}>ISO/IEC 27001</span>
            <span className={`px-2 py-1 border rounded text-[10px] font-mono shadow-2xs ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300' 
                : 'bg-white border-slate-200 text-slate-700'
            }`}>SafeExam Protocol</span>
          </div>
        </div>

      </div>

      <div className={`max-w-7xl mx-auto mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans ${
        isDark 
          ? 'border-neutral-800 text-neutral-500' 
          : 'border-slate-200/80 text-slate-500'
      }`}>
        <p>© 2026 CodeShield AI Inc. Inspired by HackerRank & Safe Exam Browser.</p>
        <div className="flex items-center gap-4">
          <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-800'}`}>Privacy Policy</a>
          <span>•</span>
          <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-800'}`}>Terms of Service</a>
          <span>•</span>
          <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-800'}`}>Security Telemetry</a>
        </div>
      </div>
    </footer>
  );
};
