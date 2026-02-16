import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { useSettingsStore } from '../../state/settingsStore';

export default function CandleTimer() {
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const { soundEnabled, setSoundEnabled } = useSettingsStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAlertRef = useRef<number>(0);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/assets/sounds/candle-open.mp3');
    
    const updateTimer = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const remaining = 60 - seconds;
      setSecondsRemaining(remaining === 60 ? 0 : remaining);

      // Play sound at candle open (00 seconds)
      if (remaining === 60 && soundEnabled) {
        const currentMinute = now.getMinutes();
        if (currentMinute !== lastAlertRef.current) {
          lastAlertRef.current = currentMinute;
          audioRef.current?.play().catch(() => {
            // Ignore autoplay errors
          });
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const progress = ((60 - secondsRemaining) / 60) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            1-Minute Candle Timer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="sound" className="text-sm">Sound</Label>
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-6xl font-bold tabular-nums ${secondsRemaining <= 5 ? 'text-red-500 animate-pulse' : ''}`}>
              {String(secondsRemaining).padStart(2, '0')}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {secondsRemaining === 0 ? 'New candle opening!' : 'seconds to next candle'}
            </p>
          </div>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
