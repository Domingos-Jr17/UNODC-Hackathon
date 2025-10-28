import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from './ui/spinner';
import { TypographyH2 } from './ui/typography';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <TypographyH2>Verificando autenticação...</TypographyH2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirecionar para login mas salvar a localização atual para retornar após login
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
};