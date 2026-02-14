/* ============================================================
   Mock Test Page – Score tracking UI (localStorage)
   Uses context for dynamic schedule
   ============================================================ */
import { useState, useEffect } from 'react';
import {
  BarChart3, PenLine, Save, X, Trophy, TrendingUp,
  AlertCircle, Target, Calendar
} from 'lucide-react';
import { getInitialMocks, type MockTest } from '@/data/schedule';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { usePlan } from '@/context/PlanContext';

interface ScoreInput {
  total: number;
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
}

export default function MockTestPage() {
  const { schedule } = usePlan();
  const initialMocks = getInitialMocks(schedule);
  const [mocks, setMocks] = useLocalStorage<MockTest[]>('cds-mock-tests', initialMocks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState<'english' | 'maths' | 'gk'>('english');
  const [form, setForm] = useState<ScoreInput>({ total: 120, attempted: 0, correct: 0, wrong: 0, score: 0 });

  // Sync mocks with schedule changes
  useEffect(() => {
    const newMocks = getInitialMocks(schedule);
    if (newMocks.length !== mocks.length) {
      setMocks(newMocks);
    }
  }, [schedule.length]); // eslint-disable-line

  const openEdit = (mockId: string, subject: 'english' | 'maths' | 'gk') => {
    const mock = mocks.find(m => m.id === mockId);
    if (!mock) return;
    const existing = mock[subject];
    const defaultTotal = subject === 'maths' ? 100 : 120;
    setForm(existing || { total: defaultTotal, attempted: 0, correct: 0, wrong: 0, score: 0 });
    setEditingId(mockId);
    setEditSubject(subject);
  };

  const saveScore = () => {
    if (!editingId) return;
    setMocks(prev => prev.map(m =>
      m.id === editingId
        ? { ...m, [editSubject]: { ...form } }
        : m
    ));
    setEditingId(null);
  };

  const completedMocks = mocks.filter(m => m.english || m.maths || m.gk);
  const totalScores = mocks.map(m => {
    const e = m.english?.score || 0;
    const mt = m.maths?.score || 0;
    const g = m.gk?.score || 0;
    const hasAny = m.english || m.maths || m.gk;
    return hasAny ? e + mt + g : null;
  }).filter((s): s is number => s !== null);

  const bestScore = totalScores.length ? Math.max(...totalScores) : 0;
  const avgScore = totalScores.length ? Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <BarChart3 className="text-primary-600" size={28} />
          Mock Test Score Tracker
        </h1>
        <p className="text-slate-500 mt-2">Track your Sunday mock test scores and analyze progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Calendar size={14} /> Tests Taken
          </div>
          <div className="text-3xl font-bold text-slate-900">{completedMocks.length}</div>
          <div className="text-xs text-slate-400">of {mocks.length} planned</div>
        </div>
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Trophy size={14} /> Best Total
          </div>
          <div className="text-3xl font-bold text-amber-600">{bestScore}</div>
          <div className="text-xs text-slate-400">out of 300</div>
        </div>
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <TrendingUp size={14} /> Average
          </div>
          <div className="text-3xl font-bold text-primary-600">{avgScore}</div>
          <div className="text-xs text-slate-400">out of 300</div>
        </div>
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Target size={14} /> Target
          </div>
          <div className="text-3xl font-bold text-emerald-600">180+</div>
          <div className="text-xs text-slate-400">recommended cutoff</div>
        </div>
      </div>

      {/* Score Trend */}
      {totalScores.length > 0 && (
        <div className="mb-8 p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-600" /> Score Trend
          </h3>
          <div className="flex items-end gap-3 h-40">
            {mocks.map((m, i) => {
              const total = (m.english?.score || 0) + (m.maths?.score || 0) + (m.gk?.score || 0);
              const hasData = m.english || m.maths || m.gk;
              const height = hasData ? Math.max(8, (total / 300) * 100) : 0;
              return (
                <div key={m.id} className="flex-1 flex flex-col items-center gap-1">
                  {hasData && (
                    <span className="text-xs font-bold text-slate-700">{total}</span>
                  )}
                  <div className="w-full max-w-12 rounded-t-lg transition-all duration-500"
                    style={{
                      height: hasData ? `${height}%` : '4px',
                      background: hasData
                        ? total >= 180
                          ? 'linear-gradient(to top, #059669, #10b981)'
                          : total >= 140
                            ? 'linear-gradient(to top, #d97706, #f59e0b)'
                            : 'linear-gradient(to top, #dc2626, #ef4444)'
                        : '#e2e8f0',
                    }}
                  />
                  <span className="text-xs text-slate-500 mt-1">W{i + 1}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500" /> 180+ (Good)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500" /> 140-179</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> Below 140</span>
          </div>
        </div>
      )}

      {/* Mock Tests List */}
      <div className="space-y-4">
        {mocks.map(mock => (
          <div key={mock.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{mock.label}</h3>
                <p className="text-sm text-slate-500">📅 {mock.date}, 2026 (Week {mock.week})</p>
              </div>
              <div className="flex items-center gap-2">
                {(mock.english || mock.maths || mock.gk) && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    Total: {(mock.english?.score || 0) + (mock.maths?.score || 0) + (mock.gk?.score || 0)} / 300
                  </span>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <SubjectScoreCard label="English" color="blue" data={mock.english} maxMarks={100} onEdit={() => openEdit(mock.id, 'english')} />
              <SubjectScoreCard label="Maths" color="emerald" data={mock.maths} maxMarks={100} onEdit={() => openEdit(mock.id, 'maths')} />
              <SubjectScoreCard label="GK" color="amber" data={mock.gk} maxMarks={100} onEdit={() => openEdit(mock.id, 'gk')} />
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
             onClick={() => setEditingId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 capitalize flex items-center gap-2">
                <PenLine size={18} className="text-primary-600" />
                Enter {editSubject} Score
              </h3>
              <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Total Questions</label>
                  <input type="number" value={form.total} onChange={e => setForm(f => ({ ...f, total: +e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Attempted</label>
                  <input type="number" value={form.attempted} onChange={e => setForm(f => ({ ...f, attempted: +e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Correct</label>
                  <input type="number" value={form.correct} onChange={e => setForm(f => ({ ...f, correct: +e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Wrong</label>
                  <input type="number" value={form.wrong} onChange={e => setForm(f => ({ ...f, wrong: +e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Score (after negative marking)</label>
                <input type="number" step="0.01" value={form.score} onChange={e => setForm(f => ({ ...f, score: +e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-700 flex items-start gap-1.5">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  CDS marking: +1 for correct, -0.33 for wrong. Calculate: (Correct × 1) - (Wrong × 0.33)
                </p>
              </div>
              <button onClick={saveScore}
                className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md">
                <Save size={18} /> Save Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SubjectScoreCard({ label, color, data, maxMarks, onEdit }: {
  label: string;
  color: 'blue' | 'emerald' | 'amber';
  data: ScoreInput | null;
  maxMarks: number;
  onEdit: () => void;
}) {
  const colorStyles = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500' },
  };
  const cs = colorStyles[color];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <span className={`font-semibold text-sm ${cs.text}`}>{label}</span>
        <button onClick={onEdit}
          className={`text-xs px-2.5 py-1 rounded-lg ${cs.bg} ${cs.text} font-medium hover:opacity-80 cursor-pointer flex items-center gap-1`}>
          <PenLine size={12} />
          {data ? 'Edit' : 'Add Score'}
        </button>
      </div>
      {data ? (
        <div>
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {data.score}<span className="text-sm font-normal text-slate-400">/{maxMarks}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full ${cs.bar}`} style={{ width: `${Math.max(0, (data.score / maxMarks) * 100)}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs text-slate-500">
            <span>Att: {data.attempted}</span>
            <span className="text-emerald-600">✓ {data.correct}</span>
            <span className="text-red-500">✗ {data.wrong}</span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-400 italic py-2">No score entered yet</div>
      )}
    </div>
  );
}
