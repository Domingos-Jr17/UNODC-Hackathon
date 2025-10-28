// Versão simplificada dos hooks de API para evitar complexidade desnecessária

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Hook para autenticação simplificado
export function useSimpleAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (code: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Simular validação do código (em produção, usar API real)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const validCodes = ['V0042', 'V0038', 'V0031'];

      if (!code.startsWith('V') || !validCodes.includes(code)) {
        toast.error('Código inválido. Tente novamente.');
        return false;
      }

      const userData = {
        id: `user_${Date.now()}`,
        code: code,
        ngoId: code === 'V0042' || code === 'V0038' ? 'ONG-001' : 'ONG-002',
        isAuthenticated: true
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('wira_user', JSON.stringify(userData));
      toast.success(`Bem-vindo(a)! Código ${code} autenticado com sucesso.`);
      return true;

    } catch (error) {
      toast.error('Erro ao autenticar. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('wira_user');
    toast.info('Sessão encerrada com sucesso.');
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };
}

// Hook para ativação de usuário simplificado
export function useSimpleUserActivation() {
  const [loading, setLoading] = useState(false);

  const activateUser = useCallback(async (userData: any) => {
    setLoading(true);
    try {
      // Simular ativação
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Usuário ativado com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao ativar usuário. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateCode = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newCode = 'V' + Math.floor(Math.random() * 9000 + 1000);
      toast.success(`Código gerado: ${newCode}`);
      return newCode;
    } catch (error) {
      toast.error('Erro ao gerar código. Tente novamente.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendSMS = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('SMS enviado com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao enviar SMS. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    activateUser,
    generateCode,
    sendSMS
  };
}