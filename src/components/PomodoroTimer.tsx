/* ============================================================
   Pomodoro Timer – Floating study timer with focus/break modes
   Features: configurable focus time, break time, session count,
   audio alert, auto-start breaks, minimizable
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Timer, Play, Pause, RotateCcw, Coffee, Brain,
  ChevronUp, Volume2, VolumeX, Settings, X, Minus
} from 'lucide-react';

export default function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isRunning, setIsRunning] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25); // minutes
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [sessions, setSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(() => {
    return parseInt(localStorage.getItem('cds-total-focus-time') || '0');
  });
  const [soundOn, setSoundOn] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist total focus time
  useEffect(() => {
    localStorage.setItem('cds-total-focus-time', totalFocusTime.toString());
  }, [totalFocusTime]);

  // Timer tick
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer finished
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            if (mode === 'focus') {
              setSessions(s => s + 1);
              setTotalFocusTime(t => t + focusDuration);
              playAlert();
              // Auto switch to break
              setMode('break');
              return breakDuration * 60;
            } else {
              playAlert();
              // Auto switch to focus
              setMode('focus');
              return focusDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, focusDuration, breakDuration, timeLeft]); // eslint-disable-line

  const playAlert = useCallback(() => {
    if (!soundOn) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1000;
        gain2.gain.value = 0.3;
        osc2.start();
        osc2.stop(ctx.currentTime + 0.3);
      }, 350);
    } catch {
      // Audio not supported
    }
  }, [soundOn]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const applySettings = (focus: number, brk: number) => {
    setFocusDuration(focus);
    setBreakDuration(brk);
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focus * 60 : brk * 60);
    setShowSettings(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = mode === 'focus'
    ? ((focusDuration * 60 - timeLeft) / (focusDuration * 60)) * 100
    : ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100;

  const totalHours = Math.floor(totalFocusTime / 60);
  const totalMins = totalFocusTime % 60;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl shadow-primary-300 flex items-center justify-center hover:scale-110 transition-all cursor-pointer group"
        title="Open Pomodoro Timer"
      >
        <Timer size={24} />
        {isRunning && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
        )}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Study Timer
        </span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : mode === 'focus' ? 'bg-primary-500' : 'bg-amber-500'}`} />
        <span className="font-mono font-bold text-lg text-slate-900 dark:text-white">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <button onClick={toggleTimer} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
          {isRunning ? <Pause size={16} className="text-slate-600 dark:text-slate-300" /> : <Play size={16} className="text-slate-600 dark:text-slate-300" />}
        </button>
        <button onClick={() => setIsMinimized(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
          <ChevronUp size={16} className="text-slate-600 dark:text-slate-300" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className={`p-4 ${mode === 'focus' ? 'bg-gradient-to-r from-primary-600 to-primary-800' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            {mode === 'focus' ? <Brain size={18} /> : <Coffee size={18} />}
            <span className="font-semibold text-sm">
              {mode === 'focus' ? 'Focus Mode' : 'Break Time'}
            </span>
            {sessions > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium">
                Session {sessions}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsMinimized(true)} className="p-1 rounded hover:bg-white/20 cursor-pointer text-white">
              <Minus size={14} />
            </button>
            <button onClick={() => { setIsOpen(false); setIsRunning(false); }} className="p-1 rounded hover:bg-white/20 cursor-pointer text-white">
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="p-6 text-center">
        {/* Circular progress */}
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" className="dark:stroke-slate-700" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={mode === 'focus' ? '#2563eb' : '#f59e0b'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-4xl font-bold text-slate-900 dark:text-white">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'focus' ? `${focusDuration} min focus` : `${breakDuration} min break`}
            </span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2 mb-4 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
          <button
            onClick={() => switchMode('focus')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5
              ${mode === 'focus' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
          >
            <Brain size={14} /> Focus
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5
              ${mode === 'break' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
          >
            <Coffee size={14} /> Break
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button onClick={resetTimer}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer transition-all">
            <RotateCcw size={18} />
          </button>
          <button onClick={toggleTimer}
            className={`p-4 rounded-full text-white shadow-lg transition-all cursor-pointer hover:scale-105
              ${mode === 'focus'
                ? 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-primary-200'
                : 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200'
              }`}>
            {isRunning ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>
          <button onClick={() => setSoundOn(!soundOn)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer transition-all">
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>

        {/* Quick Duration Presets */}
        {!showSettings ? (
          <button onClick={() => setShowSettings(true)}
            className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mx-auto hover:text-primary-600 cursor-pointer">
            <Settings size={12} /> Customize duration
          </button>
        ) : (
          <TimerSettings
            focusDuration={focusDuration}
            breakDuration={breakDuration}
            onApply={applySettings}
            onCancel={() => setShowSettings(false)}
          />
        )}
      </div>

      {/* Stats Footer */}
      <div className="px-4 pb-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{sessions}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Sessions</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-600">{sessions * focusDuration}m</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Today</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary-600">{totalHours}h {totalMins}m</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">All Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimerSettings({ focusDuration, breakDuration, onApply, onCancel }: {
  focusDuration: number;
  breakDuration: number;
  onApply: (focus: number, brk: number) => void;
  onCancel: () => void;
}) {
  const [focus, setFocus] = useState(focusDuration);
  const [brk, setBrk] = useState(breakDuration);

  return (
    <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Focus (min)</label>
          <div className="flex items-center gap-1 mt-1">
            {[25, 45, 50].map(v => (
              <button key={v} onClick={() => setFocus(v)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all
                  ${focus === v ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Break (min)</label>
          <div className="flex items-center gap-1 mt-1">
            {[5, 10, 15].map(v => (
              <button key={v} onClick={() => setBrk(v)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all
                  ${brk === v ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onApply(focus, brk)}
          className="flex-1 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-medium cursor-pointer hover:bg-primary-700">
          Apply
        </button>
        <button onClick={onCancel}
          className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium cursor-pointer hover:bg-slate-300">
          Cancel
        </button>
      </div>
    </div>
  );
}
