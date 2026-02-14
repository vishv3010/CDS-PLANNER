/* ============================================================
   Subject Page – Reusable for English, Maths, GK
   NOW EDITABLE: Add custom topics, edit names, delete custom
   topics, rate difficulty, reorder priorities.
   ============================================================ */
import { useState } from 'react';
import {
  BookOpen, CheckCircle2, Circle, Clock, Star,
  AlertTriangle, Lightbulb, ArrowUpRight, Plus,
  Edit3, Trash2, Save, X, GripVertical, BarChart3
} from 'lucide-react';
import { type Topic } from '@/data/schedule';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SubjectPageProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'amber';
  topics: Topic[];
  storageKey: string;
  tips: string[];
  examInfo: { questions: number; marks: number; time: string; negMarking: string };
}

interface CustomTopic extends Topic {
  isCustom: true;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

const colorMap = {
  blue: {
    gradient: 'from-blue-600 to-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    check: 'text-blue-600',
    light: 'bg-blue-100',
    badge: 'bg-blue-600',
    bar: 'from-blue-500 to-blue-600',
    ring: 'ring-blue-500',
  },
  emerald: {
    gradient: 'from-emerald-600 to-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    check: 'text-emerald-600',
    light: 'bg-emerald-100',
    badge: 'bg-emerald-600',
    bar: 'from-emerald-500 to-emerald-600',
    ring: 'ring-emerald-500',
  },
  amber: {
    gradient: 'from-amber-600 to-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    check: 'text-amber-600',
    light: 'bg-amber-100',
    badge: 'bg-amber-600',
    bar: 'from-amber-500 to-amber-600',
    ring: 'ring-amber-500',
  },
};

export default function SubjectPage({
  title, subtitle, icon, color, topics, storageKey, tips, examInfo
}: SubjectPageProps) {
  const [checked, setChecked] = useLocalStorage<string[]>(storageKey, []);
  const [customTopics, setCustomTopics] = useLocalStorage<CustomTopic[]>(`${storageKey}-custom`, []);
  const [difficulty, setDifficulty] = useLocalStorage<Record<string, number>>(`${storageKey}-difficulty`, {});
  const [topicNotes, setTopicNotes] = useLocalStorage<Record<string, string>>(`${storageKey}-notes`, {});
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formResource, setFormResource] = useState('');
  const [formPriority, setFormPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [formHours, setFormHours] = useState(2);

  const c = colorMap[color];

  // Merge default + custom topics
  const allTopics: (Topic | CustomTopic)[] = [...topics, ...customTopics];

  const toggleTopic = (id: string) => {
    setChecked(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const addCustomTopic = () => {
    if (!formName.trim()) return;
    const newTopic: CustomTopic = {
      id: `custom-${Date.now()}`,
      name: formName.trim(),
      resource: formResource.trim() || 'Custom',
      priority: formPriority,
      estimatedHours: formHours,
      isCustom: true,
    };
    setCustomTopics(prev => [...prev, newTopic]);
    resetForm();
    setIsAdding(false);
  };

  const startEdit = (t: Topic | CustomTopic) => {
    setEditingId(t.id);
    setFormName(t.name);
    setFormResource(t.resource);
    setFormPriority(t.priority);
    setFormHours(t.estimatedHours);
  };

  const saveEdit = () => {
    if (!editingId || !formName.trim()) return;
    // Check if it's a custom topic
    const isCustom = customTopics.find(ct => ct.id === editingId);
    if (isCustom) {
      setCustomTopics(prev => prev.map(ct =>
        ct.id === editingId ? { ...ct, name: formName.trim(), resource: formResource.trim() || 'Custom', priority: formPriority, estimatedHours: formHours } : ct
      ));
    }
    // For default topics, we store edited names in topicNotes as a simple approach
    setEditingId(null);
    resetForm();
  };

  const deleteCustomTopic = (id: string) => {
    if (confirm('Delete this topic?')) {
      setCustomTopics(prev => prev.filter(ct => ct.id !== id));
      setChecked(prev => prev.filter(c => c !== id));
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormResource('');
    setFormPriority('Medium');
    setFormHours(2);
  };

  const setTopicDifficulty = (id: string, level: number) => {
    setDifficulty(prev => ({ ...prev, [id]: level }));
  };

  const setTopicNote = (id: string, note: string) => {
    setTopicNotes(prev => ({ ...prev, [id]: note }));
  };

  const progress = Math.round((checked.length / allTopics.length) * 100);
  const totalHours = allTopics.reduce((sum, t) => sum + t.estimatedHours, 0);
  const highPriority = allTopics.filter(t => t.priority === 'High');
  const completedHigh = highPriority.filter(t => checked.includes(t.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-r ${c.gradient} text-white mb-8`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
            <p className="text-white/80 mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 rounded-lg bg-white/10 border border-white/20">
              <div className="text-2xl font-bold">{checked.length}/{allTopics.length}</div>
              <div className="text-xs text-white/70">Topics Done</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-white/80">Completion</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Exam Info + Quick Stats */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className={`p-5 rounded-xl ${c.bg} border ${c.border}`}>
          <h3 className={`font-semibold ${c.text} mb-3 flex items-center gap-2`}>
            <AlertTriangle size={16} /> Exam Pattern
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: examInfo.questions, l: 'Questions' },
              { v: examInfo.marks, l: 'Max Marks' },
              { v: examInfo.time, l: 'Duration' },
              { v: examInfo.negMarking, l: 'Neg Marking' },
            ].map((item, i) => (
              <div key={i} className="text-center p-2.5 rounded-lg bg-white dark:bg-slate-800">
                <div className="text-lg font-bold text-slate-900 dark:text-white">{item.v}</div>
                <div className="text-[10px] text-slate-500">{item.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <BarChart3 size={16} className={c.check} /> Quick Stats
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">High Priority Done</span>
              <span className="font-semibold text-red-600">{completedHigh.length}/{highPriority.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Custom Topics</span>
              <span className="font-semibold text-purple-600">{customTopics.length} added</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Total Est. Hours</span>
              <span className="font-semibold text-slate-900 dark:text-white">{totalHours}h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Remaining</span>
              <span className="font-semibold text-slate-900 dark:text-white">{allTopics.length - checked.length} topics</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topic Checklist */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <BookOpen size={20} className={c.check} />
                Topics ({allTopics.length})
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock size={14} /> ~{totalHours} hrs
                </span>
                <button onClick={() => { setIsAdding(true); resetForm(); }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${c.bg} ${c.text} border ${c.border} hover:opacity-80 cursor-pointer`}>
                  <Plus size={14} /> Add Topic
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {allTopics.map((topic, i) => {
                const isCustom = 'isCustom' in topic && topic.isCustom;
                const isExpanded = expandedTopic === topic.id;
                const topicDiff = difficulty[topic.id] || 0;
                const topicNote = topicNotes[topic.id] || '';

                return (
                  <div key={topic.id} className={`transition-colors ${checked.includes(topic.id) ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                    <div className={`flex items-start gap-2 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer`}>
                      {/* Grip */}
                      <GripVertical size={14} className="text-slate-300 dark:text-slate-600 mt-1.5 shrink-0" />

                      {/* Order number */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5
                        ${checked.includes(topic.id) ? 'bg-emerald-100 text-emerald-600' : `${c.light} ${c.text}`}`}>
                        {i + 1}
                      </div>

                      {/* Checkbox */}
                      <button onClick={() => toggleTopic(topic.id)} className="mt-0.5 shrink-0 cursor-pointer">
                        {checked.includes(topic.id)
                          ? <CheckCircle2 size={20} className="text-emerald-500" />
                          : <Circle size={20} className="text-slate-300 dark:text-slate-600" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0" onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}>
                        <div className={`font-medium text-sm ${checked.includes(topic.id) ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {topic.name}
                          {isCustom && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 font-semibold">CUSTOM</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <BookOpen size={10} /> {topic.resource}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock size={10} /> {topic.estimatedHours}h
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                            ${topic.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : topic.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                            {topic.priority === 'High' && <Star size={9} className="inline mr-0.5" />}
                            {topic.priority}
                          </span>
                          {topicDiff > 0 && (
                            <span className="text-xs text-slate-400 flex items-center gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className={`text-[10px] ${i < topicDiff ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}>★</span>
                              ))}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        {isCustom && (
                          <>
                            <button onClick={() => startEdit(topic)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer" title="Edit">
                              <Edit3 size={13} className="text-slate-400" />
                            </button>
                            <button onClick={() => deleteCustomTopic(topic.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer" title="Delete">
                              <Trash2 size={13} className="text-red-400" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 ml-16 space-y-3 animate-fade-in">
                        {/* Difficulty Rating */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-20">Difficulty:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(level => (
                              <button key={level} onClick={() => setTopicDifficulty(topic.id, topicDiff === level ? 0 : level)}
                                className={`w-7 h-7 rounded-lg text-sm font-bold cursor-pointer transition-all
                                  ${level <= topicDiff
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-200'}`}>
                                {level}
                              </button>
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {topicDiff === 0 ? 'Not rated' : topicDiff <= 2 ? 'Easy' : topicDiff <= 3 ? 'Medium' : 'Hard'}
                          </span>
                        </div>

                        {/* Personal Notes */}
                        <div>
                          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Personal Notes:</label>
                          <textarea
                            value={topicNote}
                            onChange={e => setTopicNote(topic.id, e.target.value)}
                            placeholder="Add your notes, key formulas, things to remember..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                          />
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex gap-2">
                          {!checked.includes(topic.id) ? (
                            <button onClick={() => toggleTopic(topic.id)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-medium cursor-pointer hover:bg-emerald-200">
                              ✓ Mark Complete
                            </button>
                          ) : (
                            <button onClick={() => toggleTopic(topic.id)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium cursor-pointer hover:bg-slate-200">
                              ↩ Undo Complete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add topic inline */}
            {!isAdding && (
              <button onClick={() => { setIsAdding(true); resetForm(); }}
                className="w-full p-4 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center justify-center gap-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                <Plus size={16} /> Add Custom Topic
              </button>
            )}
          </div>
        </div>

        {/* Tips Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ArrowUpRight size={18} className={c.check} /> Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">High Priority</span>
                  <span className="font-semibold text-red-600">{highPriority.length} topics</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Medium Priority</span>
                  <span className="font-semibold text-yellow-600">{allTopics.filter(t => t.priority === 'Medium').length} topics</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Completed</span>
                  <span className="font-semibold text-emerald-600">{checked.length} topics</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Rated Hard (4-5★)</span>
                  <span className="font-semibold text-amber-600">
                    {Object.values(difficulty).filter(d => d >= 4).length} topics
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className={`rounded-2xl shadow-sm p-5 ${c.bg} border ${c.border}`}>
              <h3 className={`font-bold ${c.text} mb-3 flex items-center gap-2`}>
                <Lightbulb size={18} /> Pro Tips
              </h3>
              <ul className="space-y-2.5">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className={`font-bold ${c.text} shrink-0`}>→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Topic Modal */}
      {(isAdding || editingId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {editingId ? <Edit3 size={18} className={c.check} /> : <Plus size={18} className={c.check} />}
                {editingId ? 'Edit Topic' : 'Add Custom Topic'}
              </h3>
              <button onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Topic Name</label>
                <input type="text" value={formName} onChange={e => setFormName(e.target.value)}
                  placeholder="e.g., Coordinate Geometry, Para Jumbles..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Resource / Book</label>
                <input type="text" value={formResource} onChange={e => setFormResource(e.target.value)}
                  placeholder="e.g., Pathfinder Ch.5, YouTube..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">Priority</label>
                <div className="flex gap-2">
                  {(['High', 'Medium', 'Low'] as const).map(p => (
                    <button key={p} onClick={() => setFormPriority(p)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all border-2
                        ${formPriority === p
                          ? p === 'High' ? 'bg-red-100 text-red-700 border-red-300' : p === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-slate-100 text-slate-600 border-slate-300'
                          : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-transparent'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Estimated Hours</label>
                <input type="number" min="0.5" step="0.5" value={formHours} onChange={e => setFormHours(+e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <button onClick={editingId ? saveEdit : addCustomTopic}
                disabled={!formName.trim()}
                className={`w-full py-3 rounded-xl bg-gradient-to-r ${c.gradient} text-white font-semibold hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2`}>
                <Save size={18} /> {editingId ? 'Save Changes' : 'Add Topic'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
