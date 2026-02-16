import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ExtractedFeatures } from '../../types/analysis';

interface ReviewConfirmPanelProps {
  extractedFeatures: ExtractedFeatures;
  onConfirm: (confirmedFeatures: ExtractedFeatures) => void;
  onCancel: () => void;
}

export default function ReviewConfirmPanel({ extractedFeatures, onConfirm, onCancel }: ReviewConfirmPanelProps) {
  const [features, setFeatures] = useState<ExtractedFeatures>(extractedFeatures);

  const hasIssues = features.missingFields.length > 0 || features.lowConfidenceFields.length > 0;

  const updateFeature = <K extends keyof ExtractedFeatures>(key: K, value: ExtractedFeatures[K]) => {
    setFeatures(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Confirm Extracted Values</CardTitle>
        <CardDescription>
          Verify the extracted values and make corrections if needed before generating the signal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasIssues && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some values have low confidence or are missing. Please review and correct them.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="candleColor">Candle Color</Label>
            <Select 
              value={features.candleColor} 
              onValueChange={(v) => updateFeature('candleColor', v as any)}
            >
              <SelectTrigger id="candleColor">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="green">Green (Bullish)</SelectItem>
                <SelectItem value="red">Red (Bearish)</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="candleType">Candle Type</Label>
            <Select 
              value={features.candleType} 
              onValueChange={(v) => updateFeature('candleType', v as any)}
            >
              <SelectTrigger id="candleType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="long">Long Momentum</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="doji">Doji</SelectItem>
                <SelectItem value="hammer">Hammer</SelectItem>
                <SelectItem value="inverted-hammer">Inverted Hammer</SelectItem>
                <SelectItem value="belt">Belt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rsi">RSI Value</Label>
            <Input
              id="rsi"
              type="number"
              min="0"
              max="100"
              value={features.rsi}
              onChange={(e) => updateFeature('rsi', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bollingerStatus">Bollinger Status</Label>
            <Select 
              value={features.bollingerStatus} 
              onValueChange={(v) => updateFeature('bollingerStatus', v as any)}
            >
              <SelectTrigger id="bollingerStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pierced">Pierced</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wickToBodyRatio">Wick-to-Body Ratio</Label>
            <Input
              id="wickToBodyRatio"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={features.wickToBodyRatio}
              onChange={(e) => updateFeature('wickToBodyRatio', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="candleCountCurrentTrend">Candles in Current Trend</Label>
            <Input
              id="candleCountCurrentTrend"
              type="number"
              min="0"
              value={features.candleCountCurrentTrend}
              onChange={(e) => updateFeature('candleCountCurrentTrend', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={() => onConfirm(features)} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm & Generate Signal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
