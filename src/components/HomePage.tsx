/* ============================================================
   Home Page – CDS (IMA) 2026 strategy overview
   Uses context for dynamic plan info
   ============================================================ */
import {
  Target, Calendar, Clock, BookOpen, TrendingUp, Shield,
  ChevronRight, Star, Zap, Award, ArrowRight, Settings
} from 'lucide-react';
import { usePlan } from '@/context/PlanContext';

import { type Page } from './Navbar';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { config, totalDays, schedule, isConfigured } = usePlan();

  // Calculate phase days
  const phase1Count = schedule.filter(d => d.phase === 1).length;
  const phase2Count = schedule.filter(d => d.phase === 2).length;
  const phase3Count = schedule.filter(d => d.phase === 3).length;
  const sundayCount = schedule.filter(d => d.isSunday).length;

  // Calculate time allocation from first study day
  const firstStudyDay = schedule.find(d => !d.isSunday && d.day !== totalDays);
  const engMin = firstStudyDay?.engMinutes || 75;
  const mathMin = firstStudyDay?.mathMinutes || 75;
  const gkMin = firstStudyDay?.gkMinutes || 60;

  // Phase date ranges
  const phase1Start = schedule.find(d => d.phase === 1)?.dateLabel || '';
  const phase1End = [...schedule].reverse().find(d => d.phase === 1)?.dateLabel || '';
  const phase2Start = schedule.find(d => d.phase === 2)?.dateLabel || '';
  const phase2End = [...schedule].reverse().find(d => d.phase === 2)?.dateLabel || '';
  const phase3Start = schedule.find(d => d.phase === 3)?.dateLabel || '';
  const phase3End = [...schedule].reverse().find(d => d.phase === 3)?.dateLabel || '';

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-sm font-medium mb-6">
              <Shield size={14} />
              Indian Military Academy (IMA)
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              CDS 1 2026
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mt-2">
                {totalDays}-Day Battle Plan
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              A structured, no-nonsense study planner designed to maximize your score in
              <strong className="text-white"> English, General Knowledge & Elementary Mathematics</strong> within {totalDays} focused days.
            </p>

            {/* Config badge */}
            {isConfigured && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm">
                <Settings size={14} />
                Custom plan: {config.dailyHours}h/day • {schedule[0]?.dateLabel} to {schedule[totalDays-1]?.dateLabel}
                <button onClick={() => onNavigate('setup')} className="ml-2 underline hover:text-white cursor-pointer">Change</button>
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('schedule')}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                View {totalDays}-Day Schedule
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onNavigate('setup')}
                className="flex items-center gap-2 px-8 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all cursor-pointer"
              >
                <Settings size={18} />
                {isConfigured ? 'Reconfigure Plan' : 'Configure Dates & Hours'}
              </button>
            </div>
          </div>

          {/* Key stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: <Calendar size={20} />, val: `${totalDays}`, label: 'Days' },
              { icon: <Clock size={20} />, val: `${config.dailyHours} hrs`, label: 'Daily' },
              { icon: <BookOpen size={20} />, val: '3', label: 'Subjects' },
              { icon: <Target size={20} />, val: schedule[totalDays-1]?.dateLabel || 'Apr 12', label: 'Exam Day' },
            ].map((s, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-amber-300 mb-2">
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-white">{s.val}</div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">About CDS (IMA) Exam</h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Combined Defence Services Examination for Indian Military Academy entry
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">English</h3>
              <p className="text-sm text-slate-600 mb-3">120 Questions • 100 Marks • 2 Hours</p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li className="flex items-start gap-2"><Star size={12} className="text-blue-500 mt-1 shrink-0" /> Grammar & Usage</li>
                <li className="flex items-start gap-2"><Star size={12} className="text-blue-500 mt-1 shrink-0" /> Vocabulary & Comprehension</li>
                <li className="flex items-start gap-2"><Star size={12} className="text-blue-500 mt-1 shrink-0" /> Error Spotting & Correction</li>
              </ul>
              <button onClick={() => onNavigate('english')} className="mt-4 text-sm font-semibold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                View Topics <ChevronRight size={14} />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Elementary Maths</h3>
              <p className="text-sm text-slate-600 mb-3">100 Questions • 100 Marks • 2 Hours</p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li className="flex items-start gap-2"><Star size={12} className="text-emerald-500 mt-1 shrink-0" /> Arithmetic & Algebra</li>
                <li className="flex items-start gap-2"><Star size={12} className="text-emerald-500 mt-1 shrink-0" /> Geometry & Mensuration</li>
                <li className="flex items-start gap-2"><Star size={12} className="text-emerald-500 mt-1 shrink-0" /> Trigonometry & Statistics</li>
              </ul>
              <button onClick={() => onNavigate('maths')} className="mt-4 text-sm font-semibold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                View Topics <ChevronRight size={14} />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <Award size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">General Knowledge</h3>
              <p className="text-sm text-slate-600 mb-3">120 Questions • 100 Marks • 2 Hours</p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li className="flex items-start gap-2"><Star size={12} className="text-amber-500 mt-1 shrink-0" /> Polity & Modern History</li>
                <li className="flex items-start gap-2"><Star size={12} className="text-amber-500 mt-1 shrink-0" /> Geography & Science</li>
                <li className="flex items-start gap-2"><Star size={12} className="text-amber-500 mt-1 shrink-0" /> Defence & Current Affairs</li>
              </ul>
              <button onClick={() => onNavigate('gk')} className="mt-4 text-sm font-semibold text-amber-600 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                View Topics <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Phase Strategy */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">3-Phase Strategy</h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Dynamically split across your {totalDays}-day plan for optimal preparation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">PHASE 1</div>
              <div className="p-6 pt-8 rounded-2xl bg-white border border-slate-200 shadow-sm h-full">
                <h3 className="font-bold text-slate-900 text-lg">Foundation & High-Yield</h3>
                <p className="text-sm text-blue-600 font-medium mt-1 mb-4">{phase1Start} – {phase1End} ({phase1Count} days)</p>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2"><Zap size={14} className="text-blue-500 mt-0.5 shrink-0" /> Cover all high-yield topics first</li>
                  <li className="flex items-start gap-2"><Zap size={14} className="text-blue-500 mt-0.5 shrink-0" /> Build strong conceptual foundation</li>
                  <li className="flex items-start gap-2"><Zap size={14} className="text-blue-500 mt-0.5 shrink-0" /> Start solving PYQs from Day 1</li>
                  <li className="flex items-start gap-2"><Zap size={14} className="text-blue-500 mt-0.5 shrink-0" /> Daily: {engMin}m Eng + {mathMin}m Math + {gkMin}m GK</li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">PHASE 2</div>
              <div className="p-6 pt-8 rounded-2xl bg-white border border-slate-200 shadow-sm h-full">
                <h3 className="font-bold text-slate-900 text-lg">Deep Practice & Tests</h3>
                <p className="text-sm text-amber-600 font-medium mt-1 mb-4">{phase2Start} – {phase2End} ({phase2Count} days)</p>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2"><Zap size={14} className="text-amber-500 mt-0.5 shrink-0" /> Complete remaining syllabus</li>
                  <li className="flex items-start gap-2"><Zap size={14} className="text-amber-500 mt-0.5 shrink-0" /> Heavy PYQ solving sessions</li>
                  <li className="flex items-start gap-2"><Zap size={14} className="text-amber-500 mt-0.5 shrink-0" /> Sectional tests every week</li>
                  <li className="flex items-start gap-2"><Zap size={14} className="text-amber-500 mt-0.5 shrink-0" /> Analyze mistakes & plug gaps</li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">PHASE 3</div>
              <div className="p-6 pt-8 rounded-2xl bg-white border border-slate-200 shadow-sm h-full">
                <h3 className="font-bold text-slate-900 text-lg">Mock Tests & Revision</h3>
                <p className="text-sm text-emerald-600 font-medium mt-1 mb-4">{phase3Start} – {phase3End} ({phase3Count} days)</p>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2"><Zap size={14} className="text-emerald-500 mt-0.5 shrink-0" /> Full-length mock tests</li>
                  <li className="flex items-start gap-2"><Zap size={14} className="text-emerald-500 mt-0.5 shrink-0" /> Rapid revision of all subjects</li>
                  <li className="flex items-start gap-2"><Zap size={14} className="text-emerald-500 mt-0.5 shrink-0" /> Weak area improvement drills</li>
                  <li className="flex items-start gap-2"><Zap size={14} className="text-emerald-500 mt-0.5 shrink-0" /> Exam strategy & time management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Structure */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Daily Study Structure</h2>
            <p className="mt-3 text-slate-500">{config.dailyHours} hours of focused study every day</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-5 rounded-xl bg-blue-50 border border-blue-100">
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                  {engMin}m
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">English</h4>
                  <p className="text-sm text-slate-600">Grammar rules + practice questions + vocabulary building</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                  {mathMin}m
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Elementary Maths</h4>
                  <p className="text-sm text-slate-600">Concept learning + formula practice + problem solving</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-xl bg-amber-50 border border-amber-100">
                <div className="w-14 h-14 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                  {gkMin}m
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">General Knowledge</h4>
                  <p className="text-sm text-slate-600">Static GK from Lucent's + NCERT + current affairs reading</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-xl bg-purple-50 border border-purple-100">
                <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                  SUN
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Sunday – Mock Test Day ({sundayCount} total)</h4>
                  <p className="text-sm text-slate-600">Full mock test under exam conditions + detailed error analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Study Resources</h2>
            <p className="mt-3 text-slate-500">All you need – nothing more, nothing less</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-200">
                <BookOpen size={28} />
              </div>
              <h4 className="font-bold text-slate-900">Pathfinder CDS</h4>
              <p className="text-sm text-slate-500 mt-1">English + Maths + PYQs</p>
              <span className="inline-block mt-3 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Primary Resource</span>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-amber-200">
                <Award size={28} />
              </div>
              <h4 className="font-bold text-slate-900">Lucent's GK</h4>
              <p className="text-sm text-slate-500 mt-1">Complete General Knowledge</p>
              <span className="inline-block mt-3 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">GK Bible</span>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-200">
                <Target size={28} />
              </div>
              <h4 className="font-bold text-slate-900">NCERT (8–10)</h4>
              <p className="text-sm text-slate-500 mt-1">Science Basics Foundation</p>
              <span className="inline-block mt-3 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Science Base</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-primary-100 text-lg mb-8">
            Every day counts. Start with Day 1 and stay consistent. You've got this, future officer!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('schedule')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Start Day 1 Now
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('setup')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all cursor-pointer"
            >
              <Settings size={18} />
              Configure Plan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
