import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";

import Dashboard from './components/Dashboard.tsx';
import ActivateUser from './components/ActivateUser.tsx';
import MonitorProgress from './components/MonitorProgress.tsx';
import StaffLoginPage from './components/StaffLoginPage.tsx';
import UsersPage from './components/UsersPage.tsx';
import ReportsPage from './components/ReportsPage.tsx';
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
            <Route path="/users" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <UsersPage />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/users/:id" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Detalhes do Usuário</h1>
                    <p className="text-muted-foreground">Em desenvolvimento...</p>
                  </div>
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Gestão de Cursos</h1>
                    <p className="text-muted-foreground">Em desenvolvimento...</p>
                  </div>
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/courses/:id" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Detalhes do Curso</h1>
                    <p className="text-muted-foreground">Em desenvolvimento...</p>
                  </div>
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <ReportsPage />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Configurações</h1>
                    <p className="text-muted-foreground">Em desenvolvimento...</p>
                  </div>
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/settings/profile" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Perfil do Staff</h1>
                    <p className="text-muted-foreground">Em desenvolvimento...</p>
                  </div>
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
