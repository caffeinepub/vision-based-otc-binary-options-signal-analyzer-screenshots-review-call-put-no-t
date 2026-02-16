import { ExtractedFeatures, SignalResult } from '../../types/analysis';
import { Signal, Strategy } from '../../backend';

export function generateSignal(features: ExtractedFeatures): SignalResult {
  const rationale: string[] = [];
  const strategies: Strategy[] = [];
  let confidence = 0;
  let signal: Signal = Signal.noTrade;

  // Strategy 1: Color Follows Color (Momentum)
  const momentumScore = analyzeMomentum(features);
  if (momentumScore.active) {
    strategies.push(Strategy.colorFollowsColor);
    rationale.push(...momentumScore.reasons);
    confidence += momentumScore.confidence;
    signal = momentumScore.signal;
  }

  // Strategy 2: Trap Wick Reversal
  const wickScore = analyzeTrapWick(features);
  if (wickScore.active) {
    strategies.push(Strategy.trapWicks);
    rationale.push(...wickScore.reasons);
    
    // If both strategies agree, boost confidence
    if (signal === wickScore.signal) {
      confidence = Math.min(95, confidence + wickScore.confidence);
      rationale.push('Multiple strategies aligned');
    } else if (signal === Signal.noTrade) {
      signal = wickScore.signal;
      confidence = wickScore.confidence;
    } else {
      // Conflict - return NO TRADE
      return {
        signal: Signal.noTrade,
        confidence: 0,
        rationale: ['Strategy conflict detected - no clear signal'],
        contributingStrategies: [Strategy.combined]
      };
    }
  }

  // Apply candle classification filters
  const filterResult = applyCandleFilters(features, signal);
  if (!filterResult.passed) {
    return {
      signal: Signal.noTrade,
      confidence: 0,
      rationale: filterResult.reasons,
      contributingStrategies: strategies
    };
  }

  // Minimum confidence threshold
  if (confidence < 60) {
    return {
      signal: Signal.noTrade,
      confidence,
      rationale: ['Confidence below threshold (60%)'],
      contributingStrategies: strategies
    };
  }

  return {
    signal,
    confidence,
    rationale,
    contributingStrategies: strategies.length > 1 ? [Strategy.combined] : strategies
  };
}

function analyzeMomentum(features: ExtractedFeatures) {
  const reasons: string[] = [];
  let confidence = 0;
  let signal: Signal = Signal.noTrade;
  let active = false;

  // Check for strong momentum pattern
  if (features.candleType === 'long' && features.candleCountCurrentTrend >= 2) {
    active = true;
    
    if (features.candleColor === 'green' && features.rsi < 70) {
      signal = Signal.call;
      confidence = 75;
      reasons.push('Strong bullish momentum detected');
      reasons.push('RSI below overbought zone');
    } else if (features.candleColor === 'red' && features.rsi > 30) {
      signal = Signal.put;
      confidence = 75;
      reasons.push('Strong bearish momentum detected');
      reasons.push('RSI above oversold zone');
    }

    // Boost confidence if trend is established
    if (features.candleCountCurrentTrend >= 3) {
      confidence += 10;
      reasons.push('Established trend (3+ candles)');
    }
  }

  return { active, signal, confidence, reasons };
}

function analyzeTrapWick(features: ExtractedFeatures) {
  const reasons: string[] = [];
  let confidence = 0;
  let signal: Signal = Signal.noTrade;
  let active = false;

  // Check for trap wick reversal pattern
  if (features.wickToBodyRatio > 0.6 && features.bollingerStatus === 'pierced') {
    active = true;
    
    if (features.rsi > 80) {
      signal = Signal.put;
      confidence = 90;
      reasons.push('Trap wick reversal detected (bearish)');
      reasons.push('RSI extremely overbought');
      reasons.push('Bollinger band pierced');
    } else if (features.rsi < 20) {
      signal = Signal.call;
      confidence = 90;
      reasons.push('Trap wick reversal detected (bullish)');
      reasons.push('RSI extremely oversold');
      reasons.push('Bollinger band pierced');
    }
  }

  return { active, signal, confidence, reasons };
}

function applyCandleFilters(features: ExtractedFeatures, signal: Signal) {
  const reasons: string[] = [];

  // Filter out doji candles in low volatility
  if (features.candleType === 'doji' && features.adx < 20) {
    return {
      passed: false,
      reasons: ['Doji candle in low volatility - potential fake-out']
    };
  }

  // Filter exhaustion patterns
  if (features.wickToBodyRatio > 2 && signal !== Signal.noTrade) {
    return {
      passed: false,
      reasons: ['Exhaustion pattern detected - avoiding entry']
    };
  }

  return { passed: true, reasons };
}
