import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  code: string;
  ngoId: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário salvo no localStorage
    const savedUser = localStorage.getItem('wira_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('wira_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (code: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simular validação do código (em produção, seria uma chamada API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Códigos válidos para demonstração
      const validCodes = ['V0042', 'V0038', 'V0031'];

      if (!code.startsWith('V') || !validCodes.includes(code)) {
        toast.error('Código inválido. Tente novamente.');
        setIsLoading(false);
        return false;
      }

      const userData: User = {
        id: `user_${Date.now()}`,
        code: code,
        ngoId: code === 'V0042' || code === 'V0038' ? 'ONG-001' : 'ONG-002',
        isAuthenticated: true
      };

      setUser(userData);
      localStorage.setItem('wira_user', JSON.stringify(userData));
      toast.success(`Bem-vindo(a)! Código ${code} autenticado com sucesso.`);
      setIsLoading(false);
      return true;

    } catch (error) {
      toast.error('Erro ao autenticar. Tente novamente.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wira_user');
    toast.info('Sessão encerrada com sucesso.');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user?.isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};