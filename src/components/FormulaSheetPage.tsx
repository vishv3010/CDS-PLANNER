/* ============================================================
   Formula Sheet – Quick reference for Maths formulas,
   English grammar rules, GK important facts.
   Searchable, categorized, collapsible sections.
   ============================================================ */
import { useState } from 'react';
import { BookMarked, Search, ChevronDown, ChevronRight, Calculator, BookOpen, Globe, Lightbulb } from 'lucide-react';

interface FormulaSection {
  title: string;
  items: { label: string; formula: string }[];
}

const mathFormulas: FormulaSection[] = [
  {
    title: 'Percentage',
    items: [
      { label: 'Percentage', formula: '% = (Value / Total) × 100' },
      { label: 'Increase %', formula: '((New - Old) / Old) × 100' },
      { label: 'Decrease %', formula: '((Old - New) / Old) × 100' },
      { label: 'Successive %', formula: 'Net = a + b + (ab/100)' },
    ],
  },
  {
    title: 'Profit & Loss',
    items: [
      { label: 'Profit', formula: 'SP - CP' },
      { label: 'Loss', formula: 'CP - SP' },
      { label: 'Profit %', formula: '(Profit / CP) × 100' },
      { label: 'SP from Profit%', formula: 'SP = CP × (100 + P%) / 100' },
      { label: 'Discount', formula: 'Discount = MP - SP' },
      { label: 'Discount %', formula: '(Discount / MP) × 100' },
    ],
  },
  {
    title: 'Simple Interest',
    items: [
      { label: 'SI', formula: 'SI = (P × R × T) / 100' },
      { label: 'Amount', formula: 'A = P + SI = P(1 + RT/100)' },
      { label: 'Principal', formula: 'P = (100 × SI) / (R × T)' },
    ],
  },
  {
    title: 'Ratio & Proportion',
    items: [
      { label: 'Ratio', formula: 'a : b = a/b' },
      { label: 'Proportion', formula: 'a/b = c/d → ad = bc' },
      { label: 'Componendo', formula: '(a+b)/b = (c+d)/d' },
      { label: 'Dividendo', formula: '(a-b)/b = (c-d)/d' },
    ],
  },
  {
    title: 'Time & Work',
    items: [
      { label: 'Work', formula: 'Work = Rate × Time' },
      { label: 'If A does in x days', formula: "A's 1 day work = 1/x" },
      { label: 'A+B together', formula: '1/x + 1/y = (x+y)/xy days' },
      { label: 'Pipe: Fill & Empty', formula: 'Net = 1/fill - 1/empty' },
    ],
  },
  {
    title: 'Speed, Time & Distance',
    items: [
      { label: 'Speed', formula: 'Speed = Distance / Time' },
      { label: 'Average Speed', formula: '2S₁S₂ / (S₁ + S₂) [equal distance]' },
      { label: 'Relative Speed (same dir)', formula: 'S₁ - S₂' },
      { label: 'Relative Speed (opp dir)', formula: 'S₁ + S₂' },
      { label: 'km/h to m/s', formula: '× 5/18' },
      { label: 'Train crossing pole', formula: 'Time = Length / Speed' },
    ],
  },
  {
    title: 'Geometry',
    items: [
      { label: 'Triangle Area', formula: '½ × base × height' },
      { label: "Heron's Formula", formula: '√[s(s-a)(s-b)(s-c)], s=(a+b+c)/2' },
      { label: 'Circle Area', formula: 'πr²' },
      { label: 'Circle Circumference', formula: '2πr' },
      { label: 'Pythagoras', formula: 'a² + b² = c²' },
      { label: 'Angle Sum (Triangle)', formula: '180°' },
      { label: 'Angle Sum (Polygon)', formula: '(n-2) × 180°' },
    ],
  },
  {
    title: 'Mensuration',
    items: [
      { label: 'Cube Volume', formula: 'a³' },
      { label: 'Cube Surface Area', formula: '6a²' },
      { label: 'Cuboid Volume', formula: 'l × b × h' },
      { label: 'Cylinder Volume', formula: 'πr²h' },
      { label: 'Cone Volume', formula: '⅓πr²h' },
      { label: 'Sphere Volume', formula: '⁴⁄₃πr³' },
      { label: 'Sphere Surface Area', formula: '4πr²' },
    ],
  },
  {
    title: 'Trigonometry',
    items: [
      { label: 'sin 0°, 30°, 45°, 60°, 90°', formula: '0, ½, 1/√2, √3/2, 1' },
      { label: 'cos 0°, 30°, 45°, 60°, 90°', formula: '1, √3/2, 1/√2, ½, 0' },
      { label: 'tan 0°, 30°, 45°, 60°, 90°', formula: '0, 1/√3, 1, √3, ∞' },
      { label: 'sin²θ + cos²θ', formula: '= 1' },
      { label: '1 + tan²θ', formula: '= sec²θ' },
      { label: '1 + cot²θ', formula: '= cosec²θ' },
    ],
  },
  {
    title: 'Number System',
    items: [
      { label: 'Divisibility by 3', formula: 'Sum of digits divisible by 3' },
      { label: 'Divisibility by 4', formula: 'Last 2 digits divisible by 4' },
      { label: 'Divisibility by 8', formula: 'Last 3 digits divisible by 8' },
      { label: 'Divisibility by 9', formula: 'Sum of digits divisible by 9' },
      { label: 'Divisibility by 11', formula: 'Diff of odd & even place sums = 0 or ×11' },
      { label: 'HCF × LCM', formula: '= Product of two numbers' },
    ],
  },
];

