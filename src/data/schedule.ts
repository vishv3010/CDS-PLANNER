/* ============================================================
   CDS (IMA) 2026 – DYNAMIC Study Schedule Generator
   Generates plan based on user-selected start date, exam date,
   and daily study hours. Distributes topics across available days.
   ============================================================ */

export interface DayPlan {
  day: number;
  date: string;        // "YYYY-MM-DD"
  dateLabel: string;   // "Feb 14"
  phase: 1 | 2 | 3;
  isSunday: boolean;
  english: string;
  maths: string;
  gk: string;
  notes?: string;
  engMinutes: number;
  mathMinutes: number;
  gkMinutes: number;
}

export interface PlanConfig {
  startDate: string;   // "YYYY-MM-DD"
  examDate: string;    // "YYYY-MM-DD"
  dailyHours: number;  // 2, 3, 4, 5, 6
}

// Helper to format dates
function fmt(d: Date): { iso: string; label: string } {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const iso = d.toISOString().slice(0,10);
  const label = `${months[d.getMonth()]} ${d.getDate()}`;
  return { iso, label };
}

function dateDiffDays(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((b.getTime() - a.getTime()) / msPerDay) + 1;
}

/* ============================================================
   Topic pools – ordered by priority (high-yield first)
   ============================================================ */

const englishPool = [
  "Parts of Speech – Nouns, Pronouns, Adjectives (Pathfinder Ch.1)",
  "Parts of Speech – Verbs, Adverbs, Conjunctions (Pathfinder Ch.1)",
  "Subject–Verb Agreement – Rules & Practice (Pathfinder)",
  "Tenses – Present, Past, Future forms (Pathfinder)",
  "Tenses – Advanced usage + PYQ practice",
  "Articles – Definite/Indefinite rules + practice",
  "Prepositions – Common usage & PYQs",
  "Active & Passive Voice – Rules + conversion drills",
  "Direct & Indirect Speech – Rules + practice",
  "Error Spotting – Type 1: Agreement & Tense errors",
  "Error Spotting – Type 2: Preposition & Article errors",
  "Sentence Improvement – Techniques + PYQ practice",
  "Vocabulary Building – Word lists + Synonyms/Antonyms",
  "Cloze Test – Strategy + practice passages",
  "Reading Comprehension – Technique + 2 passages",
  "Sentence Rearrangement / Para Jumbles – Strategy",
  "Idioms & Phrases – Common ones for CDS",
  "One Word Substitution – 50 important words",
  "Spelling Correction – Common misspelt words",
  "Fill in the Blanks – Vocabulary based + PYQs",
  "Cloze Test – Advanced passages + analysis",
  "Reading Comprehension – Timed practice (3 passages)",
  "Error Spotting – 30 PYQ-style questions",
  "Sentence Improvement – 30 PYQ-style questions",
  "Vocabulary Revision + new word lists",
  "Mixed Grammar Practice – 50 questions (timed)",
  "English Sectional Test 1 (full 120 Qs, 2 hrs)",
  "Analysis of Sectional Test 1 + weak area revision",
  "Advanced RC – Inference & tone-based questions",
  "Active/Passive + Direct/Indirect – 40 PYQs",
  "Error Spotting + Sentence Improvement – 40 PYQs",
  "Vocabulary Final Revision + Idioms recap",
  "English Sectional Test 2 (full 120 Qs, 2 hrs)",
  "Analysis of Sectional Test 2 + targeted revision",
  "English PYQ: Complete 2023 & 2024 papers",
  "Grammar rapid revision (all rules)",
  "RC speed practice – 5 passages in 30 min",
  "Error Spotting + Sentence Improvement marathon",
  "Weak area intensive + formula sheet revision",
  "Grammar quick recap + high-frequency PYQs",
  "Light revision + confidence building practice",
  "Final revision – English cheat sheet review",
  "Relaxed revision + positive visualization",
];

