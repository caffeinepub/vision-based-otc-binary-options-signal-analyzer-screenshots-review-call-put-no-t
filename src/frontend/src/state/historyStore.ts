import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalysisSession } from '../types/analysis';

interface HistoryState {
  sessions: AnalysisSession[];
  addSession: (session: AnalysisSession) => void;
  updateSession: (id: string, updates: Partial<AnalysisSession>) => void;
  getSession: (id: string) => AnalysisSession | undefined;
  clearHistory: () => void;
}

const MAX_HISTORY = 20;

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],
      
      addSession: (session) => set((state) => {
        const newSessions = [session, ...state.sessions].slice(0, MAX_HISTORY);
        return { sessions: newSessions };
      }),
      
      updateSession: (id, updates) => set((state) => ({
        sessions: state.sessions.map(s => 
          s.id === id ? { ...s, ...updates } : s
        )
      })),
      
      getSession: (id) => {
        return get().sessions.find(s => s.id === id);
      },
      
      clearHistory: () => set({ sessions: [] })
    }),
    {
      name: 'otc-signal-lab-history'
    }
  )
);
