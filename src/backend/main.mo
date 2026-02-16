import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    preferredAsset : ?Asset;
  };

  type Strategy = {
    #colorFollowsColor;
    #trapWicks;
    #combined;
  };

  type Signal = {
    #call;
    #put;
    #noTrade;
  };

  type Asset = {
    #eurUsdOtc;
    #usdJpyOtc;
  };

  type Outcome = {
    #win;
    #loss;
    #notTaken;
    #unknown;
  };

  type TradeAnalysis = {
    id : Text;
    owner : Principal;
    asset : Asset;
    strategy : Strategy;
    generatedSignal : Signal;
    confidence : Float;
    createdTimestamp : Time.Time;
    closedTimestamp : ?Time.Time;
    outcome : ?Outcome;
    userCorrectedSignal : ?Signal;
    confidenceScoreAfterCorrection : Float;

    // Candle/indicator features
    indicators : {
      emaSlow : Float;
      emaFast : Float;
      stochasticFast : Float;
      stochasticSlow : Float;
      rsi : Float;
      macd : Float;
      hma : Float;
      momentum : Float;
      adx : Float;
      dmiDirectional : Float;
      candleCountCurrentTrend : Nat;
      currentCandleMaxBodyWickRatio : Float;
      currentCandleFullBodyWickRatio : Float;
      currentCandleFullWickRatio : Float;
    };

    // Candle statistics
    totalBearishCandles : Nat;
    totalBullishCandles : Nat;
    totalDojiCandles : Nat;
    totalHammerCandles : Nat;
    totalInvertedHammerCandles : Nat;
    totalBeltCandles : Nat;

    // Trap wick reversal statistics
    trapWicksTriggered : Bool;
    isContinuationTrade : Bool;
    failedWickAttempts : Nat;
    trapStrongReversalPattern : Bool;
    trapDojiCandle : Bool;
    strongMomentumPattern : Bool;
    trapWickActive : Bool;
    finalWickAttempt : Bool;

    // Color follows color momentum stats
    momentumActivePercentage : Float;
    highMomentumPercentage : Float;
    weakMomentumPercenage : Float;
    reversalPercentage : Float;
    endingMomentumPercentage : Float;
    trendStartPercentage : Float;
    trapResistanceReversalPercentage : Float;

    // Continuation strategy stats
    firstContinuation : ?{
      closeInCurrentMinute : Bool;
      continuationAfterLoss : Bool;
    };

    secondContinuation : ?{
      closeInCurrentMinute : Bool;
      continuationAfterLoss : Bool;
    };
  };

  module TradeAnalysis {
    public func compare(a : TradeAnalysis, b : TradeAnalysis) : Order.Order {
      Text.compare(a.id, b.id);
    };

    public func compareByCreatedTime(a : TradeAnalysis, b : TradeAnalysis) : Order.Order {
      if (a.createdTimestamp < b.createdTimestamp) { return #less };
      if (a.createdTimestamp > b.createdTimestamp) { return #greater };
      return #equal;
    };
  };

  let analyses = Map.empty<Text, TradeAnalysis>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Trade Analysis Management
  public shared ({ caller }) func storeTradeAnalysis(
    id : Text,
    asset : Asset,
    strategy : Strategy,
    generatedSignal : Signal,
    confidence : Float,
    createdTimestamp : Time.Time,
    closedTimestamp : ?Time.Time,
    outcome : ?Outcome,
    userCorrectedSignal : ?Signal,
    confidenceScoreAfterCorrection : Float,
    indicators : {
      emaSlow : Float;
      emaFast : Float;
      stochasticFast : Float;
      stochasticSlow : Float;
      rsi : Float;
      macd : Float;
      hma : Float;
      momentum : Float;
      adx : Float;
      dmiDirectional : Float;
      candleCountCurrentTrend : Nat;
      currentCandleMaxBodyWickRatio : Float;
      currentCandleFullBodyWickRatio : Float;
      currentCandleFullWickRatio : Float;
    },
    totalBearishCandles : Nat,
    totalBullishCandles : Nat,
    totalDojiCandles : Nat,
    totalHammerCandles : Nat,
    totalInvertedHammerCandles : Nat,
    totalBeltCandles : Nat,
    trapWicksTriggered : Bool,
    isContinuationTrade : Bool,
    failedWickAttempts : Nat,
    trapStrongReversalPattern : Bool,
    trapDojiCandle : Bool,
    strongMomentumPattern : Bool,
    trapWickActive : Bool,
    finalWickAttempt : Bool,
    momentumActivePercentage : Float,
    highMomentumPercentage : Float,
    weakMomentumPercenage : Float,
    reversalPercentage : Float,
    endingMomentumPercentage : Float,
    trendStartPercentage : Float,
    trapResistanceReversalPercentage : Float,
    firstContinuation : ?{
      closeInCurrentMinute : Bool;
      continuationAfterLoss : Bool;
    },
    secondContinuation : ?{
      closeInCurrentMinute : Bool;
      continuationAfterLoss : Bool;
    },
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can store trade analyses");
    };

    let analysis : TradeAnalysis = {
      id;
      owner = caller;
      asset;
      strategy;
      generatedSignal;
      confidence;
      createdTimestamp;
      closedTimestamp;
      outcome;
      userCorrectedSignal;
      confidenceScoreAfterCorrection;
      indicators;
      totalBearishCandles;
      totalBullishCandles;
      totalDojiCandles;
      totalHammerCandles;
      totalInvertedHammerCandles;
      totalBeltCandles;
      trapWicksTriggered;
      isContinuationTrade;
      failedWickAttempts;
      trapStrongReversalPattern;
      trapDojiCandle;
      strongMomentumPattern;
      trapWickActive;
      finalWickAttempt;
      momentumActivePercentage;
      highMomentumPercentage;
      weakMomentumPercenage;
      reversalPercentage;
      endingMomentumPercentage;
      trendStartPercentage;
      trapResistanceReversalPercentage;
      firstContinuation;
      secondContinuation;
    };

    analyses.add(id, analysis);
  };

  public query ({ caller }) func getTradeAnalysis(id : Text) : async TradeAnalysis {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trade analyses");
    };

    switch (analyses.get(id)) {
      case (?analysis) {
        if (analysis.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own trade analyses");
        };
        analysis;
      };
      case (null) { Runtime.trap("Analysis with id " # id # " not found") };
    };
  };

  public query ({ caller }) func getTradeAnalyses() : async [TradeAnalysis] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trade analyses");
    };

    let isAdminUser = AccessControl.isAdmin(accessControlState, caller);
    let userAnalyses = analyses.values().filter(
      func(analysis) {
        isAdminUser or analysis.owner == caller;
      }
    );
    userAnalyses.toArray().sort();
  };

  public query ({ caller }) func getTradeAnalysesSortedByTime() : async [TradeAnalysis] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trade analyses");
    };

    let isAdminUser = AccessControl.isAdmin(accessControlState, caller);
    let userAnalyses = analyses.values().filter(
      func(analysis) {
        isAdminUser or analysis.owner == caller;
      }
    );
    userAnalyses.toArray().sort(TradeAnalysis.compareByCreatedTime);
  };

  public query ({ caller }) func getTradeAnalysesByOutcome(outcomeFilter : ?Outcome) : async [TradeAnalysis] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trade analyses");
    };

    let isAdminUser = AccessControl.isAdmin(accessControlState, caller);
    let allAnalyses = analyses.values();

    let userAnalyses = allAnalyses.filter(
      func(analysis) {
        isAdminUser or analysis.owner == caller;
      }
    );

    switch (outcomeFilter) {
      case (?outcome) {
        let filteredAnalyses = userAnalyses.filter(
          func(analysis) {
            switch (analysis.outcome) {
              case (?analysisOutcome) { analysisOutcome == outcome };
              case (null) { false };
            };
          }
        );
        filteredAnalyses.toArray();
      };
      case (null) { userAnalyses.toArray() };
    };
  };

  public query ({ caller }) func getNumAnalyses() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trade analyses");
    };

    let isAdminUser = AccessControl.isAdmin(accessControlState, caller);
    if (isAdminUser) {
      return analyses.size();
    };

    analyses.values().filter(
      func(analysis) {
        analysis.owner == caller;
      }
    ).size();
  };

  public query ({ caller }) func hasAnalysisWithOutcome(outcome : Outcome) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trade analyses");
    };

    let isAdminUser = AccessControl.isAdmin(accessControlState, caller);
    analyses.values().any(
      func(analysis) {
        let ownerMatch = isAdminUser or analysis.owner == caller;
        let outcomeMatch = switch (analysis.outcome) {
          case (?analysisOutcome) { analysisOutcome == outcome };
          case (null) { false };
        };
        ownerMatch and outcomeMatch;
      }
    );
  };

  public query ({ caller }) func analysisIdExists(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trade analyses");
    };

    switch (analyses.get(id)) {
      case (?analysis) {
        let isAdminUser = AccessControl.isAdmin(accessControlState, caller);
        isAdminUser or analysis.owner == caller;
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func anyAnalysisAssetIsEurUsdOtc() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trade analyses");
    };

    let isAdminUser = AccessControl.isAdmin(accessControlState, caller);
    analyses.values().any(
      func(analysis) {
        let ownerMatch = isAdminUser or analysis.owner == caller;
        ownerMatch and analysis.asset == #eurUsdOtc;
      }
    );
  };

  public query ({ caller }) func anyTradeAnalysisCreatedBefore(time : Time.Time) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trade analyses");
    };

    let isAdminUser = AccessControl.isAdmin(accessControlState, caller);
    analyses.values().any(
      func(analysis) {
        let ownerMatch = isAdminUser or analysis.owner == caller;
        ownerMatch and analysis.createdTimestamp < time;
      }
    );
  };

  public query ({ caller }) func hasTradeAnalysisWithConfidence(confidence : Float) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trade analyses");
    };

    let isAdminUser = AccessControl.isAdmin(accessControlState, caller);
    analyses.values().any(
      func(analysis) {
        let ownerMatch = isAdminUser or analysis.owner == caller;
        ownerMatch and analysis.confidence == confidence;
      }
    );
  };

  public shared ({ caller }) func deleteTradeAnalysis(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete trade analyses");
    };

    if (not analyses.containsKey(id)) {
      Runtime.trap("Analysis id does not exist");
    };
    analyses.remove(id);
  };
};
