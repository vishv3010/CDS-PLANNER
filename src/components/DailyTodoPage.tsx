/* ============================================================
   Daily To-Do Page – Daily task manager with custom tasks
   Auto-loads today's schedule tasks + user can add own tasks.
   Calendar picker to view any day. Motivational quotes.
   ============================================================ */
import { useState, useMemo } from 'react';
import {
  ListTodo, Plus, Trash2, CheckCircle2, Circle, ChevronLeft,
  ChevronRight, Calendar, Clock, Sparkles, BookOpen, Calculator,
  Globe, X, GripVertical, Tag
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { usePlan } from '@/context/PlanContext';

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  category: 'english' | 'maths' | 'gk' | 'custom';
  priority: 'high' | 'normal' | 'low';
}

interface DayTodos {
  [dateKey: string]: TodoItem[];
}

const motivationalQuotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "A soldier who fights for his country's honor doesn't back down.", author: "Unknown" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { text: "Every champion was once a contender who refused to give up.", author: "Rocky Balboa" },
  { text: "Pain is temporary. Quitting lasts forever.", author: "Lance Armstrong" },
  { text: "An army marches on its stomach, but conquers with its mind.", author: "Napoleon" },
  { text: "The uniform is a symbol of honor – earn it through preparation.", author: "Unknown" },
  { text: "Study hard today, salute the nation tomorrow.", author: "Unknown" },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  english: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  maths: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  gk: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  custom: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
};

const categoryIcons: Record<string, React.ReactNode> = {
  english: <BookOpen size={12} />,
  maths: <Calculator size={12} />,
  gk: <Globe size={12} />,
  custom: <Tag size={12} />,
};

