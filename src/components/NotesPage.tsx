/* ============================================================
   Notes Page – Per-subject study notes with search & filter
   Saved in localStorage. Supports adding, editing, deleting.
   ============================================================ */
import { useState } from 'react';
import {
  FileText, Plus, Trash2, Edit3, Save, X, Search,
  BookOpen, Calculator, Globe, Star, Pin, Clock
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Note {
  id: string;
  subject: 'english' | 'maths' | 'gk' | 'general';
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

const subjectOptions = [
  { value: 'english' as const, label: 'English', icon: <BookOpen size={14} />, color: 'blue' },
  { value: 'maths' as const, label: 'Maths', icon: <Calculator size={14} />, color: 'emerald' },
  { value: 'gk' as const, label: 'GK', icon: <Globe size={14} />, color: 'amber' },
  { value: 'general' as const, label: 'General', icon: <Star size={14} />, color: 'purple' },
];

const subjectColors: Record<string, { bg: string; text: string; border: string; light: string }> = {
  english: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', light: 'bg-blue-50' },
  maths: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', light: 'bg-emerald-50' },
  gk: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', light: 'bg-amber-50' },
  general: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', light: 'bg-purple-50' },
};

export default function NotesPage() {
  const [notes, setNotes] = useLocalStorage<Note[]>('cds-study-notes', []);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New note form
  const [newSubject, setNewSubject] = useState<Note['subject']>('general');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const createNote = () => {
    if (!newTitle.trim()) return;
    const now = new Date().toISOString();
    const note: Note = {
      id: `note-${Date.now()}`,
      subject: newSubject,
      title: newTitle.trim(),
      content: newContent.trim(),
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [note, ...prev]);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const updateNote = () => {
    if (!editingNote) return;
    setNotes(prev => prev.map(n =>
      n.id === editingNote.id
        ? { ...editingNote, updatedAt: new Date().toISOString() }
        : n
    ));
    setEditingNote(null);
  };

  const deleteNote = (id: string) => {
    if (confirm('Delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, pinned: !n.pinned } : n
    ));
  };

  // Filter and search
  const filtered = notes
    .filter(n => filter === 'all' || n.subject === filter)
    .filter(n =>
      search === '' ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="text-primary-600" size={28} />
            Study Notes
          </h1>
          <p className="text-slate-500 mt-1">{notes.length} notes • Write down key concepts, formulas & revision points</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl shadow-md hover:bg-primary-700 transition-all cursor-pointer"
        >
          <Plus size={18} /> New Note
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all
              ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'}`}
          >
            All ({notes.length})
          </button>
          {subjectOptions.map(s => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center gap-1.5
                ${filter === s.value ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'}`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Create Note Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsCreating(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus size={18} className="text-primary-600" /> New Note
              </h3>
              <button onClick={() => setIsCreating(false)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Subject selector */}
            <div className="flex gap-2 mb-4">
              {subjectOptions.map(s => (
                <button key={s.value} onClick={() => setNewSubject(s.value)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center justify-center gap-1
                    ${newSubject === s.value
                      ? `${subjectColors[s.value].bg} ${subjectColors[s.value].text} border-2 ${subjectColors[s.value].border}`
                      : 'bg-slate-50 text-slate-500 border-2 border-transparent hover:bg-slate-100'}`}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Note title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
              autoFocus
            />
            <textarea
              placeholder="Write your notes here... (formulas, key points, things to remember)"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4 resize-none"
            />
            <button onClick={createNote} disabled={!newTitle.trim()}
              className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Save size={18} /> Save Note
            </button>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setEditingNote(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit3 size={18} className="text-primary-600" /> Edit Note
              </h3>
              <button onClick={() => setEditingNote(null)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              {subjectOptions.map(s => (
                <button key={s.value} onClick={() => setEditingNote({ ...editingNote, subject: s.value })}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center justify-center gap-1
                    ${editingNote.subject === s.value
                      ? `${subjectColors[s.value].bg} ${subjectColors[s.value].text} border-2 ${subjectColors[s.value].border}`
                      : 'bg-slate-50 text-slate-500 border-2 border-transparent hover:bg-slate-100'}`}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={editingNote.title}
              onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
            />
            <textarea
              value={editingNote.content}
              onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4 resize-none"
            />
            <button onClick={updateNote}
              className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all cursor-pointer flex items-center justify-center gap-2">
              <Save size={18} /> Update Note
            </button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">
            {notes.length === 0 ? 'No notes yet' : 'No matching notes'}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {notes.length === 0 ? 'Start taking notes to remember key concepts!' : 'Try a different search or filter'}
          </p>
          {notes.length === 0 && (
            <button onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl cursor-pointer">
              <Plus size={18} /> Create First Note
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(note => {
            const sc = subjectColors[note.subject];
            return (
              <div key={note.id} className={`rounded-2xl border ${sc.border} ${sc.light} overflow-hidden hover:shadow-md transition-all group`}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {note.pinned && <Pin size={12} className="text-amber-500 shrink-0" />}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                        {note.subject.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => togglePin(note.id)} className="p-1 rounded hover:bg-white/50 cursor-pointer" title="Pin">
                        <Pin size={12} className={note.pinned ? 'text-amber-500' : 'text-slate-400'} />
                      </button>
                      <button onClick={() => setEditingNote(note)} className="p-1 rounded hover:bg-white/50 cursor-pointer" title="Edit">
                        <Edit3 size={12} className="text-slate-500" />
                      </button>
                      <button onClick={() => deleteNote(note.id)} className="p-1 rounded hover:bg-white/50 cursor-pointer" title="Delete">
                        <Trash2 size={12} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{note.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-4 whitespace-pre-wrap">{note.content || 'No content'}</p>
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock size={10} />
                    {formatDate(note.updatedAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
