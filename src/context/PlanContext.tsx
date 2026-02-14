/* ============================================================
   PlanContext – Provides dynamic plan config + generated schedule
   to all components. Persists config in localStorage.
   ============================================================ */
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  generateSchedule,
  DEFAULT_CONFIG,
  type PlanConfig, type DayPlan,
} from '@/data/schedule';

interface PlanContextType {
  config: PlanConfig;
  setConfig: (config: PlanConfig) => void;
  schedule: DayPlan[];
  totalDays: number;
  isConfigured: boolean;
  resetPlan: () => void;
}

const PlanContext = createContext<PlanContextType | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useLocalStorage<PlanConfig | null>('cds-plan-config', null);

  const activeConfig = config || DEFAULT_CONFIG;
  const isConfigured = config !== null;

  const schedule = useMemo(() => {
    return generateSchedule(activeConfig);
  }, [activeConfig]);

  const totalDays = schedule.length;

  const handleSetConfig = (newConfig: PlanConfig) => {
    setConfig(newConfig);
    // Reset dependent data when config changes
    localStorage.removeItem('cds-completed-days');
    localStorage.removeItem('cds-mock-tests');
  };

  const resetPlan = () => {
    setConfig(null);
    localStorage.removeItem('cds-completed-days');
    localStorage.removeItem('cds-mock-tests');
    localStorage.removeItem('cds-english-topics');
    localStorage.removeItem('cds-maths-topics');
    localStorage.removeItem('cds-gk-topics');
    localStorage.removeItem('cds-milestones');
  };

  return (
    <PlanContext.Provider value={{
      config: activeConfig,
      setConfig: handleSetConfig,
      schedule,
      totalDays,
      isConfigured,
      resetPlan,
    }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
