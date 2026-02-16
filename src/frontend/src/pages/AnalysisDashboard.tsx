import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ProfileSetupModal from '../components/auth/ProfileSetupModal';
import AssetPicker from '../components/asset/AssetPicker';
import ScreenshotUploadCard from '../components/upload/ScreenshotUploadCard';
import ReviewConfirmPanel from '../components/review/ReviewConfirmPanel';
import SignalResultCard from '../components/signal/SignalResultCard';
import ConfluenceDashboard from '../components/confluence/ConfluenceDashboard';
import RiskPanel from '../components/risk/RiskPanel';
import PerformanceStatsPanel from '../components/stats/PerformanceStatsPanel';
import AnalysisHistoryPanel from '../components/history/AnalysisHistoryPanel';
import OutcomeControls from '../components/history/OutcomeControls';
import CandleTimer from '../components/timer/CandleTimer';
import { Asset, Outcome } from '../backend';
import { AnalysisSession, ExtractedFeatures } from '../types/analysis';
import { useHistoryStore } from '../state/historyStore';
import { useSettingsStore } from '../state/settingsStore';
import { extractFromScreenshot } from '../lib/vision/extractFromScreenshot';
import { generateSignal } from '../lib/engine/combinedSignalEngine';
import { computeConfluence } from '../lib/confluence/confluenceEngine';
import { calculateRisk } from '../lib/risk/riskCalculator';
import { computePerformanceStats } from '../lib/stats/performanceStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type AnalysisStep = 'upload' | 'extracting' | 'review' | 'result';

