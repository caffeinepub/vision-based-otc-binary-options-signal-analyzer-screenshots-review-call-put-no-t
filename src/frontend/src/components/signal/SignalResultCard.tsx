import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SignalResult } from '../../types/analysis';
import { Signal } from '../../backend';

interface SignalResultCardProps {
  result: SignalResult;
}

export default function SignalResultCard({ result }: SignalResultCardProps) {
  const getSignalIcon = () => {
    if (result.signal === Signal.call) return '/assets/generated/icon-call.dim_128x128.png';
    if (result.signal === Signal.put) return '/assets/generated/icon-put.dim_128x128.png';
    return '/assets/generated/icon-no-trade.dim_128x128.png';
  };

  const getSignalColor = () => {
    if (result.signal === Signal.call) return 'bg-green-500/20 text-green-500 border-green-500/50';
    if (result.signal === Signal.put) return 'bg-red-500/20 text-red-500 border-red-500/50';
    return 'bg-muted text-muted-foreground border-border';
  };

  const getSignalText = () => {
    if (result.signal === Signal.call) return 'CALL';
    if (result.signal === Signal.put) return 'PUT';
    return 'NO TRADE';
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Signal Generated</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <img src={getSignalIcon()} alt={getSignalText()} className="h-20 w-20" />
          <div className="flex-1">
            <Badge className={`text-lg px-4 py-2 ${getSignalColor()}`}>
              {getSignalText()}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Confidence: <span className="text-foreground font-bold text-lg">{result.confidence}%</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Strategy Analysis:</h4>
          <div className="space-y-1">
            {result.rationale.map((reason, idx) => (
              <p key={idx} className="text-sm text-muted-foreground">• {reason}</p>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {result.contributingStrategies.map((strategy) => (
            <Badge key={strategy} variant="outline">
              {strategy === 'colorFollowsColor' ? 'Momentum' : 
               strategy === 'trapWicks' ? 'Trap Wick' : 'Combined'}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
