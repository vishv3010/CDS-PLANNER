/* ============================================================
   CDS (IMA) 2026 Study Planner – Main App Component
   Routes: Home, Setup, Schedule, English, Maths, GK, Mocks,
   Progress, Notes, DailyTodo, FormulaSheet, HowToRun
   + Floating Pomodoro Timer on all pages
   ============================================================ */
import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Calculator, Globe } from 'lucide-react';
import { PlanProvider, usePlan } from './context/PlanContext';
import Navbar, { type Page } from './components/Navbar';
import SetupPage from './components/SetupPage';
import HomePage from './components/HomePage';
import SchedulePage from './components/SchedulePage';
import SubjectPage from './components/SubjectPage';
import MockTestPage from './components/MockTestPage';
import ProgressPage from './components/ProgressPage';
import HowToRunPage from './components/HowToRunPage';
import NotesPage from './components/NotesPage';
import DailyTodoPage from './components/DailyTodoPage';
import FormulaSheetPage from './components/FormulaSheetPage';
import MistakeTrackerPage from './components/MistakeTrackerPage';
import FlashcardsPage from './components/FlashcardsPage';
import PomodoroTimer from './components/PomodoroTimer';
import { englishTopics, mathsTopics, gkTopics } from './data/schedule';

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const { isConfigured } = usePlan();

  // Show setup page on first visit if not configured
  useEffect(() => {
    if (!isConfigured) {
      setPage('setup');
    }
  }, []); // eslint-disable-line

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const navigate = useCallback((p: Page) => {
    setPage(p);
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'setup':
        return <SetupPage onNavigate={navigate} />;

      case 'home':
        return <HomePage onNavigate={navigate} />;

      case 'schedule':
        return <SchedulePage onNavigate={navigate} />;

      case 'english':
        return (
          <SubjectPage
            title="English"
            subtitle="Grammar, Vocabulary & Comprehension"
            icon={<BookOpen size={28} className="text-white" />}
            color="blue"
            topics={englishTopics}
            storageKey="cds-english-topics"
            examInfo={{ questions: 120, marks: 100, time: '2 Hours', negMarking: '-⅓' }}
            tips={[
              "Start with grammar rules – they're the foundation for all question types.",
              "Solve at least 20 Error Spotting questions daily from Day 10 onwards.",
              "Build vocabulary daily – learn 10 new words with usage examples.",
              "Practice Reading Comprehension under timed conditions (8 min per passage).",
              "Revise Tenses and Subject-Verb Agreement rules every 3 days.",
              "For Cloze Tests, read the entire passage first before filling blanks.",
              "Active/Passive and Direct/Indirect are easy scoring – master the rules!",
            ]}
          />
        );

      case 'maths':
        return (
          <SubjectPage
            title="Elementary Mathematics"
            subtitle="Arithmetic, Algebra, Geometry & Trigonometry"
            icon={<Calculator size={28} className="text-white" />}
            color="emerald"
            topics={mathsTopics}
            storageKey="cds-maths-topics"
            examInfo={{ questions: 100, marks: 100, time: '2 Hours', negMarking: '-⅓' }}
            tips={[
              "Master Percentage first – it's the base for P&L, SI, and many word problems.",
              "Learn shortcut methods for Time & Work and Speed-Time-Distance.",
              "Memorize all Geometry theorems – at least 10-12 questions come from here.",
              "Practice Trigonometry ratios table (0°, 30°, 45°, 60°, 90°) until automatic.",
              "Solve 25+ arithmetic problems daily for speed improvement.",
              "Always verify answers by back-substitution in algebra problems.",
              "Focus on Mensuration formulas – easy marks if you know them well.",
            ]}
          />
        );

      case 'gk':
        return (
          <SubjectPage
            title="General Knowledge"
            subtitle="Polity, History, Geography, Science & Current Affairs"
            icon={<Globe size={28} className="text-white" />}
            color="amber"
            topics={gkTopics}
            storageKey="cds-gk-topics"
            examInfo={{ questions: 120, marks: 100, time: '2 Hours', negMarking: '-⅓' }}
            tips={[
              "Polity is highest scoring – memorize all Articles, Schedules, Amendments.",
              "Modern History (1857-1947): Focus on chronology and key events.",
              "Read NCERT Science (Class 8-10) for all basic science questions.",
              "Current Affairs: Read a monthly digest for the last 10-12 months.",
              "Defence knowledge is CDS-specific – learn about Indian Armed Forces.",
              "Geography: Focus on India's physical features, rivers, and climate.",
              "Make one-liner notes for quick revision before the exam.",
            ]}
          />
        );

      case 'mocks':
        return <MockTestPage />;

      case 'progress':
        return <ProgressPage />;

      case 'notes':
        return <NotesPage />;

      case 'todo':
        return <DailyTodoPage />;

      case 'formulas':
        return <FormulaSheetPage />;

      case 'mistakes':
        return <MistakeTrackerPage />;

      case 'flashcards':
        return <FlashcardsPage />;

      case 'howtorun':
        return <HowToRunPage />;

      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  // Don't show navbar/footer on setup page for clean full-screen experience
  if (page === 'setup') {
    return (
      <>
        {renderPage()}
        <PomodoroTimer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar currentPage={page} onNavigate={navigate} />
      <main className="dark:text-slate-100">{renderPage()}</main>

      {/* Floating Pomodoro Timer */}
      <PomodoroTimer />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="font-semibold text-white">CDS Planner 2026</span>
            </div>
            <p className="text-sm text-center">
              Built for CDS (IMA) aspirants • Study smart, stay consistent, become an officer 🇮🇳
            </p>
            <div className="text-sm text-slate-500">
              Dynamic Plan • Pomodoro Timer • Notes • Formulas
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <PlanProvider>
      <AppContent />
    </PlanProvider>
  );
}
