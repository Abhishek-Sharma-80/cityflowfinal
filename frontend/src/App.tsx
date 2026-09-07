import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DemoModal } from './components/common/DemoModal';
import { ToastContainer } from './components/common/Toast';
import { SystemOfflineOverlay } from './components/common/SystemOfflineOverlay';
import { MentorDemoBar } from './components/common/MentorDemoBar';
import { MentorDemoProvider } from './context/MentorDemoContext';
import { useToast } from './hooks/useToast';
import { useLiveData } from './hooks/useLiveData';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { FleetDeliveriesPage } from './pages/FleetDeliveriesPage';
import { RouteOptimizationPage } from './pages/RouteOptimizationPage';
import { DeliverySlotsPage } from './pages/DeliverySlotsPage';
import { LoadingZonesPage } from './pages/LoadingZonesPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { MLIntelligencePage } from './pages/MLIntelligencePage';
import { DataQualityPage } from './pages/DataQualityPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { EmergencyModePage } from './pages/EmergencyModePage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [isOfflineOverlayDismissed, setIsOfflineOverlayDismissed] = useState(false);
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const liveData = useLiveData(15000);

  useEffect(() => {
    if (!liveData.isConnected) {
      addToast('warning', 'Backend Offline', 'Live city state stream paused.');
    } else {
      setIsOfflineOverlayDismissed(false);
    }
  }, [liveData.isConnected]);

  useEffect(() => {
    if (!liveData.snapshot) return;
    const criticalZones = liveData.snapshot.zones.filter(z => z.pressure_score > 88);
    if (criticalZones.length > 0 && liveData.snapshot.tick_count > 0 && liveData.snapshot.tick_count % 4 === 0) {
      const z = criticalZones[0];
      addToast('critical', `Sector ${z.id} Critical Surge`, `Pressure score reached ${z.pressure_score}% — dynamic route diversion active.`);
    }
  }, [liveData.snapshot?.tick_count]);

  const handleRetryConnection = async () => {
    await liveData.refetch();
    if (liveData.isConnected) {
      addToast('success', 'Handshake Successful', 'Reconnected to the Digital-Twin Engine.');
    } else {
      // Allow user to dismiss overlay if they want to inspect the UI
      setIsOfflineOverlayDismissed(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-800 flex flex-col font-sans overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Top Header */}
      <Header
        onOpenDemo={() => setIsDemoOpen(true)}
        isEmergencyActive={isEmergencyActive}
        onOpenEmergency={() => navigate('/emergency')}
        isConnected={liveData.isConnected}
        secondsSince={liveData.secondsSince}
      />

      {/* Persistent Global Mentor Demo Action Bar (Below Top Header) */}
      <MentorDemoBar />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isEmergencyActive={isEmergencyActive} />
        <main className="flex-1 overflow-y-auto bg-white p-6 lg:p-8 pb-12">
          <Routes>
            <Route path="/" element={<DashboardPage liveSnapshot={liveData.snapshot} addToast={addToast} />} />
            <Route path="/map" element={<LiveMapPage liveSnapshot={liveData.snapshot} />} />
            <Route path="/fleet" element={<FleetDeliveriesPage />} />
            <Route path="/routes" element={<RouteOptimizationPage />} />
            <Route path="/slots" element={<DeliverySlotsPage />} />
            <Route path="/loading-zones" element={<LoadingZonesPage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
            <Route path="/ml-models" element={<MLIntelligencePage />} />
            <Route path="/data-quality" element={<DataQualityPage />} />
            <Route path="/simulator" element={<WhatIfSimulatorPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route
              path="/emergency"
              element={
                <EmergencyModePage
                  isEmergencyActive={isEmergencyActive}
                  setIsEmergencyActive={setIsEmergencyActive}
                  addToast={addToast}
                />
              }
            />
            <Route path="/settings" element={<SettingsPage addToast={addToast} />} />
          </Routes>
        </main>
      </div>

      {/* Global System Offline Overlay */}
      <SystemOfflineOverlay
        isVisible={!liveData.isConnected && !isOfflineOverlayDismissed}
        onRetry={handleRetryConnection}
      />

      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onDemoCompleted={() => addToast('success', 'Demo Complete', 'Evening peak surge optimized — 18.1% travel time reduction achieved.')}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export const App: React.FC = () => (
  <MentorDemoProvider>
    <Router>
      <AppContent />
    </Router>
  </MentorDemoProvider>
);

export default App;
