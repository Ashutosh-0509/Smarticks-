import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ReportPage } from './pages/ReportPage';
import { TrackPage } from './pages/TrackPage';
import { DashboardPage } from './pages/DashboardPage';
import { CitizenDashboardPage } from './pages/CitizenDashboardPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { SiteFeedbackPage } from './pages/SiteFeedbackPage';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, openAuthModal } = useAuth();
  
  React.useEffect(() => {
    if (!user) {
      openAuthModal();
    }
  }, [user, openAuthModal]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
            <Route path="track/:id" element={<ProtectedRoute><TrackPage /></ProtectedRoute>} />
            <Route path="track" element={<Navigate to="/track/CR-1048" replace />} />
            <Route path="citizen-portal" element={<ProtectedRoute><CitizenDashboardPage /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="accessibility" element={<AccessibilityPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="site-feedback" element={<SiteFeedbackPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
