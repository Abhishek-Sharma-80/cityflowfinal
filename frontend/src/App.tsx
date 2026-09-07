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

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { TrafficIntelligencePage } from './pages/TrafficIntelligencePage';
import { RoadRiskPage } from './pages/RoadRiskPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { LogisticsPage } from './pages/LogisticsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { MLIntelligencePage } from './pages/MLIntelligencePage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { EmergencyModePage } from './pages/EmergencyModePage';
import { SettingsPage } from './pages/SettingsPage';

// Sub-modules preserved for direct links
import { FleetDeliveriesPage } from './pages/FleetDeliveriesPage';
import { RouteOptimizationPage } from './pages/RouteOptimizationPage';
import { DeliverySlotsPage } from './pages/DeliverySlotsPage';
import { LoadingZonesPage } from './pages/LoadingZonesPage';

const AppContent: React.FC = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [isOfflineOverlayDismissed, setIsOfflineOverlayDismissed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleRetryConnection = async () => {
    await liveData.refetch();
    if (liveData.isConnected) {
      addToast('success', 'Handshake Successful', 'Reconnected to the Digital-Twin Engine.');
    } else {
      setIsOfflineOverlayDismissed(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-x-hidden selection:bg-slate-900 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenDemo={() => setIsDemoOpen(true)}
        isEmergencyActive={isEmergencyActive}
        onOpenEmergency={() => navigate('/emergency')}
        isConnected={liveData.isConnected}
        secondsSince={liveData.secondsSince}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Persistent Global Mentor Demo Bar */}
      <MentorDemoBar />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isEmergencyActive={isEmergencyActive}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 pb-16">
          <Routes>
            {/* Primary 10 SIH Routes */}
            <Route path="/" element={<DashboardPage liveSnapshot={liveData.snapshot} addToast={addToast} />} />
            <Route path="/traffic" element={<TrafficIntelligencePage />} />
            <Route path="/predictions" element={<TrafficIntelligencePage />} />
            <Route path="/risk" element={<RoadRiskPage />} />
            <Route path="/map" element={<LiveMapPage liveSnapshot={liveData.snapshot} />} />
            <Route path="/logistics" element={<LogisticsPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/data-sources" element={<DataQualityPage />} />
            <Route path="/data-quality" element={<DataQualityPage />} />
            <Route path="/model-center" element={<MLIntelligencePage />} />
            <Route path="/ml-models" element={<MLIntelligencePage />} />
            <Route path="/settings" element={<SettingsPage addToast={addToast} />} />

            {/* Sub-modules & Operations */}
            <Route path="/fleet" element={<FleetDeliveriesPage />} />
            <Route path="/routes" element={<RouteOptimizationPage />} />
            <Route path="/slots" element={<DeliverySlotsPage />} />
            <Route path="/loading-zones" element={<LoadingZonesPage />} />
            <Route path="/simulator" element={<WhatIfSimulatorPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
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
          </Routes>
        </main>
      </div>

      {/* Global System Offline Overlay */}
      <SystemOfflineOverlay
        isVisible={!liveData.isConnected && !isOfflineOverlayDismissed}
        onRetry={handleRetryConnection}
      />

      {/* 1-Click Interactive Demo Modal */}
      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onDemoCompleted={() =>
          addToast('success', 'Demo Complete', 'Evening peak surge optimized — travel time reduction achieved.')
        }
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
