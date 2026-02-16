import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, DollarSign } from 'lucide-react';
import { useSettingsStore } from '../../state/settingsStore';
import { RiskCalculation } from '../../lib/risk/riskCalculator';

interface RiskPanelProps {
  riskCalc: RiskCalculation;
}

export default function RiskPanel({ riskCalc }: RiskPanelProps) {
  const { accountBalance, dailyStopLoss, setAccountBalance, setDailyStopLoss } = useSettingsStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Risk Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="balance">Account Balance ($)</Label>
            <Input
              id="balance"
              type="number"
              min="0"
              step="10"
              value={accountBalance}
              onChange={(e) => setAccountBalance(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stopLoss">Daily Stop-Loss ($)</Label>
            <Input
              id="stopLoss"
              type="number"
              min="0"
              step="5"
              value={dailyStopLoss}
              onChange={(e) => setDailyStopLoss(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/30">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">2% Risk Per Trade:</span>
            <span className="font-bold">${riskCalc.recommendedStake.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Daily Loss Today:</span>
            <span className={`font-bold ${riskCalc.dailyLossToday > 0 ? 'text-red-500' : 'text-green-500'}`}>
              ${riskCalc.dailyLossToday.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Trades Remaining:</span>
            <span className="font-bold">{riskCalc.tradesRemainingToday}</span>
          </div>
        </div>

        {riskCalc.stopLossHit && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Daily stop-loss limit reached. No more trades should be taken today.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