const mathsPool = [
  "Number System – Types, divisibility, factors (Pathfinder)",
  "Number System – HCF, LCM, remainders + PYQs",
  "Simplification – BODMAS, surds, indices (Pathfinder)",
  "Percentage – Concepts + word problems (Pathfinder)",
  "Percentage – Advanced problems + PYQs",
  "Profit & Loss – Formulas + practice (Pathfinder)",
  "Profit & Loss – Discount, successive + PYQs",
  "Ratio & Proportion – Concepts + practice",
  "Average – Problems + shortcut methods",
  "Simple Interest – Formulas + mixed problems",
  "Time & Work – Concepts + pipe/cistern (Pathfinder)",
  "Time & Work – Advanced + PYQs",
  "Speed, Time & Distance – Basics + trains (Pathfinder)",
  "Speed, Time & Distance – Boats, relative speed + PYQs",
  "Linear Equations – Solving methods + word problems",
  "Geometry – Triangles: properties, congruence, similarity",
  "Geometry – Circles: theorems, tangents, chords",
  "Trigonometry – Ratios, standard angles, identities",
  "Trigonometry – Heights & Distances + PYQs",
  "Mensuration – Area of 2D shapes (Pathfinder)",
  "Mensuration – Volume & Surface Area of 3D solids",
  "Statistics – Mean, Median, Mode + problems",
  "Algebra – Quadratic equations + factorization",
  "Geometry – Coordinate geometry basics",
  "Mixed Arithmetic – Percentage + P&L + Ratio (50 Qs)",
  "Mixed Arithmetic – Time/Work + STD + SI (50 Qs)",
  "Maths Sectional Test 1 (full 100 Qs, 2 hrs)",
  "Analysis of Sectional Test 1 + weak area drill",
  "Geometry & Trigonometry – 40 PYQ-style questions",
  "Number System + Simplification – 40 advanced PYQs",
  "Percentage + P&L + Ratio – 40 PYQs (timed)",
  "Time/Work + STD – 40 PYQs (timed)",
  "Linear Equations + Algebra – 30 mixed problems",
  "Mensuration + Statistics – 30 mixed problems",
  "Maths Sectional Test 2 (full 100 Qs, 2 hrs)",
  "Full Maths PYQ: 2023 paper (timed)",
  "Full Maths PYQ: 2024 paper (timed)",
  "Formula sheet revision + shortcut methods",
  "Arithmetic rapid revision (all formulas)",
  "Geometry + Trigonometry rapid revision",
  "Mixed problem set – 60 questions timed",
  "All formulas quick recap + high-frequency PYQs",
  "Light practice – confidence building",
];

const gkPool = [
  "Polity – Preamble, Fundamental Rights (Lucent's)",
  "Polity – DPSP, Fundamental Duties, Amendments",
  "Polity – Parliament: Lok Sabha, Rajya Sabha (Lucent's)",
  "Polity – President, PM, Council of Ministers",
  "Polity – Supreme Court, Judiciary, Writs",
  "Modern History – 1857 Revolt + causes & effects",
  "Modern History – Social Reform movements (1858–1905)",
  "Modern History – Congress sessions, Moderates vs Extremists",
  "Modern History – Gandhi era: NCM, CDM, QIM",
  "Modern History – Independence + Partition",
  "Geography – India: Physical features, rivers, mountains",
  "Geography – Climate, monsoons, soils of India",
  "Geography – World: Physical geography basics",
  "Science – Physics basics: Motion, Force (NCERT 8–10)",
  "Science – Light, Sound, Electricity (NCERT 8–10)",
  "Science – Chemistry: Acids, Bases, Metals (NCERT 8–10)",
  "Science – Biology: Cell, Human body systems (NCERT 8–10)",
  "Defence & Current Affairs – Indian Armed Forces basics",
  "Current Affairs – Recent months digest (Part 1)",
  "Current Affairs – Recent months digest (Part 2)",
  "Polity Revision – All articles, schedules quick recap",
  "History – Ancient India quick overview",
  "History – Medieval India quick overview",
  "Geography – Agriculture, industries, trade of India",
  "Geography – World geography: Continents, oceans recap",
  "Science – Physics: Optics, Magnetism, Modern Physics",
  "Science – Chemistry: Periodic table, reactions recap",
  "Science – Biology: Diseases, nutrition, ecology",
  "Economy – Basic concepts: GDP, inflation, budget basics",
  "Economy – Five Year Plans, NITI Aayog, schemes",
  "Current Affairs – Latest months update (Part 1)",
  "Current Affairs – Latest months update (Part 2)",
  "Defence Knowledge – Wars, operations, missile systems",
  "Awards, Books, Sports – Recent updates",
  "International Orgs – UN, WHO, IMF, World Bank",
  "GK Sectional Test (120 Qs, 2 hrs)",
  "Analysis of GK Sectional Test + revision",
  "Lucent's rapid revision – Polity chapter",
  "Lucent's rapid revision – History chapter",
  "Lucent's rapid revision – Geography chapter",
  "Science rapid revision from NCERT notes",
  "Current Affairs final update",
  "Defence + awards + sports quick recap",
];

