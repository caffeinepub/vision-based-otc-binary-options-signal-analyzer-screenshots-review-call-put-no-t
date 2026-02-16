import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  accountBalance: number;
  dailyStopLoss: number;
  soundEnabled: boolean;
  setAccountBalance: (balance: number) => void;
  setDailyStopLoss: (limit: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      accountBalance: 1000,
      dailyStopLoss: 50,
      soundEnabled: true,
      
      setAccountBalance: (balance) => set({ accountBalance: balance }),
      setDailyStopLoss: (limit) => set({ dailyStopLoss: limit }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled })
    }),
    {
      name: 'otc-signal-lab-settings'
    }
  )
);
