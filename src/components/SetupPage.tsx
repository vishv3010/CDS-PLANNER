/* ============================================================
   Setup Page – User selects start date, exam date, daily hours
   Dynamically calculates total days and generates the plan
   ============================================================ */
import { useState, useMemo } from 'react';
import {
  Calendar, Clock, ArrowRight, Shield, Zap, Info,
  BookOpen, Calculator, Globe, AlertTriangle, CheckCircle2,
  Settings, Star, Target
} from 'lucide-react';
import { usePlan } from '@/context/PlanContext';
import type { PlanConfig } from '@/data/schedule';

import { type Page } from './Navbar';

interface SetupPageProps {
  onNavigate: (page: Page) => void;
}

export default function SetupPage({ onNavigate }: SetupPageProps) {
  const { config, setConfig, isConfigured } = usePlan();

  const [startDate, setStartDate] = useState(isConfigured ? config.startDate : getTodayStr());
  const [examDate, setExamDate] = useState(config.examDate);
  const [dailyHours, setDailyHours] = useState(config.dailyHours);

  // Calculate total days
  const totalDays = useMemo(() => {
    if (!startDate || !examDate) return 0;
    const s = new Date(startDate + 'T00:00:00');
    const e = new Date(examDate + 'T00:00:00');
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  }, [startDate, examDate]);

  // Calculate time allocation
  const totalMinutes = dailyHours * 60;
  const engMinutes = Math.round(totalMinutes * 0.357);
  const mathMinutes = Math.round(totalMinutes * 0.357);
  const gkMinutes = totalMinutes - engMinutes - mathMinutes;

  // Phase breakdown
  const phase1Days = Math.floor(totalDays * 0.35);
  const phase2Days = Math.floor(totalDays * 0.35);
  const phase3Days = totalDays - phase1Days - phase2Days;

  // Sundays count
  const sundayCount = useMemo(() => {
    if (!startDate || !examDate || totalDays <= 0) return 0;
    let count = 0;
    const s = new Date(startDate + 'T00:00:00');
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(s);
      d.setDate(d.getDate() + i);
      if (d.getDay() === 0) count++;
    }
    return count;
  }, [startDate, examDate, totalDays]);

  const totalStudyHours = (totalDays - sundayCount) * dailyHours;

  const isValid = totalDays >= 7 && startDate && examDate;

  const handleSubmit = () => {
    if (!isValid) return;
    const newConfig: PlanConfig = {
      startDate,
      examDate,
      dailyHours,
    };
    setConfig(newConfig);
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-400 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-sm font-medium mb-6">
            <Shield size={14} />
            CDS (IMA) 2026 Study Planner
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Configure Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mt-2">
              Battle Plan
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Select your start date, exam date, and daily study hours. 
            The planner will automatically create a personalized day-wise schedule for you.
          </p>
        </div>

        {/* Setup Form Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Settings size={20} className="text-amber-300" />
            <h2 className="text-xl font-bold text-white">Plan Configuration</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Start Date */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Calendar size={14} className="text-emerald-400" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-slate-400"
              />
              <p className="mt-1.5 text-xs text-slate-400">When you want to start studying</p>
            </div>

            {/* Exam Date */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Target size={14} className="text-red-400" />
                Exam Date (CDS 1 2026)
              </label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <p className="mt-1.5 text-xs text-slate-400">CDS 1 2026 expected: April 12, 2026</p>
            </div>
          </div>

          {/* Daily Hours Selector */}
          <div className="mb-8">
            <label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Clock size={14} className="text-blue-400" />
              Daily Study Hours
            </label>
            <div className="grid grid-cols-5 gap-3">
              {[2, 3, 4, 5, 6].map(hours => (
                <button
                  key={hours}
                  onClick={() => setDailyHours(hours)}
                  className={`py-4 rounded-xl font-bold text-lg transition-all cursor-pointer border-2
                    ${dailyHours === hours
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-400 shadow-lg shadow-amber-500/30 scale-105'
                      : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10 hover:border-white/30'
                    }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Recommended: 3–4 hours/day for working professionals, 5–6 hours for full-time preparation
            </p>
          </div>

          {/* Time Breakdown Preview */}
          {totalDays > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <Info size={14} className="text-blue-400" />
                Your Daily Time Breakdown ({dailyHours} hours/day)
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-blue-500/20 border border-blue-400/30">
                  <BookOpen size={18} className="text-blue-400 mx-auto mb-1" />
                  <div className="text-xl font-bold text-white">{engMinutes}m</div>
                  <div className="text-xs text-blue-300">English</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
                  <Calculator size={18} className="text-emerald-400 mx-auto mb-1" />
                  <div className="text-xl font-bold text-white">{mathMinutes}m</div>
                  <div className="text-xs text-emerald-300">Maths</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-amber-500/20 border border-amber-400/30">
                  <Globe size={18} className="text-amber-400 mx-auto mb-1" />
                  <div className="text-xl font-bold text-white">{gkMinutes}m</div>
                  <div className="text-xs text-amber-300">GK</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plan Summary Preview */}
        {totalDays > 0 && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Star size={20} className="text-amber-300" />
              Your Plan Summary
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-white">{totalDays}</div>
                <div className="text-xs text-slate-400 mt-1">Total Days</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-amber-300">{dailyHours}h</div>
                <div className="text-xs text-slate-400 mt-1">Per Day</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-emerald-300">{totalStudyHours}h</div>
                <div className="text-xs text-slate-400 mt-1">Total Study</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-bold text-purple-300">{sundayCount}</div>
                <div className="text-xs text-slate-400 mt-1">Mock Tests</div>
              </div>
            </div>

            {/* Phase Breakdown */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-blue-400" />
                  <span className="text-sm font-bold text-blue-300">Phase 1: Foundation</span>
                </div>
                <div className="text-2xl font-bold text-white">{phase1Days} days</div>
                <div className="text-xs text-blue-300 mt-1">High-yield topics + PYQs</div>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-amber-400" />
                  <span className="text-sm font-bold text-amber-300">Phase 2: Practice</span>
                </div>
                <div className="text-2xl font-bold text-white">{phase2Days} days</div>
                <div className="text-xs text-amber-300 mt-1">Syllabus + sectional tests</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300">Phase 3: Mocks</span>
                </div>
                <div className="text-2xl font-bold text-white">{phase3Days} days</div>
                <div className="text-xs text-emerald-300 mt-1">Full mocks + revision</div>
              </div>
            </div>

            {/* Warnings */}
            {totalDays < 14 && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-400/30 flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-300">
                  Very short preparation time! Consider increasing daily hours to {Math.min(6, dailyHours + 2)} hours for better coverage.
                </p>
              </div>
            )}
            {totalDays >= 14 && totalDays <= 30 && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-300">
                  Limited time available. Focus only on high-yield topics and solve maximum PYQs. Every hour counts!
                </p>
              </div>
            )}
            {totalDays > 30 && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-sm text-emerald-300">
                  Good preparation window! You have enough time to cover the entire syllabus thoroughly.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          {!isValid && (
            <p className="text-sm text-red-400 mb-4 flex items-center justify-center gap-2">
              <AlertTriangle size={14} />
              {totalDays <= 0 ? 'Exam date must be after start date' : totalDays < 7 ? 'Minimum 7 days required' : 'Please fill all fields'}
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-all
              ${isValid
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-1 cursor-pointer'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
          >
            {isConfigured ? 'Update & Regenerate Plan' : 'Generate My Study Plan'}
            <ArrowRight size={20} />
          </button>

          {isConfigured && (
            <p className="mt-3 text-xs text-slate-400">
              ⚠️ Regenerating will reset your daily completion progress (topic checklists are preserved)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getTodayStr(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
