import { AnalysisSession } from '../../types/analysis';
import { Outcome } from '../../backend';

export interface RiskCalculation {
  accountBalance: number;
  dailyStopLoss: number;
  riskPerTrade: number;
  recommendedStake: number;
  dailyLossToday: number;
  tradesRemainingToday: number;
  stopLossHit: boolean;
}

export function calculateRisk(
  accountBalance: number,
  dailyStopLoss: number,
  sessions: AnalysisSession[]
): RiskCalculation {
  const riskPerTrade = accountBalance * 0.02;
  
  // Calculate today's losses
  const today = new Date().setHours(0, 0, 0, 0);
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.timestamp).setHours(0, 0, 0, 0);
    return sessionDate === today && s.taken;
  });

  let dailyLossToday = 0;
  todaySessions.forEach(session => {
    if (session.outcome === Outcome.loss) {
      dailyLossToday += riskPerTrade;
    } else if (session.outcome === Outcome.win) {
      // Assuming 80% payout for wins
      dailyLossToday -= riskPerTrade * 0.8;
    }
  });

  const stopLossHit = dailyLossToday >= dailyStopLoss;
  const tradesRemainingToday = stopLossHit ? 0 : Math.floor((dailyStopLoss - dailyLossToday) / riskPerTrade);

  return {
    accountBalance,
    dailyStopLoss,
    riskPerTrade,
    recommendedStake: riskPerTrade,
    dailyLossToday,
    tradesRemainingToday,
    stopLossHit
  };
}