/* ============================================================
   Generate dynamic schedule based on config
   ============================================================ */
export function generateSchedule(config: PlanConfig): DayPlan[] {
  const start = new Date(config.startDate + 'T00:00:00');
  const exam = new Date(config.examDate + 'T00:00:00');
  const totalDays = dateDiffDays(start, exam);

  if (totalDays < 3) return [];

  // Calculate minutes per subject based on daily hours
  const totalMinutes = config.dailyHours * 60;
  // Distribution: English ~36%, Maths ~36%, GK ~28% (same as 75:75:60 ratio)
  const engMinutes = Math.round(totalMinutes * 0.357);
  const mathMinutes = Math.round(totalMinutes * 0.357);
  const gkMinutes = totalMinutes - engMinutes - mathMinutes;

  // Phase boundaries (roughly: 35% / 35% / 30%)
  const phase1End = Math.floor(totalDays * 0.35);
  const phase2End = Math.floor(totalDays * 0.70);

  const plans: DayPlan[] = [];

  // Count study days (non-Sunday, non-exam-day) for topic distribution
  const studyDayIndices: number[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const isLast = i === totalDays - 1;
    const isSun = d.getDay() === 0;
    if (!isSun && !isLast) {
      studyDayIndices.push(i);
    }
  }

  // Distribute topics across study days
  const totalStudyDays = studyDayIndices.length;

  function getTopicForDay(pool: string[], studyDayIndex: number): string {
    if (pool.length === 0) return "Revision + Practice";
    const idx = Math.floor((studyDayIndex / totalStudyDays) * pool.length);
    return pool[Math.min(idx, pool.length - 1)];
  }

  let studyDayCounter = 0;

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const { iso, label } = fmt(d);
    const dayNum = i + 1;
    const isSunday = d.getDay() === 0;
    const isExamDay = i === totalDays - 1;

    let phase: 1 | 2 | 3;
    if (dayNum <= phase1End) phase = 1;
    else if (dayNum <= phase2End) phase = 2;
    else phase = 3;

    let eng: string, math: string, gk: string;
    let notes: string | undefined;

    if (isExamDay) {
      eng = "EXAM DAY";
      math = "EXAM DAY";
      gk = "EXAM DAY";
      notes = "🎯 CDS 1 2026 – Give your absolute best! All your hard work pays off today.";
    } else if (isSunday) {
      const weekNum = Math.ceil(dayNum / 7);
      eng = `Full Mock Test ${weekNum} – English (120 Qs, 2 hrs)`;
      math = `Full Mock Test ${weekNum} – Maths (100 Qs, 2 hrs)`;
      gk = `Full Mock Test ${weekNum} – GK (120 Qs, 2 hrs)`;
      notes = `📝 Sunday Mock Test Day – Take full mock under exam conditions. Analyze mistakes after each section.`;
    } else {
      eng = getTopicForDay(englishPool, studyDayCounter);
      math = getTopicForDay(mathsPool, studyDayCounter);
      gk = getTopicForDay(gkPool, studyDayCounter);
      studyDayCounter++;
    }

    plans.push({
      day: dayNum,
      date: iso,
      dateLabel: label,
      phase,
      isSunday,
      english: eng,
      maths: math,
      gk: gk,
      notes,
      engMinutes: isSunday || isExamDay ? 120 : engMinutes,
      mathMinutes: isSunday || isExamDay ? 120 : mathMinutes,
      gkMinutes: isSunday || isExamDay ? 120 : gkMinutes,
    });
  }

  return plans;
}

/* ============================================================
   Topic Lists for Subject Pages
   ============================================================ */

export interface Topic {
  id: string;
  name: string;
  resource: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedHours: number;
}

