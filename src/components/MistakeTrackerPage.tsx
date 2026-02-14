/* ============================================================
   Mistake Tracker – Log weak areas, mistakes from mocks,
   track improvement over time. Filter by subject/status.
   ============================================================ */
import { useState } from 'react';
import {
  AlertTriangle, Plus, Trash2, Edit3, Save, X, Search,
  BookOpen, Calculator, Globe, TrendingUp, CheckCircle2,
  ArrowUp, ArrowRight, ArrowDown, Filter
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Mistake {
  id: string;
  subject: 'english' | 'maths' | 'gk';
  topic: string;
  description: string;
  status: 'weak' | 'improving' | 'mastered';
  mockTest?: string;
  createdAt: string;
  updatedAt: string;
}

const subjectIcons: Record<string, React.ReactNode> = {
  english: <BookOpen size={14} />,
  maths: <Calculator size={14} />,
  gk: <Globe size={14} />,
};

const subjectColors: Record<string, { bg: string; text: string; border: string; light: string }> = {
  english: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', light: 'bg-blue-50' },
  maths: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', light: 'bg-emerald-50' },
  gk: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', light: 'bg-amber-50' },
};

const statusConfig = {
  weak: { label: 'Weak', color: 'bg-red-100 text-red-700 border-red-200', icon: <ArrowDown size={12} />, dot: 'bg-red-500' },
  improving: { label: 'Improving', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <ArrowRight size={12} />, dot: 'bg-amber-500' },
  mastered: { label: 'Mastered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <ArrowUp size={12} />, dot: 'bg-emerald-500' },
};

export default function MistakeTrackerPage() {
  const [mistakes, setMistakes] = useLocalStorage<Mistake[]>('cds-mistakes', []);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formSubject, setFormSubject] = useState<Mistake['subject']>('maths');
  const [formTopic, setFormTopic] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState<Mistake['status']>('weak');
  const [formMock, setFormMock] = useState('');

  const resetForm = () => {
    setFormSubject('maths');
    setFormTopic('');
    setFormDesc('');
    setFormStatus('weak');
    setFormMock('');
  };

  const addMistake = () => {
    if (!formTopic.trim()) return;
    const now = new Date().toISOString();
    const m: Mistake = {
      id: `mistake-${Date.now()}`,
      subject: formSubject,
      topic: formTopic.trim(),
      description: formDesc.trim(),
      status: formStatus,
      mockTest: formMock.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    setMistakes(prev => [m, ...prev]);
    resetForm();
    setIsAdding(false);
  };

  const startEdit = (m: Mistake) => {
    setEditingId(m.id);
    setFormSubject(m.subject);
    setFormTopic(m.topic);
    setFormDesc(m.description);
    setFormStatus(m.status);
    setFormMock(m.mockTest || '');
  };

  const saveEdit = () => {
    if (!editingId || !formTopic.trim()) return;
    setMistakes(prev => prev.map(m =>
      m.id === editingId ? {
        ...m,
        subject: formSubject,
        topic: formTopic.trim(),
        description: formDesc.trim(),
        status: formStatus,
        mockTest: formMock.trim() || undefined,
        updatedAt: new Date().toISOString(),
      } : m
    ));
    setEditingId(null);
    resetForm();
  };

  const deleteMistake = (id: string) => {
    if (confirm('Delete this entry?')) {
      setMistakes(prev => prev.filter(m => m.id !== id));
    }
  };

  const cycleStatus = (id: string) => {
    const order: Mistake['status'][] = ['weak', 'improving', 'mastered'];
    setMistakes(prev => prev.map(m => {
      if (m.id !== id) return m;
      const idx = order.indexOf(m.status);
      return { ...m, status: order[(idx + 1) % 3], updatedAt: new Date().toISOString() };
    }));
  };

  // Filter
  const filtered = mistakes
    .filter(m => filterSubject === 'all' || m.subject === filterSubject)
    .filter(m => filterStatus === 'all' || m.status === filterStatus)
    .filter(m =>
      search === '' ||
      m.topic.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    );

  // Stats
  const weakCount = mistakes.filter(m => m.status === 'weak').length;
  const improvingCount = mistakes.filter(m => m.status === 'improving').length;
  const masteredCount = mistakes.filter(m => m.status === 'mastered').length;

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={28} />
            Mistake & Weakness Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Log mistakes from mocks, track weak areas, and monitor improvement
          </p>
        </div>
        <button onClick={() => { setIsAdding(true); resetForm(); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 transition-all cursor-pointer">
          <Plus size={18} /> Log Mistake
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <div className="text-2xl font-bold text-red-600">{weakCount}</div>
          <div className="text-xs text-red-500 font-medium flex items-center justify-center gap-1">
            <ArrowDown size={12} /> Weak Areas
          </div>
        </div>
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-center">
          <div className="text-2xl font-bold text-amber-600">{improvingCount}</div>
          <div className="text-xs text-amber-500 font-medium flex items-center justify-center gap-1">
            <ArrowRight size={12} /> Improving
          </div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
          <div className="text-2xl font-bold text-emerald-600">{masteredCount}</div>
          <div className="text-xs text-emerald-500 font-medium flex items-center justify-center gap-1">
            <ArrowUp size={12} /> Mastered
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search mistakes..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Filter size={14} className="text-slate-400" />
          </div>
          {['all', 'english', 'maths', 'gk'].map(s => (
            <button key={s} onClick={() => setFilterSubject(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all capitalize
                ${filterSubject === s ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 self-center" />
          {['all', 'weak', 'improving', 'mastered'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all capitalize
                ${filterStatus === s ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(isAdding || editingId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {editingId ? <Edit3 size={18} className="text-primary-600" /> : <Plus size={18} className="text-red-500" />}
                {editingId ? 'Edit Entry' : 'Log New Mistake'}
              </h3>
              <button onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">Subject</label>
              <div className="flex gap-2">
                {(['english', 'maths', 'gk'] as const).map(s => (
                  <button key={s} onClick={() => setFormSubject(s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all flex items-center justify-center gap-1.5 capitalize
                      ${formSubject === s
                        ? `${subjectColors[s].bg} ${subjectColors[s].text} border-2 ${subjectColors[s].border}`
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-2 border-transparent'}`}>
                    {subjectIcons[s]} {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div className="mb-3">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Topic / Area</label>
              <input type="text" value={formTopic} onChange={e => setFormTopic(e.target.value)}
                placeholder="e.g., Trigonometry Identities, Subject-Verb Agreement..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">What went wrong? (optional)</label>
              <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)}
                placeholder="Describe the mistake, what confused you, correct approach..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>

            {/* Mock test ref */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">From which mock test? (optional)</label>
              <input type="text" value={formMock} onChange={e => setFormMock(e.target.value)}
                placeholder="e.g., Mock Test 3, PYQ 2024..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            {/* Status */}
            <div className="mb-5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">Current Status</label>
              <div className="flex gap-2">
                {(['weak', 'improving', 'mastered'] as const).map(s => (
                  <button key={s} onClick={() => setFormStatus(s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all flex items-center justify-center gap-1.5 border-2
                      ${formStatus === s ? statusConfig[s].color : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-transparent'}`}>
                    {statusConfig[s].icon} {statusConfig[s].label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={editingId ? saveEdit : addMistake} disabled={!formTopic.trim()}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              <Save size={18} /> {editingId ? 'Save Changes' : 'Log Mistake'}
            </button>
          </div>
        </div>
      )}

      {/* Mistakes List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle2 size={48} className="text-emerald-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">
            {mistakes.length === 0 ? 'No mistakes logged yet' : 'No matching entries'}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {mistakes.length === 0
              ? 'After each mock test, log your weak areas here to track improvement!'
              : 'Try a different filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => {
            const sc = subjectColors[m.subject];
            const st = statusConfig[m.status];
            return (
              <div key={m.id} className={`p-4 rounded-2xl border ${sc.border} ${sc.light} dark:bg-slate-800/50 dark:border-slate-700 group hover:shadow-md transition-all`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} flex items-center gap-1`}>
                        {subjectIcons[m.subject]} {m.subject}
                      </span>
                      <button onClick={() => cycleStatus(m.id)}
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border cursor-pointer hover:opacity-80 transition-all flex items-center gap-1 ${st.color}`}
                        title="Click to change status">
                        {st.icon} {st.label}
                      </button>
                      {m.mockTest && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">📝 {m.mockTest}</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{m.topic}</h4>
                    {m.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-wrap">{m.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <span>Added: {formatDate(m.createdAt)}</span>
                      {m.createdAt !== m.updatedAt && <span>Updated: {formatDate(m.updatedAt)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => startEdit(m)}
                      className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700 cursor-pointer" title="Edit">
                      <Edit3 size={14} className="text-slate-500" />
                    </button>
                    <button onClick={() => deleteMistake(m.id)}
                      className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700 cursor-pointer" title="Delete">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Improvement Tips */}
      {mistakes.length > 0 && weakCount > 0 && (
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800">
          <h3 className="font-bold text-primary-800 dark:text-primary-300 mb-3 flex items-center gap-2">
            <TrendingUp size={18} /> Improvement Strategy
          </h3>
          <ul className="space-y-2 text-sm text-primary-700 dark:text-primary-400">
            <li>→ You have <strong>{weakCount} weak areas</strong>. Dedicate 15 extra minutes daily to these topics.</li>
            <li>→ Re-solve the questions you got wrong. Understand <em>why</em> you got them wrong.</li>
            <li>→ Click the status badge to cycle through: <strong>Weak → Improving → Mastered</strong></li>
            <li>→ Review this list before every mock test.</li>
            <li>→ Once all entries are "Mastered", you're exam-ready! 💪</li>
          </ul>
        </div>
      )}
    </div>
  );
}
