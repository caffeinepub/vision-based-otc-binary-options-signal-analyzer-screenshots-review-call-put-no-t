import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    name: string;
    preferredAsset?: Asset;
}
export interface TradeAnalysis {
    id: string;
    secondContinuation?: {
        closeInCurrentMinute: boolean;
        continuationAfterLoss: boolean;
    };
    totalBearishCandles: bigint;
    endingMomentumPercentage: number;
    momentumActivePercentage: number;
    asset: Asset;
    totalHammerCandles: bigint;
    userCorrectedSignal?: Signal;
    generatedSignal: Signal;
    confidenceScoreAfterCorrection: number;
    owner: Principal;
    totalBullishCandles: bigint;
    trapWickActive: boolean;
    trapWicksTriggered: boolean;
    strategy: Strategy;
    highMomentumPercentage: number;
    strongMomentumPattern: boolean;
    finalWickAttempt: boolean;
    failedWickAttempts: bigint;
    trendStartPercentage: number;
    totalBeltCandles: bigint;
    isContinuationTrade: boolean;
    reversalPercentage: number;
    createdTimestamp: Time;
    weakMomentumPercenage: number;
    indicators: {
        adx: number;
        hma: number;
        rsi: number;
        emaFast: number;
        emaSlow: number;
        stochasticFast: number;
        stochasticSlow: number;
        macd: number;
        currentCandleFullWickRatio: number;
        candleCountCurrentTrend: bigint;
        momentum: number;
        currentCandleMaxBodyWickRatio: number;
        dmiDirectional: number;
        currentCandleFullBodyWickRatio: number;
    };
    trapStrongReversalPattern: boolean;
    closedTimestamp?: Time;
    trapDojiCandle: boolean;
    confidence: number;
    firstContinuation?: {
        closeInCurrentMinute: boolean;
        continuationAfterLoss: boolean;
    };
    outcome?: Outcome;
    trapResistanceReversalPercentage: number;
    totalDojiCandles: bigint;
    totalInvertedHammerCandles: bigint;
}
export enum Asset {
    eurUsdOtc = "eurUsdOtc",
    usdJpyOtc = "usdJpyOtc"
}
export enum Outcome {
    win = "win",
    loss = "loss",
    notTaken = "notTaken",
    unknown_ = "unknown"
}
export enum Signal {
    put = "put",
    call = "call",
    noTrade = "noTrade"
}
export enum Strategy {
    colorFollowsColor = "colorFollowsColor",
    combined = "combined",
    trapWicks = "trapWicks"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    analysisIdExists(id: string): Promise<boolean>;
    anyAnalysisAssetIsEurUsdOtc(): Promise<boolean>;
    anyTradeAnalysisCreatedBefore(time: Time): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteTradeAnalysis(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNumAnalyses(): Promise<bigint>;
    getTradeAnalyses(): Promise<Array<TradeAnalysis>>;
    getTradeAnalysesByOutcome(outcomeFilter: Outcome | null): Promise<Array<TradeAnalysis>>;
    getTradeAnalysesSortedByTime(): Promise<Array<TradeAnalysis>>;
    getTradeAnalysis(id: string): Promise<TradeAnalysis>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasAnalysisWithOutcome(outcome: Outcome): Promise<boolean>;
    hasTradeAnalysisWithConfidence(confidence: number): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    storeTradeAnalysis(id: string, asset: Asset, strategy: Strategy, generatedSignal: Signal, confidence: number, createdTimestamp: Time, closedTimestamp: Time | null, outcome: Outcome | null, userCorrectedSignal: Signal | null, confidenceScoreAfterCorrection: number, indicators: {
        adx: number;
        hma: number;
        rsi: number;
        emaFast: number;
        emaSlow: number;
        stochasticFast: number;
        stochasticSlow: number;
        macd: number;
        currentCandleFullWickRatio: number;
        candleCountCurrentTrend: bigint;
        momentum: number;
        currentCandleMaxBodyWickRatio: number;
        dmiDirectional: number;
        currentCandleFullBodyWickRatio: number;
    }, totalBearishCandles: bigint, totalBullishCandles: bigint, totalDojiCandles: bigint, totalHammerCandles: bigint, totalInvertedHammerCandles: bigint, totalBeltCandles: bigint, trapWicksTriggered: boolean, isContinuationTrade: boolean, failedWickAttempts: bigint, trapStrongReversalPattern: boolean, trapDojiCandle: boolean, strongMomentumPattern: boolean, trapWickActive: boolean, finalWickAttempt: boolean, momentumActivePercentage: number, highMomentumPercentage: number, weakMomentumPercenage: number, reversalPercentage: number, endingMomentumPercentage: number, trendStartPercentage: number, trapResistanceReversalPercentage: number, firstContinuation: {
        closeInCurrentMinute: boolean;
        continuationAfterLoss: boolean;
    } | null, secondContinuation: {
        closeInCurrentMinute: boolean;
        continuationAfterLoss: boolean;
    } | null): Promise<void>;
}