export const englishTopics: Topic[] = [
  { id: 'eng-1', name: 'Parts of Speech', resource: 'Pathfinder Ch.1', priority: 'High', estimatedHours: 4 },
  { id: 'eng-2', name: 'Subject–Verb Agreement', resource: 'Pathfinder Ch.2', priority: 'High', estimatedHours: 2 },
  { id: 'eng-3', name: 'Tenses', resource: 'Pathfinder Ch.3', priority: 'High', estimatedHours: 3 },
  { id: 'eng-4', name: 'Articles', resource: 'Pathfinder Ch.4', priority: 'High', estimatedHours: 1.5 },
  { id: 'eng-5', name: 'Prepositions', resource: 'Pathfinder Ch.5', priority: 'High', estimatedHours: 1.5 },
  { id: 'eng-6', name: 'Active & Passive Voice', resource: 'Pathfinder Ch.6', priority: 'High', estimatedHours: 2 },
  { id: 'eng-7', name: 'Direct & Indirect Speech', resource: 'Pathfinder Ch.7', priority: 'High', estimatedHours: 2 },
  { id: 'eng-8', name: 'Error Spotting', resource: 'Pathfinder + PYQs', priority: 'High', estimatedHours: 4 },
  { id: 'eng-9', name: 'Sentence Improvement', resource: 'Pathfinder + PYQs', priority: 'High', estimatedHours: 3 },
  { id: 'eng-10', name: 'Cloze Test', resource: 'Pathfinder + PYQs', priority: 'High', estimatedHours: 3 },
  { id: 'eng-11', name: 'Vocabulary (Synonyms/Antonyms)', resource: 'Pathfinder Word Lists', priority: 'High', estimatedHours: 5 },
  { id: 'eng-12', name: 'Reading Comprehension', resource: 'Pathfinder + Practice', priority: 'High', estimatedHours: 4 },
  { id: 'eng-13', name: 'Idioms & Phrases', resource: 'Pathfinder', priority: 'Medium', estimatedHours: 2 },
  { id: 'eng-14', name: 'One Word Substitution', resource: 'Pathfinder', priority: 'Medium', estimatedHours: 2 },
  { id: 'eng-15', name: 'Spelling Correction', resource: 'Pathfinder', priority: 'Medium', estimatedHours: 1 },
];

export const mathsTopics: Topic[] = [
  { id: 'math-1', name: 'Percentage', resource: 'Pathfinder Arithmetic', priority: 'High', estimatedHours: 3 },
  { id: 'math-2', name: 'Profit & Loss', resource: 'Pathfinder Arithmetic', priority: 'High', estimatedHours: 3 },
  { id: 'math-3', name: 'Ratio & Proportion', resource: 'Pathfinder Arithmetic', priority: 'High', estimatedHours: 2 },
  { id: 'math-4', name: 'Average', resource: 'Pathfinder Arithmetic', priority: 'High', estimatedHours: 1.5 },
  { id: 'math-5', name: 'Simple Interest', resource: 'Pathfinder Arithmetic', priority: 'High', estimatedHours: 1.5 },
  { id: 'math-6', name: 'Time & Work', resource: 'Pathfinder Arithmetic', priority: 'High', estimatedHours: 3 },
  { id: 'math-7', name: 'Speed, Time & Distance', resource: 'Pathfinder Arithmetic', priority: 'High', estimatedHours: 3 },
  { id: 'math-8', name: 'Number System', resource: 'Pathfinder Ch.1', priority: 'High', estimatedHours: 3 },
  { id: 'math-9', name: 'Simplification (BODMAS)', resource: 'Pathfinder Ch.2', priority: 'High', estimatedHours: 2 },
  { id: 'math-10', name: 'Linear Equations', resource: 'Pathfinder Algebra', priority: 'High', estimatedHours: 2 },
  { id: 'math-11', name: 'Geometry – Triangles', resource: 'Pathfinder Geometry', priority: 'High', estimatedHours: 3 },
  { id: 'math-12', name: 'Geometry – Circles', resource: 'Pathfinder Geometry', priority: 'High', estimatedHours: 3 },
  { id: 'math-13', name: 'Trigonometry – Ratios & Identities', resource: 'Pathfinder Trigonometry', priority: 'High', estimatedHours: 3 },
  { id: 'math-14', name: 'Mensuration (2D & 3D)', resource: 'Pathfinder Mensuration', priority: 'Medium', estimatedHours: 3 },
  { id: 'math-15', name: 'Statistics (Mean, Median, Mode)', resource: 'Pathfinder Statistics', priority: 'Medium', estimatedHours: 2 },
  { id: 'math-16', name: 'Quadratic Equations', resource: 'Pathfinder Algebra', priority: 'Medium', estimatedHours: 2 },
];

