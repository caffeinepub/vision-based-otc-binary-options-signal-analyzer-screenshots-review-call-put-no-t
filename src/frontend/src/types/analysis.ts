import { Asset, Signal, Strategy, Outcome } from '../backend';

export interface ExtractedFeatures {
  // Candle properties
  candleColor: 'green' | 'red' | 'neutral';
  candleType: 'long' | 'standard' | 'doji' | 'hammer' | 'inverted-hammer' | 'belt';
  wickToBodyRatio: number;
  fullBodyWickRatio: number;
  fullWickRatio: number;
  
  // Indicator values
  rsi: number;
  bollingerStatus: 'pierced' | 'normal' | 'bounced';
  emaSlow: number;
  emaFast: number;
  stochasticFast: number;
  stochasticSlow: number;
  macd: number;
  hma: number;
  momentum: number;
  adx: number;
  dmiDirectional: number;
  
  // Trend info
  candleCountCurrentTrend: number;
  
  // Confidence flags
  missingFields: string[];
  lowConfidenceFields: string[];
}

export interface TimeframeOutput {
  timeframe: 'S30' | 'M1' | 'M5';
  signal: Signal;
  confidence: number;
  conditions: string[];
}

export interface ConfluenceSummary {
  timeframes: TimeframeOutput[];
  overallState: 'aligned' | 'mixed' | 'no-confluence';
  alignedSignal?: Signal;
}

export interface SignalResult {
  signal: Signal;
  confidence: number;
  rationale: string[];
  contributingStrategies: Strategy[];
}

export interface AnalysisSession {
  id: string;
  timestamp: number;
  asset: Asset;
  imageDataUrl?: string;
  extractedFeatures?: ExtractedFeatures;
  confirmedFeatures?: ExtractedFeatures;
  signalResult?: SignalResult;
  confluence?: ConfluenceSummary;
  outcome?: Outcome;
  taken: boolean;
}