export default function DailyTodoPage() {
  const { schedule } = usePlan();
  const [todos, setTodos] = useLocalStorage<DayTodos>('cds-daily-todos', {});
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [newTask, setNewTask] = useState('');
  const [newCategory, setNewCategory] = useState<TodoItem['category']>('custom');
  const [newPriority, setNewPriority] = useState<TodoItem['priority']>('normal');
  const [showAdd, setShowAdd] = useState(false);

  // Get today's quote
  const todayQuote = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return motivationalQuotes[dayOfYear % motivationalQuotes.length];
  }, []);

  // Get schedule day for selected date
  const scheduledDay = schedule.find(d => d.date === selectedDate);

  // Auto-generate scheduled tasks for the day if none exist
  const allTasks = useMemo(() => {
    const existing = todos[selectedDate] || [];
    if (existing.length > 0) return existing;

    // Auto-generate from schedule
    const auto: TodoItem[] = [];
    if (scheduledDay && !scheduledDay.isSunday && scheduledDay.english !== 'EXAM DAY') {
      auto.push({
        id: `auto-eng-${selectedDate}`,
        text: scheduledDay.english,
        done: false,
        category: 'english',
        priority: 'high',
      });
      auto.push({
        id: `auto-math-${selectedDate}`,
        text: scheduledDay.maths,
        done: false,
        category: 'maths',
        priority: 'high',
      });
      auto.push({
        id: `auto-gk-${selectedDate}`,
        text: scheduledDay.gk,
        done: false,
        category: 'gk',
        priority: 'high',
      });
    } else if (scheduledDay?.isSunday) {
      auto.push({
        id: `auto-mock-${selectedDate}`,
        text: 'Full Mock Test – All 3 subjects under exam conditions',
        done: false,
        category: 'custom',
        priority: 'high',
      });
      auto.push({
        id: `auto-analysis-${selectedDate}`,
        text: 'Analyze mock test – identify weak areas & mistakes',
        done: false,
        category: 'custom',
        priority: 'high',
      });
    }
    return auto;
  }, [selectedDate, todos, scheduledDay]);

  const saveTodos = (newTodos: TodoItem[]) => {
    setTodos(prev => ({ ...prev, [selectedDate]: newTodos }));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: TodoItem = {
      id: `todo-${Date.now()}`,
      text: newTask.trim(),
      done: false,
      category: newCategory,
      priority: newPriority,
    };
    const updated = [...allTasks, task];
    saveTodos(updated);
    setNewTask('');
    setShowAdd(false);
  };

  const toggleTask = (id: string) => {
    const updated = allTasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveTodos(updated);
  };

  const deleteTask = (id: string) => {
    const updated = allTasks.filter(t => t.id !== id);
    saveTodos(updated);
  };

  const navigateDate = (direction: -1 | 1) => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + direction);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const isToday = selectedDate === getTodayStr();
  const completedCount = allTasks.filter(t => t.done).length;
  const totalCount = allTasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <ListTodo className="text-primary-600" size={28} />
          Daily Tasks
        </h1>
        <p className="text-slate-500 mt-1">Your day-by-day study checklist with auto-loaded schedule</p>
      </div>

      {/* Motivational Quote */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="text-amber-300 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium italic">"{todayQuote.text}"</p>
            <p className="text-xs text-primary-200 mt-1">— {todayQuote.author}</p>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <button onClick={() => navigateDate(-1)}
          className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all">
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-2">
            <Calendar size={16} className="text-primary-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="text-sm font-medium text-slate-900 bg-transparent border-none focus:outline-none cursor-pointer text-center"
            />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{formatDateLabel(selectedDate)}</p>
          {isToday && (
            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              TODAY
            </span>
          )}
          {scheduledDay && (
            <span className="inline-block mt-1 ml-1 text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              Day {scheduledDay.day} • Phase {scheduledDay.phase}
            </span>
          )}
        </div>
        <button onClick={() => navigateDate(1)}
          className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-all">
          <ChevronRight size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Progress */}
      {totalCount > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              {completedCount}/{totalCount} tasks done
            </span>
            <span className={`text-sm font-bold ${progress === 100 ? 'text-emerald-600' : 'text-primary-600'}`}>
              {progress}% {progress === 100 && '🎉'}
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Schedule Info */}
      {scheduledDay && !scheduledDay.isSunday && scheduledDay.english !== 'EXAM DAY' && (
        <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Clock size={12} />
            Today's time allocation
          </div>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700 font-medium">
              Eng: {scheduledDay.engMinutes}m
            </span>
            <span className="text-xs px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-medium">
              Math: {scheduledDay.mathMinutes}m
            </span>
            <span className="text-xs px-2 py-1 rounded-lg bg-amber-100 text-amber-700 font-medium">
              GK: {scheduledDay.gkMinutes}m
            </span>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4">
        {allTasks.length === 0 ? (
          <div className="p-8 text-center">
            <ListTodo size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm mb-3">No tasks for this day</p>
            <button onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg cursor-pointer">
              <Plus size={16} /> Add Task
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {allTasks.sort((a, b) => {
              // Sort: undone first, then by priority
              if (a.done !== b.done) return a.done ? 1 : -1;
              const pOrder = { high: 0, normal: 1, low: 2 };
              return pOrder[a.priority] - pOrder[b.priority];
            }).map(task => {
              const cc = categoryColors[task.category];
              return (
                <div key={task.id} className={`flex items-start gap-3 p-4 group transition-colors ${task.done ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                  <GripVertical size={14} className="text-slate-300 mt-1 shrink-0 opacity-0 group-hover:opacity-100" />
                  <button onClick={() => toggleTask(task.id)} className="mt-0.5 shrink-0 cursor-pointer">
                    {task.done
                      ? <CheckCircle2 size={20} className="text-emerald-500" />
                      : <Circle size={20} className="text-slate-300 hover:text-primary-400" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${task.done ? 'line-through text-slate-400' : 'text-slate-900 font-medium'}`}>
                      {task.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cc.bg} ${cc.text} flex items-center gap-1`}>
                        {categoryIcons[task.category]} {task.category}
                      </span>
                      {task.priority === 'high' && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-100 text-red-600">HIGH</span>
                      )}
                      {task.priority === 'low' && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">LOW</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 cursor-pointer transition-all">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task */}
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-sm font-medium hover:border-primary-400 hover:text-primary-600 cursor-pointer transition-all flex items-center justify-center gap-2">
          <Plus size={16} /> Add Custom Task
        </button>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 text-sm">Add New Task</h3>
            <button onClick={() => setShowAdd(false)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
              <X size={16} className="text-slate-400" />
            </button>
          </div>

          <input
            type="text"
            placeholder="What do you need to study?"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
            autoFocus
          />

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-slate-500 self-center">Category:</span>
            {(['english', 'maths', 'gk', 'custom'] as const).map(cat => (
              <button key={cat} onClick={() => setNewCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all flex items-center gap-1
                  ${newCategory === cat
                    ? `${categoryColors[cat].bg} ${categoryColors[cat].text} border ${categoryColors[cat].border}`
                    : 'bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100'}`}
              >
                {categoryIcons[cat]} {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs text-slate-500 self-center">Priority:</span>
            {(['high', 'normal', 'low'] as const).map(p => (
              <button key={p} onClick={() => setNewPriority(p)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all capitalize
                  ${newPriority === p
                    ? p === 'high' ? 'bg-red-100 text-red-600 border border-red-200'
                      : p === 'low' ? 'bg-slate-200 text-slate-600 border border-slate-300'
                      : 'bg-primary-100 text-primary-600 border border-primary-200'
                    : 'bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100'}`}
              >
                {p}
              </button>
            ))}
          </div>

          <button onClick={addTask} disabled={!newTask.trim()}
            className="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Plus size={16} /> Add Task
          </button>
        </div>
      )}

      {/* Quick Navigate */}
      {!isToday && (
        <button onClick={() => setSelectedDate(getTodayStr())}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 cursor-pointer transition-all">
          ← Go to Today
        </button>
      )}
    </div>
  );
}

function getTodayStr(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
