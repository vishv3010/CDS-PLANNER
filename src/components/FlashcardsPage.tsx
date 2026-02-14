/* ============================================================
   Flashcards Page – Create & review flashcards for revision.
   Flip-card animation, subject filters, shuffle, progress.
   Users can add/edit/delete their own cards + preloaded ones.
   ============================================================ */
import { useState, useMemo } from 'react';
import {
  Layers, Plus, Trash2, Edit3, Save, X, Search,
  BookOpen, Calculator, Globe, Shuffle, ChevronLeft,
  ChevronRight, RotateCcw, Eye, EyeOff, Star
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Flashcard {
  id: string;
  subject: 'english' | 'maths' | 'gk';
  front: string;
  back: string;
  starred: boolean;
  isCustom: boolean;
}

const defaultCards: Flashcard[] = [
  // English
  { id: 'fc-e1', subject: 'english', front: 'What is Subject-Verb Agreement?', back: 'The verb must agree with the subject in number and person.\n\nSingular subject → singular verb\nPlural subject → plural verb\n\nExample: He goes (✓), He go (✗)', starred: false, isCustom: false },
  { id: 'fc-e2', subject: 'english', front: 'Active to Passive Voice (Simple Present)', back: 'Active: S + V1 + O\nPassive: O + is/am/are + V3 + by S\n\nExample:\nActive: She writes a letter.\nPassive: A letter is written by her.', starred: false, isCustom: false },
  { id: 'fc-e3', subject: 'english', front: 'When to use "An" vs "A"?', back: '"An" before vowel SOUNDS (not vowel letters)\n"A" before consonant SOUNDS\n\n✓ An hour (silent h)\n✓ A university (yoo sound)\n✓ An MBA (em sound)\n✓ A one-rupee coin (w sound)', starred: false, isCustom: false },
  { id: 'fc-e4', subject: 'english', front: 'Direct to Indirect Speech: Tense Changes', back: 'Simple Present → Simple Past\nPresent Continuous → Past Continuous\nPresent Perfect → Past Perfect\nSimple Past → Past Perfect\nWill → Would\nCan → Could\nMay → Might', starred: false, isCustom: false },
  { id: 'fc-e5', subject: 'english', front: '"Discuss" – Does it take a preposition?', back: 'NO! "Discuss" is a transitive verb.\n\n✗ "Discuss about the topic"\n✓ "Discuss the topic"\n\nSimilar: Enter (not enter into), Comprise (not comprise of), Stress (not stress upon)', starred: false, isCustom: false },
  // Maths
  { id: 'fc-m1', subject: 'maths', front: 'Formula for Successive Percentage Change', back: 'If two successive changes are a% and b%:\n\nNet change = a + b + (ab/100) %\n\nExample: 20% increase then 10% decrease:\n= 20 + (-10) + (20×-10)/100\n= 20 - 10 - 2 = 8% increase', starred: false, isCustom: false },
  { id: 'fc-m2', subject: 'maths', front: 'Trigonometric Values Table (0° to 90°)', back: '       0°    30°    45°    60°    90°\nsin:   0     1/2    1/√2   √3/2   1\ncos:   1     √3/2   1/√2   1/2    0\ntan:   0     1/√3   1      √3     ∞\n\nTrick: sin values = √0/2, √1/2, √2/2, √3/2, √4/2', starred: false, isCustom: false },
  { id: 'fc-m3', subject: 'maths', front: 'Time & Work: If A does work in x days, B in y days, how long together?', back: 'Combined time = xy / (x + y) days\n\nA\'s 1 day work = 1/x\nB\'s 1 day work = 1/y\nTogether: 1/x + 1/y = (x+y)/xy\n\nExample: A=10 days, B=15 days\nTogether = (10×15)/(10+15) = 150/25 = 6 days', starred: false, isCustom: false },
  { id: 'fc-m4', subject: 'maths', front: 'Profit & Loss: SP when profit% is given', back: 'SP = CP × (100 + Profit%) / 100\nSP = CP × (100 - Loss%) / 100\n\nDiscount% = (Discount/MP) × 100\nSP = MP × (100 - Discount%) / 100\n\nIf CP = 200, Profit = 25%:\nSP = 200 × 125/100 = 250', starred: false, isCustom: false },
  { id: 'fc-m5', subject: 'maths', front: 'Average Speed for equal distances', back: 'If equal distances traveled at speeds S₁ and S₂:\n\nAverage Speed = 2 × S₁ × S₂ / (S₁ + S₂)\n\n⚠️ NOT (S₁+S₂)/2!\n\nExample: 40 km/h and 60 km/h\n= 2×40×60 / (40+60) = 4800/100 = 48 km/h', starred: false, isCustom: false },
  { id: 'fc-m6', subject: 'maths', front: 'Pythagoras Triplets (most common)', back: '(3, 4, 5) and multiples: 6,8,10; 9,12,15\n(5, 12, 13)\n(8, 15, 17)\n(7, 24, 25)\n(20, 21, 29)\n(9, 40, 41)\n(11, 60, 61)\n\nThese save calculation time in exams!', starred: false, isCustom: false },
  // GK
  { id: 'fc-g1', subject: 'gk', front: 'Fundamental Rights (Part III): Which articles?', back: 'Art 14-18: Right to Equality\nArt 19-22: Right to Freedom\nArt 23-24: Right against Exploitation\nArt 25-28: Right to Freedom of Religion\nArt 29-30: Cultural & Educational Rights\nArt 32: Right to Constitutional Remedies\n\n⚠️ Right to Property is NOT a FR (removed by 44th Amendment)', starred: false, isCustom: false },
  { id: 'fc-g2', subject: 'gk', front: 'Key events of Indian Freedom Struggle (chronological)', back: '1857 - First War of Independence\n1885 - INC founded (A.O. Hume)\n1905 - Bengal Partition (Curzon)\n1906 - Muslim League founded\n1919 - Jallianwala Bagh / Rowlatt Act\n1920 - Non-Cooperation Movement\n1930 - Dandi March / CDM\n1942 - Quit India Movement\n1947 - Independence (Aug 15)', starred: false, isCustom: false },
  { id: 'fc-g3', subject: 'gk', front: 'Indian Armed Forces: Key Facts', back: 'Army Day: January 15\nNavy Day: December 4\nAir Force Day: October 8\n\nIMA: Dehradun\nNDA: Khadakwasla, Pune\nOTA: Chennai\nAFA: Dundigal, Hyderabad\nINA: Ezhimala, Kerala\n\nArmy Motto: "Service Before Self"\nNavy: "Sha No Varunah"\nAir Force: "Nabha Sparsham Deeptam"', starred: false, isCustom: false },
  { id: 'fc-g4', subject: 'gk', front: 'Parliament of India: Key Facts', back: 'Lok Sabha: Max 552 members\n  - 530 states + 20 UTs + 2 Anglo-Indian\n  - Term: 5 years\n  - Speaker presides\n  - Money Bill only here\n\nRajya Sabha: Max 250 members\n  - 238 elected + 12 nominated\n  - Term: 6 years (⅓ retire every 2 yrs)\n  - VP is Chairman\n  - Cannot be dissolved\n\nJoint Session: Art 108 (by President)', starred: false, isCustom: false },
  { id: 'fc-g5', subject: 'gk', front: 'Important Constitutional Amendments', back: '1st (1951): Added 9th Schedule\n42nd (1976): "Mini Constitution" - added Socialist, Secular, Integrity to Preamble\n44th (1978): Right to Property removed as FR\n52nd (1985): Anti-defection law\n61st (1989): Voting age 21→18\n73rd (1992): Panchayati Raj\n74th (1992): Municipalities\n86th (2002): Right to Education (Art 21A)\n101st (2016): GST\n103rd (2019): EWS reservation (10%)', starred: false, isCustom: false },
];

const subjectColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  english: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', gradient: 'from-blue-500 to-blue-700' },
  maths: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', gradient: 'from-emerald-500 to-emerald-700' },
  gk: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', gradient: 'from-amber-500 to-amber-700' },
};

