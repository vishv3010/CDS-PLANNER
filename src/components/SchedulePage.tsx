/* ============================================================
   Schedule Page – Dynamic day-wise clickable calendar
   Uses context for schedule data (based on user config)
   ============================================================ */
import { useState } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight, BookOpen, Calculator,
  Globe, Clock, AlertCircle, Star, X, CheckCircle2, Settings, Edit2
} from 'lucide-react';
import { type DayPlan } from '@/data/schedule';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { usePlan } from '@/context/PlanContext';

interface DayEdit {
  english?: string;
  maths?: string;
  gk?: string;
}

import { type Page } from './Navbar';

interface SchedulePageProps {
  onNavigate?: (page: Page) => void;
}

export default function SchedulePage({ onNavigate }: SchedulePageProps) {
  const { schedule, totalDays, config } = usePlan();
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
  const [viewPhase, setViewPhase] = useState<0 | 1 | 2 | 3>(0);
  const [completedDays, setCompletedDays] = useLocalStorage<number[]>('cds-completed-days', []);
  const [dayEdits, setDayEdits] = useLocalStorage<Record<string, DayEdit>>('cds-day-edits', {});

  const saveDayEdit = (date: string, field: 'english' | 'maths' | 'gk', value: string) => {
    setDayEdits(prev => ({
      ...prev,
      [date]: { ...prev[date], [field]: value },
    }));
  };

  const filteredSchedule = viewPhase === 0
    ? schedule
    : schedule.filter(d => d.phase === viewPhase);

  const phase1Count = schedule.filter(d => d.phase === 1).length;
  const phase2Count = schedule.filter(d => d.phase === 2).length;
  const phase3Count = schedule.filter(d => d.phase === 3).length;

  const toggleDay = (dayNum: number) => {
    setCompletedDays(prev =>
      prev.includes(dayNum)
        ? prev.filter(d => d !== dayNum)
        : [...prev, dayNum]
    );
  };

  const phaseColors: Record<1 | 2 | 3, { bg: string; light: string; badge: string }> = {
    1: { bg: 'bg-blue-500', light: 'bg-blue-50 border-blue-200 text-blue-700', badge: 'bg-blue-100 text-blue-700' },
    2: { bg: 'bg-amber-500', light: 'bg-amber-50 border-amber-200 text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    3: { bg: 'bg-emerald-500', light: 'bg-emerald-50 border-emerald-200 text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
  };

  // Format date range
  const startLabel = schedule[0]?.dateLabel || '';
  const endLabel = schedule[schedule.length - 1]?.dateLabel || '';

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Calendar className="text-primary-600" size={28} />
          {totalDays}-Day Study Schedule
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <p className="text-slate-500">{startLabel} – {endLabel}, 2026 • {config.dailyHours}h/day • Click any day to view details</p>
          {onNavigate && (
            <button
              onClick={() => onNavigate('setup')}
              className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 cursor-pointer font-medium"
            >
              <Settings size={12} /> Change dates/hours
            </button>
          )}
        </div>
      </div>

      {/* Phase filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { val: 0 as const, label: 'All Days', count: totalDays },
          { val: 1 as const, label: 'Phase 1', count: phase1Count },
          { val: 2 as const, label: 'Phase 2', count: phase2Count },
          { val: 3 as const, label: 'Phase 3', count: phase3Count },
        ].map(f => (
          <button
            key={f.val}
            onClick={() => setViewPhase(f.val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${viewPhase === f.val
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
              }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-8 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">
            Overall Progress: {completedDays.filter(d => d <= totalDays).length} / {totalDays} days completed
          </span>
          <span className="text-sm font-bold text-primary-600">
            {Math.round((completedDays.filter(d => d <= totalDays).length / totalDays) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${(completedDays.filter(d => d <= totalDays).length / totalDays) * 100}%` }}
          />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {filteredSchedule.map(day => {
          const isDone = completedDays.includes(day.day);
          const pc = phaseColors[day.phase];
          const isExam = day.day === totalDays;
          return (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day)}
              className={`relative p-3 rounded-xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5 text-left cursor-pointer
                ${isDone
                  ? 'bg-emerald-50 border-emerald-300'
                  : day.isSunday
                    ? 'bg-purple-50 border-purple-200 hover:border-purple-400'
                    : isExam
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300'
                      : 'bg-white border-slate-200 hover:border-primary-300'
                }`}
            >
              {/* Phase dot */}
              <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${pc.bg}`} />

              {/* Done check */}
              {isDone && (
                <div className="absolute -top-1.5 -right-1.5">
                  <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-100" />
                </div>
              )}

              <div className="text-xs font-medium text-slate-400">Day {day.day}</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{day.dateLabel}</div>

              {day.isSunday && !isExam && (
                <div className="mt-1.5 text-xs font-semibold text-purple-600 flex items-center gap-1">
                  <Star size={10} /> Mock Test
                </div>
              )}
              {isExam && (
                <div className="mt-1.5 text-xs font-bold text-amber-600 flex items-center gap-1">
                  🎯 EXAM DAY
                </div>
              )}
              {!day.isSunday && !isExam && (
                <div className={`mt-1.5 text-xs px-1.5 py-0.5 rounded font-medium ${pc.badge}`}>
                  Phase {day.phase}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setSelectedDay(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className={`p-6 rounded-t-2xl ${selectedDay.day === totalDays
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : selectedDay.isSunday
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600'
                  : selectedDay.phase === 1
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700'
                    : selectedDay.phase === 2
                      ? 'bg-gradient-to-r from-amber-500 to-amber-700'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-700'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/80 text-sm font-medium">Day {selectedDay.day} • Phase {selectedDay.phase}</div>
                  <h3 className="text-2xl font-bold text-white mt-1">{selectedDay.dateLabel}, 2026</h3>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              {selectedDay.notes && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                  <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-800">{selectedDay.notes}</p>
                </div>
              )}

              {/* English */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-blue-600" />
                  <span className="font-semibold text-blue-900">English</span>
                  <span className="ml-auto text-xs text-blue-600 font-medium flex items-center gap-1">
                    <Clock size={12} /> {selectedDay.engMinutes} min
                  </span>
                </div>
                <p className="text-sm text-blue-800">{dayEdits[selectedDay.date]?.english || selectedDay.english}</p>
                {dayEdits[selectedDay.date]?.english && <p className="text-[10px] text-blue-500 mt-1 italic">✏️ Edited by you</p>}
              </div>

              {/* Maths */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator size={16} className="text-emerald-600" />
                  <span className="font-semibold text-emerald-900">Maths</span>
                  <span className="ml-auto text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Clock size={12} /> {selectedDay.mathMinutes} min
                  </span>
                </div>
                <p className="text-sm text-emerald-800">{dayEdits[selectedDay.date]?.maths || selectedDay.maths}</p>
                {dayEdits[selectedDay.date]?.maths && <p className="text-[10px] text-emerald-500 mt-1 italic">✏️ Edited by you</p>}
              </div>

              {/* GK */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={16} className="text-amber-600" />
                  <span className="font-semibold text-amber-900">General Knowledge</span>
                  <span className="ml-auto text-xs text-amber-600 font-medium flex items-center gap-1">
                    <Clock size={12} /> {selectedDay.gkMinutes} min
                  </span>
                </div>
                <p className="text-sm text-amber-800">{dayEdits[selectedDay.date]?.gk || selectedDay.gk}</p>
                {dayEdits[selectedDay.date]?.gk && <p className="text-[10px] text-amber-500 mt-1 italic">✏️ Edited by you</p>}
              </div>

              {/* Edit day tasks */}
              {!selectedDay.isSunday && selectedDay.day !== totalDays && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                    <Edit2 size={12} /> Edit Today's Tasks (your changes are saved)
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] font-medium text-blue-600 mb-0.5 block">English</label>
                      <input type="text"
                        value={dayEdits[selectedDay.date]?.english ?? selectedDay.english}
                        onChange={e => saveDayEdit(selectedDay.date, 'english', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-emerald-600 mb-0.5 block">Maths</label>
                      <input type="text"
                        value={dayEdits[selectedDay.date]?.maths ?? selectedDay.maths}
                        onChange={e => saveDayEdit(selectedDay.date, 'maths', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-amber-600 mb-0.5 block">GK</label>
                      <input type="text"
                        value={dayEdits[selectedDay.date]?.gk ?? selectedDay.gk}
                        onChange={e => saveDayEdit(selectedDay.date, 'gk', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* Mark complete */}
              <button
                onClick={() => toggleDay(selectedDay.day)}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2
                  ${completedDays.includes(selectedDay.day)
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200'
                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                  }`}
              >
                <CheckCircle2 size={18} />
                {completedDays.includes(selectedDay.day) ? 'Completed ✓ (Click to undo)' : 'Mark as Completed'}
              </button>
            </div>

            {/* Navigation */}
            <div className="px-6 pb-6 flex items-center justify-between">
              <button
                disabled={selectedDay.day === 1}
                onClick={() => {
                  const prev = schedule.find(d => d.day === selectedDay.day - 1);
                  if (prev) setSelectedDay(prev);
                }}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={16} /> Previous Day
              </button>
              <button
                disabled={selectedDay.day === totalDays}
                onClick={() => {
                  const next = schedule.find(d => d.day === selectedDay.day + 1);
                  if (next) setSelectedDay(next);
                }}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Next Day <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase Legend */}
      <div className="mt-8 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <h4 className="font-semibold text-slate-700 text-sm mb-3">Phase Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-600">Phase 1: Foundation (~35%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600">Phase 2: Practice (~35%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Phase 3: Mocks (~30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-slate-600">Sunday: Mock Test Day</span>
          </div>
        </div>
      </div>
    </div>
  );
}