export const gkTopics: Topic[] = [
  { id: 'gk-1', name: 'Polity – Constitution & Preamble', resource: "Lucent's GK", priority: 'High', estimatedHours: 2 },
  { id: 'gk-2', name: 'Polity – Fundamental Rights & DPSP', resource: "Lucent's GK", priority: 'High', estimatedHours: 2 },
  { id: 'gk-3', name: 'Polity – Parliament (LS & RS)', resource: "Lucent's GK", priority: 'High', estimatedHours: 2 },
  { id: 'gk-4', name: 'Polity – President, PM & CoM', resource: "Lucent's GK", priority: 'High', estimatedHours: 1.5 },
  { id: 'gk-5', name: 'Polity – Supreme Court & Judiciary', resource: "Lucent's GK", priority: 'High', estimatedHours: 1.5 },
  { id: 'gk-6', name: 'Modern History – Revolt of 1857', resource: "Lucent's GK", priority: 'High', estimatedHours: 1.5 },
  { id: 'gk-7', name: 'Modern History – Reform Movements', resource: "Lucent's GK", priority: 'High', estimatedHours: 2 },
  { id: 'gk-8', name: 'Modern History – Freedom Struggle', resource: "Lucent's GK", priority: 'High', estimatedHours: 3 },
  { id: 'gk-9', name: 'Modern History – Gandhi Era & Independence', resource: "Lucent's GK", priority: 'High', estimatedHours: 2 },
  { id: 'gk-10', name: 'Geography – India Physical', resource: "Lucent's GK", priority: 'High', estimatedHours: 2 },
  { id: 'gk-11', name: 'Geography – Climate & Monsoons', resource: "Lucent's GK", priority: 'High', estimatedHours: 1.5 },
  { id: 'gk-12', name: 'Geography – World Physical', resource: "Lucent's GK", priority: 'Medium', estimatedHours: 2 },
  { id: 'gk-13', name: 'Science – Physics (NCERT 8–10)', resource: 'NCERT Books', priority: 'High', estimatedHours: 3 },
  { id: 'gk-14', name: 'Science – Chemistry (NCERT 8–10)', resource: 'NCERT Books', priority: 'High', estimatedHours: 2 },
  { id: 'gk-15', name: 'Science – Biology (NCERT 8–10)', resource: 'NCERT Books', priority: 'High', estimatedHours: 2 },
  { id: 'gk-16', name: 'Defence Knowledge & Armed Forces', resource: "Lucent's + Online", priority: 'High', estimatedHours: 2 },
  { id: 'gk-17', name: 'Current Affairs (Last 10–12 months)', resource: 'Monthly Digests', priority: 'High', estimatedHours: 5 },
  { id: 'gk-18', name: 'Economy Basics', resource: "Lucent's GK", priority: 'Medium', estimatedHours: 2 },
  { id: 'gk-19', name: 'Awards, Books, Sports', resource: 'Current Affairs', priority: 'Medium', estimatedHours: 1.5 },
];

/* ============================================================
   Mock Test Data Structure
   ============================================================ */
export interface MockTest {
  id: string;
  week: number;
  label: string;
  date: string;
  english: { total: number; attempted: number; correct: number; wrong: number; score: number } | null;
  maths: { total: number; attempted: number; correct: number; wrong: number; score: number } | null;
  gk: { total: number; attempted: number; correct: number; wrong: number; score: number } | null;
}

export function getInitialMocks(schedule: DayPlan[]): MockTest[] {
  const sundays = schedule.filter(d => d.isSunday);
  return sundays.map((s, i) => ({
    id: `mock-${i+1}`,
    week: i + 1,
    label: `Mock Test ${i + 1}`,
    date: s.dateLabel,
    english: null,
    maths: null,
    gk: null,
  }));
}

/* ============================================================
   Default Config
   ============================================================ */
export const DEFAULT_CONFIG: PlanConfig = {
  startDate: '2026-02-14',
  examDate: '2026-04-12',
  dailyHours: 4,
};