const subjectIcons: Record<string, React.ReactNode> = {
  english: <BookOpen size={14} />,
  maths: <Calculator size={14} />,
  gk: <Globe size={14} />,
};

export default function FlashcardsPage() {
  const [cards, setCards] = useLocalStorage<Flashcard[]>('cds-flashcards', defaultCards);
  const [filter, setFilter] = useState<string>('all');
  const [starredOnly, setStarredOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'browse' | 'review'>('browse');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [formSubject, setFormSubject] = useState<Flashcard['subject']>('maths');
  const [formFront, setFormFront] = useState('');
  const [formBack, setFormBack] = useState('');

  // Filtered cards
  const filteredCards = useMemo(() => {
    return cards
      .filter(c => filter === 'all' || c.subject === filter)
      .filter(c => !starredOnly || c.starred)
      .filter(c =>
        search === '' ||
        c.front.toLowerCase().includes(search.toLowerCase()) ||
        c.back.toLowerCase().includes(search.toLowerCase())
      );
  }, [cards, filter, starredOnly, search]);

  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setCards(prev => {
      const otherCards = prev.filter(c => !filteredCards.find(f => f.id === c.id));
      return [...shuffled, ...otherCards];
    });
    setCurrentIdx(0);
    setFlipped(false);
  };

  const addCard = () => {
    if (!formFront.trim() || !formBack.trim()) return;
    const card: Flashcard = {
      id: `fc-custom-${Date.now()}`,
      subject: formSubject,
      front: formFront.trim(),
      back: formBack.trim(),
      starred: false,
      isCustom: true,
    };
    setCards(prev => [...prev, card]);
    setFormFront('');
    setFormBack('');
    setIsAdding(false);
  };

  const startEdit = (c: Flashcard) => {
    setEditingId(c.id);
    setFormSubject(c.subject);
    setFormFront(c.front);
    setFormBack(c.back);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setCards(prev => prev.map(c =>
      c.id === editingId ? { ...c, subject: formSubject, front: formFront.trim(), back: formBack.trim() } : c
    ));
    setEditingId(null);
    setFormFront('');
    setFormBack('');
  };

  const deleteCard = (id: string) => {
    if (confirm('Delete this flashcard?')) {
      setCards(prev => prev.filter(c => c.id !== id));
    }
  };

  const toggleStar = (id: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, starred: !c.starred } : c));
  };

  const nextCard = () => {
    if (currentIdx < filteredCards.length - 1) {
      setCurrentIdx(i => i + 1);
      setFlipped(false);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
      setFlipped(false);
      setShowAnswer(false);
    }
  };

  const startReview = () => {
    setMode('review');
    setCurrentIdx(0);
    setFlipped(false);
    setShowAnswer(false);
  };

  const currentCard = filteredCards[currentIdx];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Layers className="text-purple-600" size={28} />
            Flashcards
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {cards.length} cards • Quick revision with flip cards
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-semibold rounded-xl shadow-md hover:bg-purple-700 transition-all cursor-pointer">
            <Plus size={16} /> Add Card
          </button>
          {filteredCards.length > 0 && (
            <button onClick={mode === 'review' ? () => setMode('browse') : startReview}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
              {mode === 'review' ? <><Eye size={16} /> Browse</> : <><EyeOff size={16} /> Review</>}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search flashcards..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'english', 'maths', 'gk'].map(s => (
            <button key={s} onClick={() => { setFilter(s); setCurrentIdx(0); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all capitalize
                ${filter === s ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
              {s === 'all' ? `All (${cards.length})` : s}
            </button>
          ))}
          <button onClick={() => { setStarredOnly(!starredOnly); setCurrentIdx(0); }}
            className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1
              ${starredOnly ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
            <Star size={12} /> Starred
          </button>
          <button onClick={shuffleCards}
            className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 flex items-center gap-1">
            <Shuffle size={12} /> Shuffle
          </button>
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-16">
          <Layers size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No flashcards found</h3>
          <p className="text-sm text-slate-400">Create your own or adjust the filters</p>
        </div>
      ) : mode === 'review' ? (
        /* === REVIEW MODE === */
        <div className="max-w-xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4 text-sm text-slate-500 dark:text-slate-400">
            <span>Card {currentIdx + 1} of {filteredCards.length}</span>
            <button onClick={() => { setCurrentIdx(0); setFlipped(false); setShowAnswer(false); }}
              className="flex items-center gap-1 text-xs hover:text-primary-600 cursor-pointer">
              <RotateCcw size={12} /> Restart
            </button>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / filteredCards.length) * 100}%` }} />
          </div>

          {/* Card */}
          {currentCard && (
            <div onClick={() => { setFlipped(!flipped); setShowAnswer(!showAnswer); }}
              className="cursor-pointer select-none">
              <div className={`min-h-[280px] p-8 rounded-3xl border-2 ${subjectColors[currentCard.subject].border} bg-white dark:bg-slate-800 shadow-xl flex flex-col items-center justify-center text-center transition-all hover:shadow-2xl relative`}>
                {/* Subject badge */}
                <div className={`absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full ${subjectColors[currentCard.subject].bg} ${subjectColors[currentCard.subject].text} flex items-center gap-1`}>
                  {subjectIcons[currentCard.subject]} {currentCard.subject}
                </div>
                {/* Star */}
                <button onClick={e => { e.stopPropagation(); toggleStar(currentCard.id); }}
                  className="absolute top-4 right-4 p-1 cursor-pointer">
                  <Star size={18} className={currentCard.starred ? 'text-amber-500 fill-amber-500' : 'text-slate-300'} />
                </button>
                {/* Flip indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 flex items-center gap-1">
                  <RotateCcw size={10} /> Tap to flip
                </div>

                {!showAnswer ? (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Question</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">{currentCard.front}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-emerald-500 uppercase mb-3">Answer</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">{currentCard.back}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button onClick={prevCard} disabled={currentIdx === 0}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium text-sm disabled:opacity-30 cursor-pointer hover:bg-slate-50">
              <ChevronLeft size={16} /> Previous
            </button>
            <button onClick={nextCard} disabled={currentIdx === filteredCards.length - 1}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-sm disabled:opacity-30 cursor-pointer hover:bg-purple-700">
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* === BROWSE MODE === */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map(card => {
            const sc = subjectColors[card.subject];
            return (
              <div key={card.id} className={`rounded-2xl border ${sc.border} bg-white dark:bg-slate-800 overflow-hidden group hover:shadow-lg transition-all`}>
                <div className={`px-4 py-2 bg-gradient-to-r ${sc.gradient} flex items-center justify-between`}>
                  <span className="text-xs font-semibold text-white/90 flex items-center gap-1 capitalize">
                    {subjectIcons[card.subject]} {card.subject}
                    {card.isCustom && <span className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px]">Custom</span>}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleStar(card.id)} className="p-0.5 cursor-pointer">
                      <Star size={14} className={card.starred ? 'text-amber-300 fill-amber-300' : 'text-white/40'} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2 line-clamp-2">{card.front}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap line-clamp-4">{card.back}</p>
                  <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(card)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer" title="Edit">
                      <Edit3 size={12} className="text-slate-500" />
                    </button>
                    <button onClick={() => deleteCard(card.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer" title="Delete">
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAdding || editingId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => { setIsAdding(false); setEditingId(null); }}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
                {editingId ? 'Edit Flashcard' : 'New Flashcard'}
              </h3>
              <button onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              {(['english', 'maths', 'gk'] as const).map(s => (
                <button key={s} onClick={() => setFormSubject(s)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all flex items-center justify-center gap-1.5 capitalize border-2
                    ${formSubject === s
                      ? `${subjectColors[s].bg} ${subjectColors[s].text} ${subjectColors[s].border}`
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-transparent'}`}>
                  {subjectIcons[s]} {s}
                </button>
              ))}
            </div>

            <div className="mb-3">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Question (Front)</label>
              <textarea value={formFront} onChange={e => setFormFront(e.target.value)}
                placeholder="What is the formula for...?"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
            </div>

            <div className="mb-5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Answer (Back)</label>
              <textarea value={formBack} onChange={e => setFormBack(e.target.value)}
                placeholder="The answer, formula, explanation..."
                rows={5}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
            </div>

            <button onClick={editingId ? saveEdit : addCard}
              disabled={!formFront.trim() || !formBack.trim()}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              <Save size={18} /> {editingId ? 'Save Changes' : 'Create Card'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
