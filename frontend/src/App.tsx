import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DemoModal } from './components/common/DemoModal';
import { ToastContainer } from './components/common/Toast';
import { SystemOfflineOverlay } from './components/common/SystemOfflineOverlay';
import { MentorDemoBar } from './components/common/MentorDemoBar';
import { MentorDemoProvider } from './context/MentorDemoContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthPage } from './pages/AuthPage';
import { useToast } from './hooks/useToast';
import { useLiveData } from './hooks/useLiveData';

// Pages
import { HomePage } from './pages/HomePage';
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
  const [isOfflineOverlayDismissed, setIsOfflineOverlayDismissed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const liveData = useLiveData(15000);
  const { user, profile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Keep overlay dismissed by default for standalone demo mode
  }, [liveData.isConnected]);

  const handleRetryConnection = async () => {
    await liveData.refetch();
    if (liveData.isConnected) {
      addToast('success', 'Handshake Successful', 'Reconnected to the Digital-Twin Engine.');
    }
  };

  const isAuthRoute =
    location.pathname === '/login' ||
    location.pathname === '/auth' ||
    location.pathname === '/signin' ||
    location.pathname === '/signup';

  if (isAuthRoute) {
    if (user || profile) {
      return <Navigate to="/dashboard" replace />;
    }
    return <AuthPage />;
  }

  // Restore previous CityFlow Landing Page at / and /home
  const isLandingPage = location.pathname === '/' || location.pathname === '/home';

  if (isLandingPage) {
    return (
      <div className="relative min-h-screen bg-[#fbfaf7] text-slate-900 selection:bg-slate-900 selection:text-white">
        <HomePage onOpenDemo={() => setIsDemoOpen(true)} />
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
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden selection:bg-slate-900 selection:text-white">
      {/* Full-height Left Sidebar matching reference design */}
      <Sidebar
        isEmergencyActive={isEmergencyActive}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area: Top Header + Scrollable Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          onOpenDemo={() => setIsDemoOpen(true)}
          isEmergencyActive={isEmergencyActive}
          onOpenEmergency={() => navigate('/emergency')}
          isConnected={liveData.isConnected}
          secondsSince={liveData.secondsSince}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-6 lg:p-7 pb-16">
          <Routes>
            {/* Primary Command Center Routes */}
            <Route path="/dashboard" element={<DashboardPage liveSnapshot={liveData.snapshot} addToast={addToast} />} />
            <Route path="/overview" element={<DashboardPage liveSnapshot={liveData.snapshot} addToast={addToast} />} />
            <Route path="/app" element={<DashboardPage liveSnapshot={liveData.snapshot} addToast={addToast} />} />
            
            <Route path="/traffic" element={<TrafficIntelligencePage />} />
            <Route path="/app/traffic" element={<TrafficIntelligencePage />} />
            <Route path="/predictions" element={<TrafficIntelligencePage />} />
            <Route path="/app/predictions" element={<TrafficIntelligencePage />} />
            <Route path="/risk" element={<RoadRiskPage />} />
            <Route path="/app/risk" element={<RoadRiskPage />} />
            <Route path="/map" element={<LiveMapPage liveSnapshot={liveData.snapshot} />} />
            <Route path="/app/map" element={<LiveMapPage liveSnapshot={liveData.snapshot} />} />
            <Route path="/logistics" element={<LogisticsPage />} />
            <Route path="/app/logistics" element={<LogisticsPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/app/incidents" element={<IncidentsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/app/analytics" element={<AnalyticsPage />} />
            <Route path="/data-sources" element={<DataQualityPage />} />
            <Route path="/app/data-sources" element={<DataQualityPage />} />
            <Route path="/data-quality" element={<DataQualityPage />} />
            <Route path="/app/data-quality" element={<DataQualityPage />} />
            <Route path="/model-center" element={<MLIntelligencePage />} />
            <Route path="/app/model-center" element={<MLIntelligencePage />} />
            <Route path="/ml-models" element={<MLIntelligencePage />} />
            <Route path="/app/ml-models" element={<MLIntelligencePage />} />
            <Route path="/settings" element={<SettingsPage addToast={addToast} />} />
            <Route path="/app/settings" element={<SettingsPage addToast={addToast} />} />

            {/* Sub-modules & Operations */}
            <Route path="/fleet" element={<FleetDeliveriesPage />} />
            <Route path="/app/fleet" element={<FleetDeliveriesPage />} />
            <Route path="/routes" element={<RouteOptimizationPage />} />
            <Route path="/app/routes" element={<RouteOptimizationPage />} />
            <Route path="/slots" element={<DeliverySlotsPage />} />
            <Route path="/app/slots" element={<DeliverySlotsPage />} />
            <Route path="/loading-zones" element={<LoadingZonesPage />} />
            <Route path="/app/loading-zones" element={<LoadingZonesPage />} />
            <Route path="/simulator" element={<WhatIfSimulatorPage />} />
            <Route path="/app/simulator" element={<WhatIfSimulatorPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/app/recommendations" element={<RecommendationsPage />} />
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
            <Route
              path="/app/emergency"
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
    </ProtectedRoute>
  );
};

export const App: React.FC = () => (
  <AuthProvider>
    <MentorDemoProvider>
      <Router>
        <AppContent />
      </Router>
    </MentorDemoProvider>
  </AuthProvider>
);

export default App;
