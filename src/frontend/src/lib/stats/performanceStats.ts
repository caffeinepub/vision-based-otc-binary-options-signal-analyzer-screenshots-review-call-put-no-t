import { AnalysisSession } from '../../types/analysis';
import { Outcome } from '../../backend';

export interface PerformanceStats {
  totalTrades: number;
  wins: number;
  losses: number;
  notTaken: number;
  winRate: number;
  currentStreak: number;
  streakType: 'win' | 'loss' | 'none';
  bestStreak: number;
}

export function computePerformanceStats(sessions: AnalysisSession[]): PerformanceStats {
  const takenSessions = sessions.filter(s => s.taken);
  
  const wins = takenSessions.filter(s => s.outcome === Outcome.win).length;
  const losses = takenSessions.filter(s => s.outcome === Outcome.loss).length;
  const notTaken = sessions.filter(s => !s.taken).length;
  
  const totalTrades = wins + losses;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  // Calculate streaks
  let currentStreak = 0;
  let streakType: 'win' | 'loss' | 'none' = 'none';
  let bestStreak = 0;
  let tempStreak = 0;
  let lastOutcome: Outcome | null = null;

  for (const session of takenSessions) {
    if (!session.outcome || session.outcome === Outcome.unknown_ || session.outcome === Outcome.notTaken) {
      continue;
    }

    if (lastOutcome === session.outcome) {
      tempStreak++;
    } else {
      if (lastOutcome === Outcome.win) {
        bestStreak = Math.max(bestStreak, tempStreak);
      }
      tempStreak = 1;
      lastOutcome = session.outcome;
    }
  }

  if (lastOutcome === Outcome.win) {
    bestStreak = Math.max(bestStreak, tempStreak);
    currentStreak = tempStreak;
    streakType = 'win';
  } else if (lastOutcome === Outcome.loss) {
    currentStreak = tempStreak;
    streakType = 'loss';
  }

  return {
    totalTrades,
    wins,
    losses,
    notTaken,
    winRate,
    currentStreak,
    streakType,
    bestStreak
  };
}
