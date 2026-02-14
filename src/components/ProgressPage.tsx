/* ============================================================
   Progress Page – Overall checklist-style progress tracker
   Uses context for dynamic schedule data
   ============================================================ */
import { useRef } from 'react';
import {
  CheckSquare, CheckCircle2, Circle, TrendingUp, Calendar,
  BookOpen, Calculator, Globe, Target, Flame, Award, RotateCcw,
  Download, Upload
} from 'lucide-react';
import { englishTopics, mathsTopics, gkTopics } from '@/data/schedule';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { usePlan } from '@/context/PlanContext';

export default function ProgressPage() {
  const { schedule, totalDays, config, resetPlan } = usePlan();
  const [engChecked] = useLocalStorage<string[]>('cds-english-topics', []);
  const [mathChecked] = useLocalStorage<string[]>('cds-maths-topics', []);
  const [gkChecked] = useLocalStorage<string[]>('cds-gk-topics', []);
  const [completedDays, setCompletedDays] = useLocalStorage<number[]>('cds-completed-days', []);
  const [milestones, setMilestones] = useLocalStorage<string[]>('cds-milestones', []);

  const totalTopics = englishTopics.length + mathsTopics.length + gkTopics.length;
  const doneTopics = engChecked.length + mathChecked.length + gkChecked.length;
  const topicProgress = Math.round((doneTopics / totalTopics) * 100);
  const validCompleted = completedDays.filter(d => d <= totalDays);
  const dayProgress = totalDays > 0 ? Math.round((validCompleted.length / totalDays) * 100) : 0;

  const subjects = [
    { name: 'English', icon: <BookOpen size={20} />, color: 'blue' as const, total: englishTopics.length, done: engChecked.length, topics: englishTopics, checked: engChecked },
    { name: 'Mathematics', icon: <Calculator size={20} />, color: 'emerald' as const, total: mathsTopics.length, done: mathChecked.length, topics: mathsTopics, checked: mathChecked },
    { name: 'General Knowledge', icon: <Globe size={20} />, color: 'amber' as const, total: gkTopics.length, done: gkChecked.length, topics: gkTopics, checked: gkChecked },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', bar: 'bg-blue-500', light: 'bg-blue-100' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', bar: 'bg-emerald-500', light: 'bg-emerald-100' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', bar: 'bg-amber-500', light: 'bg-amber-100' },
  };

  const milestoneList = [
    { id: 'ms-1', label: 'Started the study plan', emoji: '🚀' },
    { id: 'ms-2', label: 'Completed Phase 1 (Foundation)', emoji: '📚' },
    { id: 'ms-3', label: 'First mock test completed', emoji: '📝' },
    { id: 'ms-4', label: 'Solved 500+ PYQ questions', emoji: '💡' },
    { id: 'ms-5', label: 'Completed Phase 2 (Practice)', emoji: '🔥' },
    { id: 'ms-6', label: 'Scored 150+ in a mock test', emoji: '📈' },
    { id: 'ms-7', label: 'All English topics covered', emoji: '🇬🇧' },
    { id: 'ms-8', label: 'All Maths topics covered', emoji: '🔢' },
    { id: 'ms-9', label: 'All GK topics covered', emoji: '🌍' },
    { id: 'ms-10', label: 'Completed Phase 3 (Mocks)', emoji: '🎯' },
    { id: 'ms-11', label: 'Scored 180+ in a mock test', emoji: '🏆' },
    { id: 'ms-12', label: 'Full syllabus revision done', emoji: '✅' },
    { id: 'ms-13', label: 'Ready for exam day!', emoji: '💪' },
  ];

  const toggleMilestone = (id: string) => {
    setMilestones(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  // Streak calculation
  const sortedDays = [...validCompleted].sort((a, b) => a - b);
  let streak = 0;
  if (sortedDays.length) {
    streak = 1;
    for (let i = sortedDays.length - 1; i > 0; i--) {
      if (sortedDays[i] - sortedDays[i - 1] === 1) streak++;
      else break;
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <CheckSquare className="text-primary-600" size={28} />
          Progress Tracker
        </h1>
        <p className="text-slate-500 mt-2">
          {totalDays}-day plan • {config.dailyHours}h/day • Track your preparation journey
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-200">
          <Calendar size={20} className="text-primary-200 mb-2" />
          <div className="text-3xl font-bold">{validCompleted.length}/{totalDays}</div>
          <div className="text-sm text-primary-200">Days Completed</div>
          <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${dayProgress}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-200">
          <Target size={20} className="text-emerald-200 mb-2" />
          <div className="text-3xl font-bold">{doneTopics}/{totalTopics}</div>
          <div className="text-sm text-emerald-200">Topics Covered</div>
          <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${topicProgress}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200">
          <Flame size={20} className="text-amber-200 mb-2" />
          <div className="text-3xl font-bold">{streak}</div>
          <div className="text-sm text-amber-200">Day Streak 🔥</div>
          <div className="mt-2 text-xs text-amber-200">Keep going!</div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 text-white shadow-lg shadow-purple-200">
          <Award size={20} className="text-purple-200 mb-2" />
          <div className="text-3xl font-bold">{milestones.length}/{milestoneList.length}</div>
          <div className="text-sm text-purple-200">Milestones Hit</div>
          <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${(milestones.length / milestoneList.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Progress */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-600" />
            Subject-wise Progress
          </h2>

          {subjects.map(sub => {
            const pct = sub.total > 0 ? Math.round((sub.done / sub.total) * 100) : 0;
            const cm = colorMap[sub.color];
            return (
              <div key={sub.name} className={`p-5 rounded-xl ${cm.bg} border ${cm.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg ${cm.light} flex items-center justify-center ${cm.text}`}>
                      {sub.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{sub.name}</h3>
                      <p className="text-xs text-slate-500">{sub.done} of {sub.total} topics</p>
                    </div>
                  </div>
                  <span className={`text-2xl font-bold ${cm.text}`}>{pct}%</span>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden">
                  <div className={`h-full ${cm.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sub.topics.map(t => (
                    <div key={t.id} title={t.name}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-all
                        ${sub.checked.includes(t.id) ? `${cm.bar} text-white` : 'bg-white border border-slate-200 text-slate-400'}`}>
                      {sub.checked.includes(t.id) ? '✓' : ''}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestones + Day Grid */}
        <div className="space-y-6">
          {/* Milestones */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Award size={20} className="text-amber-500" />
              Milestones
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {milestoneList.map(ms => (
                  <button key={ms.id} onClick={() => toggleMilestone(ms.id)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-all text-left cursor-pointer">
                    {milestones.includes(ms.id)
                      ? <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                      : <Circle size={20} className="text-slate-300 shrink-0" />}
                    <span className="text-lg mr-2">{ms.emoji}</span>
                    <span className={`text-sm font-medium ${milestones.includes(ms.id) ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {ms.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Daily completion grid */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-primary-600" />
              Daily Completion Grid
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <div className="grid grid-cols-10 gap-1.5">
                {schedule.map(day => (
                  <button
                    key={day.day}
                    title={`Day ${day.day} - ${day.dateLabel}`}
                    onClick={() => {
                      setCompletedDays(prev =>
                        prev.includes(day.day) ? prev.filter(d => d !== day.day) : [...prev, day.day]
                      );
                    }}
                    className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all cursor-pointer
                      ${completedDays.includes(day.day)
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : day.isSunday
                          ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                          : day.day === totalDays
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                  >
                    {day.day}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500" /> Done</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100" /> Sunday</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100" /> Exam</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100" /> Pending</span>
              </div>
            </div>
          </div>

          {/* Export/Import */}
          <ExportImportSection />

          {/* Reset */}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
                resetPlan();
                window.location.reload();
              }
            }}
            className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-medium text-sm hover:bg-red-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );
}

/* Export/Import Component */
function ExportImportSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const keys = [
      'cds-plan-config', 'cds-completed-days', 'cds-mock-tests',
      'cds-english-topics', 'cds-maths-topics', 'cds-gk-topics',
      'cds-milestones', 'cds-study-notes', 'cds-daily-todos',
      'cds-flashcards', 'cds-mistakes', 'cds-day-edits',
      'cds-english-topics-custom', 'cds-maths-topics-custom', 'cds-gk-topics-custom',
      'cds-english-topics-difficulty', 'cds-maths-topics-difficulty', 'cds-gk-topics-difficulty',
      'cds-english-topics-notes', 'cds-maths-topics-notes', 'cds-gk-topics-notes',
      'cds-total-focus-time', 'cds-dark-mode',
    ];
    const data: Record<string, string | null> = {};
    keys.forEach(k => {
      const v = localStorage.getItem(k);
      if (v !== null) data[k] = v;
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cds-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (typeof data !== 'object') throw new Error('Invalid');
        if (!confirm('This will overwrite all your current progress. Continue?')) return;
        Object.entries(data).forEach(([k, v]) => {
          if (typeof v === 'string') localStorage.setItem(k, v);
        });
        alert('Data imported successfully! The page will reload.');
        window.location.reload();
      } catch {
        alert('Invalid backup file. Please select a valid CDS Planner backup JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-5">
      <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
        <Download size={18} className="text-primary-600" /> Backup & Restore
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Export all your progress, notes, and settings as a JSON file. Import it on any device to restore everything.
      </p>
      <div className="flex gap-3">
        <button onClick={exportData}
          className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 cursor-pointer flex items-center justify-center gap-2">
          <Download size={16} /> Export
        </button>
        <button onClick={() => fileInputRef.current?.click()}
          className="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer flex items-center justify-center gap-2">
          <Upload size={16} /> Import
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={importData} className="hidden" />
      </div>
    </div>
  );
}
