import { ExtractedFeatures, TimeframeOutput, ConfluenceSummary } from '../../types/analysis';
import { Signal } from '../../backend';
import { generateSignal } from '../engine/combinedSignalEngine';

export function computeConfluence(features: ExtractedFeatures): ConfluenceSummary {
  // Generate signals for each timeframe with adjusted parameters
  const s30 = generateTimeframeSignal(features, 'S30');
  const m1 = generateTimeframeSignal(features, 'M1');
  const m5 = generateTimeframeSignal(features, 'M5');

  const timeframes = [s30, m1, m5];

  // Determine overall confluence state
  const signals = timeframes.map(tf => tf.signal);
  const callCount = signals.filter(s => s === Signal.call).length;
  const putCount = signals.filter(s => s === Signal.put).length;

  let overallState: 'aligned' | 'mixed' | 'no-confluence';
  let alignedSignal: Signal | undefined;

  if (callCount === 3) {
    overallState = 'aligned';
    alignedSignal = Signal.call;
  } else if (putCount === 3) {
    overallState = 'aligned';
    alignedSignal = Signal.put;
  } else if (callCount >= 2 || putCount >= 2) {
    overallState = 'mixed';
    alignedSignal = callCount >= 2 ? Signal.call : Signal.put;
  } else {
    overallState = 'no-confluence';
  }

  return {
    timeframes,
    overallState,
    alignedSignal
  };
}

function generateTimeframeSignal(features: ExtractedFeatures, timeframe: 'S30' | 'M1' | 'M5'): TimeframeOutput {
  // Adjust features based on timeframe
  const adjustedFeatures = { ...features };
  
  if (timeframe === 'S30') {
    adjustedFeatures.candleCountCurrentTrend = Math.max(1, features.candleCountCurrentTrend - 1);
  } else if (timeframe === 'M5') {
    adjustedFeatures.candleCountCurrentTrend = features.candleCountCurrentTrend + 2;
  }

  const result = generateSignal(adjustedFeatures);

  return {
    timeframe,
    signal: result.signal,
    confidence: result.confidence,
    conditions: result.rationale
  };
}