const englishRules: FormulaSection[] = [
  {
    title: 'Tenses Quick Rules',
    items: [
      { label: 'Simple Present', formula: 'V1 / V1+s (he/she) → "He plays cricket"' },
      { label: 'Present Continuous', formula: 'is/am/are + V-ing → "He is playing"' },
      { label: 'Present Perfect', formula: 'has/have + V3 → "He has played"' },
      { label: 'Simple Past', formula: 'V2 → "He played"' },
      { label: 'Past Continuous', formula: 'was/were + V-ing → "He was playing"' },
      { label: 'Simple Future', formula: 'will + V1 → "He will play"' },
    ],
  },
  {
    title: 'Subject-Verb Agreement',
    items: [
      { label: 'Rule 1', formula: 'Singular subject → singular verb (He goes)' },
      { label: 'Rule 2', formula: 'Two subjects joined by "and" → plural verb' },
      { label: 'Rule 3', formula: '"Either...or / Neither...nor" → verb agrees with nearest subject' },
      { label: 'Rule 4', formula: 'Collective nouns → singular verb (The team is ready)' },
      { label: 'Rule 5', formula: '"Each/Every/No" + noun → singular verb' },
      { label: 'Rule 6', formula: 'Uncountable nouns → singular verb (Water is...)' },
    ],
  },
  {
    title: 'Articles (A/An/The)',
    items: [
      { label: 'A', formula: 'Before consonant sounds: a book, a university' },
      { label: 'An', formula: 'Before vowel sounds: an apple, an hour, an MBA' },
      { label: 'The', formula: 'Specific/known things, superlatives, unique things' },
      { label: 'No article', formula: 'Before abstract nouns (general), meals, games' },
    ],
  },
  {
    title: 'Active ↔ Passive Voice',
    items: [
      { label: 'Simple Present', formula: 'Active: S + V1 + O → Passive: O + is/am/are + V3 + by S' },
      { label: 'Simple Past', formula: 'Active: S + V2 + O → Passive: O + was/were + V3 + by S' },
      { label: 'Future', formula: 'Active: S + will + V1 + O → Passive: O + will be + V3 + by S' },
      { label: 'Present Perfect', formula: 'Active: S + has/have + V3 + O → Passive: O + has/have been + V3 + by S' },
    ],
  },
  {
    title: 'Direct ↔ Indirect Speech',
    items: [
      { label: 'Present → Past', formula: '"I play" → He said he played' },
      { label: 'Past → Past Perfect', formula: '"I played" → He said he had played' },
      { label: 'Will → Would', formula: '"I will play" → He said he would play' },
      { label: 'This → That', formula: 'Today→That day, Here→There, Now→Then' },
    ],
  },
  {
    title: 'Common Error Patterns',
    items: [
      { label: 'Wrong: "One of my friend"', formula: 'Correct: "One of my friends" (plural noun after "one of")' },
      { label: 'Wrong: "He is more taller"', formula: 'Correct: "He is taller" (no more with -er)' },
      { label: 'Wrong: "I am knowing"', formula: 'Correct: "I know" (stative verbs no continuous)' },
      { label: 'Wrong: "Discuss about"', formula: 'Correct: "Discuss" (no preposition needed)' },
      { label: 'Wrong: "Comprise of"', formula: 'Correct: "Comprise" (no "of" needed)' },
    ],
  },
];