export default function AnalysisDashboard() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [currentStep, setCurrentStep] = useState<AnalysisStep>('upload');
  const [selectedAsset, setSelectedAsset] = useState<Asset>(Asset.eurUsdOtc);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [extractedFeatures, setExtractedFeatures] = useState<ExtractedFeatures | null>(null);
  const [currentSession, setCurrentSession] = useState<AnalysisSession | null>(null);
  const [selectedHistorySession, setSelectedHistorySession] = useState<AnalysisSession | null>(null);

  const { sessions, addSession, updateSession } = useHistoryStore();
  const { accountBalance, dailyStopLoss } = useSettingsStore();

  const riskCalc = calculateRisk(accountBalance, dailyStopLoss, sessions);
  const stats = computePerformanceStats(sessions);

  const handleImageSelected = async (dataUrl: string) => {
    setCurrentImageUrl(dataUrl);
    setCurrentStep('extracting');

    try {
      const features = await extractFromScreenshot(dataUrl);
      setExtractedFeatures(features);
      setCurrentStep('review');
    } catch (error) {
      console.error('Extraction failed:', error);
      setCurrentStep('upload');
    }
  };

  const handleConfirmFeatures = (confirmedFeatures: ExtractedFeatures) => {
    const signalResult = generateSignal(confirmedFeatures);
    const confluence = computeConfluence(confirmedFeatures);

    const session: AnalysisSession = {
      id: `session-${Date.now()}`,
      timestamp: Date.now(),
      asset: selectedAsset,
      imageDataUrl: currentImageUrl || undefined,
      extractedFeatures: extractedFeatures || undefined,
      confirmedFeatures,
      signalResult,
      confluence,
      taken: false
    };

    setCurrentSession(session);
    addSession(session);
    setCurrentStep('result');
  };

  const handleCancelReview = () => {
    setCurrentStep('upload');
    setExtractedFeatures(null);
    setCurrentImageUrl(null);
  };

  const handleNewAnalysis = () => {
    setCurrentStep('upload');
    setCurrentSession(null);
    setExtractedFeatures(null);
    setCurrentImageUrl(null);
  };

  const handleUpdateOutcome = (sessionId: string, outcome: Outcome) => {
    updateSession(sessionId, { outcome });
    if (currentSession?.id === sessionId) {
      setCurrentSession({ ...currentSession, outcome });
    }
    if (selectedHistorySession?.id === sessionId) {
      setSelectedHistorySession({ ...selectedHistorySession, outcome });
    }
  };

  const handleUpdateTaken = (sessionId: string, taken: boolean) => {
    updateSession(sessionId, { taken, outcome: taken ? Outcome.unknown_ : Outcome.notTaken });
    if (currentSession?.id === sessionId) {
      setCurrentSession({ ...currentSession, taken, outcome: taken ? Outcome.unknown_ : Outcome.notTaken });
    }
    if (selectedHistorySession?.id === sessionId) {
      setSelectedHistorySession({ ...selectedHistorySession, taken, outcome: taken ? Outcome.unknown_ : Outcome.notTaken });
    }
  };

  return (
    <>
      <ProfileSetupModal />

      <div className="space-y-6">
        {!isAuthenticated && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Sign in to save your analysis history and track performance across sessions.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CandleTimer />

            <Card>
              <CardHeader>
                <CardTitle>New Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AssetPicker value={selectedAsset} onChange={setSelectedAsset} />

                {currentStep === 'upload' && (
                  <ScreenshotUploadCard onImageSelected={handleImageSelected} />
                )}

                {currentStep === 'extracting' && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">Extracting features from screenshot...</p>
                    </div>
                  </div>
                )}

                {currentStep === 'review' && extractedFeatures && (
                  <ReviewConfirmPanel
                    extractedFeatures={extractedFeatures}
                    onConfirm={handleConfirmFeatures}
                    onCancel={handleCancelReview}
                  />
                )}

                {currentStep === 'result' && currentSession?.signalResult && (
                  <div className="space-y-4">
                    <SignalResultCard result={currentSession.signalResult} />
                    
                    {currentSession.confluence && (
                      <ConfluenceDashboard confluence={currentSession.confluence} />
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle>Mark Trade Outcome</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <OutcomeControls
                          outcome={currentSession.outcome}
                          taken={currentSession.taken}
                          onOutcomeChange={(outcome) => handleUpdateOutcome(currentSession.id, outcome)}
                          onTakenChange={(taken) => handleUpdateTaken(currentSession.id, taken)}
                          disabled={riskCalc.stopLossHit && !currentSession.taken}
                        />
                      </CardContent>
                    </Card>

                    <button
                      onClick={handleNewAnalysis}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      New Analysis
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <RiskPanel riskCalc={riskCalc} />
            <PerformanceStatsPanel stats={stats} />
            <AnalysisHistoryPanel
              sessions={sessions}
              onSelectSession={setSelectedHistorySession}
            />
          </div>
        </div>
      </div>

      <Dialog open={!!selectedHistorySession} onOpenChange={() => setSelectedHistorySession(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Analysis Details</DialogTitle>
          </DialogHeader>
          {selectedHistorySession && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {new Date(selectedHistorySession.timestamp).toLocaleString()}
              </div>

              {selectedHistorySession.imageDataUrl && (
                <img
                  src={selectedHistorySession.imageDataUrl}
                  alt="Analysis screenshot"
                  className="w-full rounded-lg border border-border"
                />
              )}

              {selectedHistorySession.signalResult && (
                <SignalResultCard result={selectedHistorySession.signalResult} />
              )}

              {selectedHistorySession.confluence && (
                <ConfluenceDashboard confluence={selectedHistorySession.confluence} />
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Update Outcome</CardTitle>
                </CardHeader>
                <CardContent>
                  <OutcomeControls
                    outcome={selectedHistorySession.outcome}
                    taken={selectedHistorySession.taken}
                    onOutcomeChange={(outcome) => handleUpdateOutcome(selectedHistorySession.id, outcome)}
                    onTakenChange={(taken) => handleUpdateTaken(selectedHistorySession.id, taken)}
                    disabled={riskCalc.stopLossHit && !selectedHistorySession.taken}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
