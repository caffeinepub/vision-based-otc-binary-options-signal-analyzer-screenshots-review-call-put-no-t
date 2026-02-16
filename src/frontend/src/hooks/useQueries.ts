import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { TradeAnalysis, UserProfile, Asset, Signal, Strategy, Outcome } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

export function useGetTradeAnalyses() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TradeAnalysis[]>({
    queryKey: ['tradeAnalyses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTradeAnalysesSortedByTime();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useStoreTradeAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      asset: Asset;
      strategy: Strategy;
      generatedSignal: Signal;
      confidence: number;
      createdTimestamp: bigint;
      closedTimestamp: bigint | null;
      outcome: Outcome | null;
      userCorrectedSignal: Signal | null;
      confidenceScoreAfterCorrection: number;
      indicators: any;
      totalBearishCandles: bigint;
      totalBullishCandles: bigint;
      totalDojiCandles: bigint;
      totalHammerCandles: bigint;
      totalInvertedHammerCandles: bigint;
      totalBeltCandles: bigint;
      trapWicksTriggered: boolean;
      isContinuationTrade: boolean;
      failedWickAttempts: bigint;
      trapStrongReversalPattern: boolean;
      trapDojiCandle: boolean;
      strongMomentumPattern: boolean;
      trapWickActive: boolean;
      finalWickAttempt: boolean;
      momentumActivePercentage: number;
      highMomentumPercentage: number;
      weakMomentumPercenage: number;
      reversalPercentage: number;
      endingMomentumPercentage: number;
      trendStartPercentage: number;
      trapResistanceReversalPercentage: number;
      firstContinuation: any;
      secondContinuation: any;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.storeTradeAnalysis(
        params.id,
        params.asset,
        params.strategy,
        params.generatedSignal,
        params.confidence,
        params.createdTimestamp,
        params.closedTimestamp,
        params.outcome,
        params.userCorrectedSignal,
        params.confidenceScoreAfterCorrection,
        params.indicators,
        params.totalBearishCandles,
        params.totalBullishCandles,
        params.totalDojiCandles,
        params.totalHammerCandles,
        params.totalInvertedHammerCandles,
        params.totalBeltCandles,
        params.trapWicksTriggered,
        params.isContinuationTrade,
        params.failedWickAttempts,
        params.trapStrongReversalPattern,
        params.trapDojiCandle,
        params.strongMomentumPattern,
        params.trapWickActive,
        params.finalWickAttempt,
        params.momentumActivePercentage,
        params.highMomentumPercentage,
        params.weakMomentumPercenage,
        params.reversalPercentage,
        params.endingMomentumPercentage,
        params.trendStartPercentage,
        params.trapResistanceReversalPercentage,
        params.firstContinuation,
        params.secondContinuation
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tradeAnalyses'] });
    }
  });
}