const gkFacts: FormulaSection[] = [
  {
    title: 'Constitution – Key Articles',
    items: [
      { label: 'Article 14', formula: 'Equality before law' },
      { label: 'Article 19', formula: '6 Freedoms (speech, assembly, movement...)' },
      { label: 'Article 21', formula: 'Right to Life & Personal Liberty' },
      { label: 'Article 32', formula: 'Right to Constitutional Remedies (Ambedkar: "Heart & Soul")' },
      { label: 'Article 44', formula: 'Uniform Civil Code (DPSP)' },
      { label: 'Article 356', formula: "President's Rule" },
      { label: 'Article 370', formula: 'Special status of J&K (abrogated 2019)' },
    ],
  },
  {
    title: 'Parliament',
    items: [
      { label: 'Lok Sabha', formula: 'Max 552 members, 5 year term, Money Bills' },
      { label: 'Rajya Sabha', formula: 'Max 250 members, 6 year term (⅓ retire every 2 yrs)' },
      { label: 'Joint Session', formula: 'Called by President under Art. 108' },
      { label: 'No-Confidence Motion', formula: 'Only in Lok Sabha' },
      { label: 'Quorum', formula: '1/10th of total members' },
    ],
  },
  {
    title: 'Modern History – Key Dates',
    items: [
      { label: '1857', formula: 'First War of Independence (Sepoy Mutiny)' },
      { label: '1885', formula: 'Indian National Congress founded (Hume)' },
      { label: '1905', formula: 'Bengal Partition (Lord Curzon)' },
      { label: '1919', formula: 'Jallianwala Bagh massacre / Rowlatt Act' },
      { label: '1920', formula: 'Non-Cooperation Movement (Gandhi)' },
      { label: '1930', formula: 'Civil Disobedience / Dandi March' },
      { label: '1942', formula: 'Quit India Movement' },
      { label: '1947', formula: 'Independence (Aug 15)' },
    ],
  },
  {
    title: 'Geography – India Facts',
    items: [
      { label: 'Longest River', formula: 'Ganga (2,525 km)' },
      { label: 'Highest Peak', formula: 'K2 / Kangchenjunga (in India)' },
      { label: 'Largest State (area)', formula: 'Rajasthan' },
      { label: 'Largest State (population)', formula: 'Uttar Pradesh' },
      { label: 'Total States/UTs', formula: '28 States + 8 UTs' },
      { label: 'Tropic of Cancer passes', formula: '8 states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, WB, Tripura, Mizoram' },
    ],
  },
  {
    title: 'Science Quick Facts',
    items: [
      { label: 'Speed of Light', formula: '3 × 10⁸ m/s' },
      { label: 'Speed of Sound (air)', formula: '343 m/s' },
      { label: 'Newton\'s 2nd Law', formula: 'F = ma' },
      { label: 'Ohm\'s Law', formula: 'V = IR' },
      { label: 'pH Scale', formula: '0-14 (7=neutral, <7=acidic, >7=basic)' },
      { label: 'Photosynthesis', formula: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' },
      { label: 'Blood Groups', formula: 'A, B, AB (universal recipient), O (universal donor)' },
    ],
  },
  {
    title: 'Defence Knowledge',
    items: [
      { label: 'Army Chief', formula: 'COAS (Chief of Army Staff)' },
      { label: 'Army HQ', formula: 'New Delhi' },
      { label: 'IMA Location', formula: 'Dehradun, Uttarakhand' },
      { label: 'NDA Location', formula: 'Khadakwasla, Pune' },
      { label: 'Army Day', formula: 'January 15' },
      { label: 'Navy Day', formula: 'December 4' },
      { label: 'Air Force Day', formula: 'October 8' },
      { label: 'Motto (Army)', formula: 'Service Before Self' },
    ],
  },
];

export default function FormulaSheetPage() {
  const [activeTab, setActiveTab] = useState<'maths' | 'english' | 'gk'>('maths');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const data = activeTab === 'maths' ? mathFormulas : activeTab === 'english' ? englishRules : gkFacts;

  const toggleSection = (title: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(data.map(s => s.title)));
  const collapseAll = () => setExpanded(new Set());

  // Filter by search
  const filteredData = search
    ? data.map(section => ({
        ...section,
        items: section.items.filter(
          item =>
            item.label.toLowerCase().includes(search.toLowerCase()) ||
            item.formula.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(s => s.items.length > 0)
    : data;

  // Auto-expand when searching
  const effectiveExpanded = search ? new Set(filteredData.map(s => s.title)) : expanded;

  const tabColors = {
    maths: { active: 'bg-emerald-600', icon: <Calculator size={18} /> },
    english: { active: 'bg-blue-600', icon: <BookOpen size={18} /> },
    gk: { active: 'bg-amber-600', icon: <Globe size={18} /> },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <BookMarked className="text-primary-600" size={28} />
          Formula Sheet & Quick Reference
        </h1>
        <p className="text-slate-500 mt-2">
          All important formulas, rules & facts at your fingertips. Perfect for last-minute revision!
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 mb-6 p-1.5 bg-slate-100 rounded-xl w-fit">
        {(['maths', 'english', 'gk'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSearch(''); setExpanded(new Set()); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer
              ${activeTab === tab
                ? `${tabColors[tab].active} text-white shadow-md`
                : 'text-slate-600 hover:bg-slate-200'}`}
          >
            {tabColors[tab].icon}
            {tab === 'maths' ? 'Mathematics' : tab === 'english' ? 'English' : 'GK Facts'}
          </button>
        ))}
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'maths' ? 'formulas' : activeTab === 'english' ? 'grammar rules' : 'facts'}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={expandAll} className="px-3 py-2 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
            Expand All
          </button>
          <button onClick={collapseAll} className="px-3 py-2 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
            Collapse All
          </button>
        </div>
      </div>

      {/* Tip */}
      <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
        <Lightbulb size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">
          <strong>Pro Tip:</strong> Bookmark this page! Use it for quick revision before mock tests and on exam day morning.
        </p>
      </div>

      {/* Formula Sections */}
      <div className="space-y-3">
        {filteredData.map(section => {
          const isExpanded = effectiveExpanded.has(section.title);
          return (
            <div key={section.title} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {isExpanded
                    ? <ChevronDown size={18} className="text-primary-600" />
                    : <ChevronRight size={18} className="text-slate-400" />
                  }
                  <h3 className="font-bold text-slate-900">{section.title}</h3>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {section.items.length} items
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100">
                  <div className="divide-y divide-slate-50">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50">
                        <span className="text-xs font-bold text-slate-400 w-5 shrink-0 mt-0.5">{i + 1}.</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-slate-700">{item.label}</span>
                          <div className="mt-0.5 text-sm font-mono text-primary-700 bg-primary-50 px-2 py-1 rounded-lg inline-block">
                            {item.formula}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Search size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">No results found for "{search}"</p>
        </div>
      )}
    </div>
  );
}
