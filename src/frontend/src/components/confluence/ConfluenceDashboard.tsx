import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfluenceSummary } from '../../types/analysis';
import { Signal } from '../../backend';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ConfluenceDashboardProps {
  confluence: ConfluenceSummary;
}

export default function ConfluenceDashboard({ confluence }: ConfluenceDashboardProps) {
  const getSignalIcon = (signal: Signal) => {
    if (signal === Signal.call) return <TrendingUp className="h-4 w-4" />;
    if (signal === Signal.put) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getSignalColor = (signal: Signal) => {
    if (signal === Signal.call) return 'text-green-500';
    if (signal === Signal.put) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const getOverallBadge = () => {
    if (confluence.overallState === 'aligned') {
      return <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Aligned</Badge>;
    } else if (confluence.overallState === 'mixed') {
      return <Badge variant="outline">Mixed</Badge>;
    } else {
      return <Badge variant="secondary">No Confluence</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Multi-Timeframe Confluence</CardTitle>
          {getOverallBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {confluence.timeframes.map((tf) => (
            <div key={tf.timeframe} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{tf.timeframe}</h4>
                <div className={`flex items-center gap-1 ${getSignalColor(tf.signal)}`}>
                  {getSignalIcon(tf.signal)}
                  <span className="text-sm font-medium">
                    {tf.signal === Signal.call ? 'CALL' : tf.signal === Signal.put ? 'PUT' : 'NO TRADE'}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Confidence: <span className="text-foreground font-medium">{tf.confidence}%</span>
              </div>

              <div className="space-y-1">
                {tf.conditions.slice(0, 2).map((condition, idx) => (
                  <p key={idx} className="text-xs text-muted-foreground">• {condition}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {confluence.overallState === 'aligned' && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-500 font-medium">
              ✓ All timeframes aligned for {confluence.alignedSignal === Signal.call ? 'CALL' : 'PUT'} - High probability entry
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
