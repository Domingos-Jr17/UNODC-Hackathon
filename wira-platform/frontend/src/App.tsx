import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";

import Dashboard from './components/Dashboard.tsx';
import ActivateUser from './components/ActivateUser.tsx';
import MonitorProgress from './components/MonitorProgress.tsx';
import StaffLoginPage from './components/StaffLoginPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ApiStatusIndicator } from './components/ApiStatusIndicator';


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Toaster position="top-right" />
            <div className="fixed top-4 right-4 z-50">
              <ApiStatusIndicator />
            </div>
            <Routes>
            <Route path="/" element={<StaffLoginPage />} />
            <Route path="/staff-login" element={<StaffLoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/active" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <ActivateUser />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/monitor" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <MonitorProgress />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
                  </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
