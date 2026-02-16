import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnalysisSession } from '../../types/analysis';
import { Signal } from '../../backend';
import { Clock, Eye } from 'lucide-react';

interface AnalysisHistoryPanelProps {
  sessions: AnalysisSession[];
  onSelectSession: (session: AnalysisSession) => void;
}

export default function AnalysisHistoryPanel({ sessions, onSelectSession }: AnalysisHistoryPanelProps) {
  const getSignalBadge = (signal?: Signal) => {
    if (!signal) return null;
    
    const variant = signal === Signal.call ? 'default' : signal === Signal.put ? 'destructive' : 'secondary';
    const text = signal === Signal.call ? 'CALL' : signal === Signal.put ? 'PUT' : 'NO TRADE';
    
    return <Badge variant={variant} className="text-xs">{text}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis History ({sessions.length}/20)</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No analysis history yet. Upload a screenshot to get started.
              </p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(session.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {session.asset === 'eurUsdOtc' ? 'EUR/USD OTC' : 'USD/JPY OTC'}
                        </Badge>
                        {session.signalResult && getSignalBadge(session.signalResult.signal)}
                        {session.signalResult && (
                          <span className="text-xs text-muted-foreground">
                            {session.signalResult.confidence}%
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSelectSession(session)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
