import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
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

import { NewsPage } from './pages/NewsPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
              <Route path="track/:id" element={<TrackPage />} />
              <Route path="track" element={<Navigate to="/track/CR-1048" replace />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="citizen-portal" element={<ProtectedRoute><CitizenDashboardPage /></ProtectedRoute>} />
              <Route path="dashboard" element={<ProtectedRoute roleRequired="staff"><DashboardPage /></ProtectedRoute>} />
              <Route path="accessibility" element={<AccessibilityPage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="site-feedback" element={<SiteFeedbackPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
