import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-100/90 border-t border-slate-200/80 text-slate-600 text-xs py-12 px-4 sm:px-6 lg:px-8 font-serif-luxury relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Col */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
              <Shield className="w-4 h-4 text-sky-600" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-base font-serif-luxury">CodeShield AI</span>
          </div>
          <p className="text-slate-500 leading-relaxed font-sans text-xs">
            Enterprise-grade, AI-powered online assessment & monitoring platform. Next-generation proctoring with evidence-backed confidence scoring.
          </p>
          <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-700 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All AI Proctor Nodes Operational</span>
          </div>
        </div>

        {/* Security Features */}
        <div>
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3 font-serif-luxury">AI Security Core</h4>
          <ul className="space-y-2 text-slate-600 font-sans text-xs">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Neural Face Mesh Tracking</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Multi-Monitor & Blur Guard</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Safe Exam Browser Lockdown</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Audio & Voice Isolation</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3 font-serif-luxury">Platform Links</h4>
          <ul className="space-y-2 text-slate-600 font-serif-luxury text-xs">
            <li><a href="/dashboard" className="hover:text-sky-700 transition-colors">Candidate Hub</a></li>
            <li><a href="/admin/dashboard" className="hover:text-sky-700 transition-colors">Admin Command Center</a></li>
            <li><a href="/exam/101" className="hover:text-sky-700 transition-colors">Go Coding Workspace</a></li>
            <li><a href="/leaderboard" className="hover:text-sky-700 transition-colors">Global Leaderboard</a></li>
            <li><a href="/admin/logs" className="hover:text-sky-700 transition-colors">Proctor Audit Logs</a></li>
          </ul>
        </div>

        {/* Compliance & Standards */}
        <div>
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3 font-serif-luxury">Enterprise Standards</h4>
          <p className="text-slate-500 mb-3 font-sans text-xs">SOC 2 Type II Certified, GDPR compliant proctoring telemetry with zero biometric retention.</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-700 shadow-2xs">ISO/IEC 27001</span>
            <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-700 shadow-2xs">SafeExam Protocol</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-sans">
        <p>© 2026 CodeShield AI Inc. Inspired by HackerRank & Safe Exam Browser.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-800">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-slate-800">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-slate-800">Security Telemetry</a>
        </div>
      </div>
    </footer>
  );
};
