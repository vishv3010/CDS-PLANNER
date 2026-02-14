/* ============================================================
   Navbar – Responsive navigation with dynamic exam countdown
   Now includes: Notes, Daily Todo, Formula Sheet, Dark Mode
   ============================================================ */
import { useState, useEffect } from 'react';
import {
  BookOpen, Calendar, CheckSquare, BarChart3, Menu, X,
  Languages, Calculator, Globe, Target, Settings, HelpCircle,
  FileText, ListTodo, BookMarked, Moon, Sun, AlertTriangle, Layers
} from 'lucide-react';
import { usePlan } from '@/context/PlanContext';

export type Page = 'home' | 'setup' | 'schedule' | 'english' | 'maths' | 'gk' | 'mocks' | 'progress' | 'howtorun' | 'notes' | 'todo' | 'formulas' | 'mistakes' | 'flashcards';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const mainNavItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'home', label: 'Home', icon: <Target size={18} /> },
  { page: 'schedule', label: 'Schedule', icon: <Calendar size={18} /> },
  { page: 'english', label: 'English', icon: <Languages size={18} /> },
  { page: 'maths', label: 'Maths', icon: <Calculator size={18} /> },
  { page: 'gk', label: 'GK', icon: <Globe size={18} /> },
];

const toolNavItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'todo', label: 'Daily Tasks', icon: <ListTodo size={18} /> },
  { page: 'notes', label: 'Notes', icon: <FileText size={18} /> },
  { page: 'formulas', label: 'Formulas', icon: <BookMarked size={18} /> },
  { page: 'flashcards', label: 'Flashcards', icon: <Layers size={18} /> },
  { page: 'mistakes', label: 'Mistakes', icon: <AlertTriangle size={18} /> },
  { page: 'mocks', label: 'Mock Tests', icon: <BarChart3 size={18} /> },
  { page: 'progress', label: 'Progress', icon: <CheckSquare size={18} /> },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { config } = usePlan();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('cds-dark-mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cds-dark-mode', String(darkMode));
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => { onNavigate('home'); setMobileOpen(false); }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-md shadow-primary-200 dark:shadow-none">
              <BookOpen size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">CDS</span>
              <span className="font-semibold text-primary-600 text-lg ml-1">Planner</span>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {mainNavItems.map(item => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${currentPage === item.page
                    ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
            {toolNavItems.map(item => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${currentPage === item.page
                    ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
            <button onClick={() => onNavigate('setup')}
              className={`p-2 rounded-lg cursor-pointer transition-all ${currentPage === 'setup' ? 'bg-amber-50 text-amber-700' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              title="Setup">
              <Settings size={18} />
            </button>
            <button onClick={() => onNavigate('howtorun')}
              className={`p-2 rounded-lg cursor-pointer transition-all ${currentPage === 'howtorun' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              title="Help">
              <HelpCircle size={18} />
            </button>
          </div>

          {/* Right side: dark mode + countdown */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {/* Exam countdown badge (desktop) */}
            <div className="hidden md:flex">
              <ExamCountdown examDate={config.examDate} />
            </div>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1">Study</p>
            {mainNavItems.map(item => (
              <button
                key={item.page}
                onClick={() => { onNavigate(item.page); setMobileOpen(false); }}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${currentPage === item.page
                    ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1">Tools</p>
              {toolNavItems.map(item => (
                <button
                  key={item.page}
                  onClick={() => { onNavigate(item.page); setMobileOpen(false); }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                    ${currentPage === item.page
                      ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
              <button
                onClick={() => { onNavigate('setup'); setMobileOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Settings size={18} /> Configure Plan
              </button>
              <button
                onClick={() => { onNavigate('howtorun'); setMobileOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <HelpCircle size={18} /> How to Run
              </button>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <ExamCountdown examDate={config.examDate} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function ExamCountdown({ examDate }: { examDate: string }) {
  const exam = new Date(examDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.max(0, Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-700">
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
        {diff > 0 ? `${diff} days to exam` : diff === 0 ? 'EXAM DAY!' : 'Exam completed'}
      </span>
    </div>
  );
}
