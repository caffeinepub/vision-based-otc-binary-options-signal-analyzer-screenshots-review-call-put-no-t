import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PerformanceStats } from '../../lib/stats/performanceStats';
import { TrendingUp, Target, Award } from 'lucide-react';

interface PerformanceStatsPanelProps {
  stats: PerformanceStats;
}

export default function PerformanceStatsPanel({ stats }: PerformanceStatsPanelProps) {
  const getWinRateColor = () => {
    if (stats.winRate >= 85) return 'text-green-500';
    if (stats.winRate >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Performance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.totalTrades}</p>
            <p className="text-xs text-muted-foreground">Total Trades</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">{stats.wins}</p>
            <p className="text-xs text-muted-foreground">Wins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">{stats.losses}</p>
            <p className="text-xs text-muted-foreground">Losses</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${getWinRateColor()}`}>
              {stats.winRate.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">Win Rate</p>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Current Streak:
            </span>
            <Badge variant={stats.streakType === 'win' ? 'default' : 'destructive'}>
              {stats.currentStreak} {stats.streakType === 'win' ? 'Wins' : stats.streakType === 'loss' ? 'Losses' : 'None'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              Best Streak:
            </span>
            <span className="font-bold text-green-500">{stats.bestStreak} Wins</span>
          </div>
        </div>

        {stats.winRate >= 85 && stats.totalTrades >= 10 && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-500 font-medium">
              ✓ Target achieved! Maintaining 85%+ win-rate
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
