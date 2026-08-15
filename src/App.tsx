import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Lazy load pages for better performance
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import SOSCenterPage from './pages/SOSCenterPage';
import LiveEmergencyPage from './pages/LiveEmergencyPage';
import RelayNetworkPage from './pages/RelayNetworkPage';
import DeviceNetworkPage from './pages/DeviceNetworkPage';
import HistoryPage from './pages/HistoryPage';
import EmergencyDetailPage from './pages/EmergencyDetailPage';
import TimelinePage from './pages/TimelinePage';
import ContextCardPage from './pages/ContextCardPage';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import DemoPage from './pages/DemoPage';
import AboutPage from './pages/AboutPage';
import { AppLayout } from './components/layout/AppLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-shield-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading Save Shield...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes inside App Layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/sos" element={<SOSCenterPage />} />
        <Route path="/emergency/live" element={<LiveEmergencyPage />} />
        <Route path="/relay-network" element={<RelayNetworkPage />} />
        <Route path="/devices" element={<DeviceNetworkPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/emergency/:id" element={<EmergencyDetailPage />} />
        <Route path="/emergency/:id/timeline" element={<TimelinePage />} />
        <Route path="/emergency/:id/context" element={<ContextCardPage />} />
        <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
