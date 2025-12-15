import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiError, User, DashboardStats, Activity, Course } from '../services/api';
import { toast } from 'sonner';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook genérico para requisições API
export function useApi<T>(apiCall: () => Promise<T>, dependencies: any[] = []) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {}
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({
        data: result,
        loading: false,
        error: null,
        refetch: fetchData
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        refetch: fetchData
      });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
}

// Hook para autenticação
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('wira_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('wira_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (code: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.authenticateUser(code);

      if (response.data) {
        // Transform backend response to frontend User format
        const backendUser = response.data as any;
        const userData: User = {
          id: backendUser.user?.anonymousCode || code,
          anonymousCode: backendUser.user?.anonymousCode || code,
          code: backendUser.user?.anonymousCode || code, // backward compatibility
          realName: backendUser.user?.realName,
          email: backendUser.user?.email,
          ngoId: backendUser.user?.ngoId,
          role: backendUser.user?.role,
          status: 'Ativo', // Default status
          lastActivity: new Date().toISOString(),
          coursesCompleted: 0,
          certificatesEarned: 0,
          createdAt: backendUser.user?.createdAt
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('wira_user', JSON.stringify(userData));
        localStorage.setItem('wira_token', backendUser.token);
        toast.success(`Bem-vindo(a)! Código ${code} autenticado com sucesso.`);
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao autenticar. Tente novamente.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Staff login for NGO dashboard
  const staffLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.authenticateStaff(email, password);

      if (response.data) {
        // Transform backend response to frontend User format
        const backendUser = response.data as any;
        const userData: User = {
          id: backendUser.user?.anonymousCode || email,
          anonymousCode: backendUser.user?.anonymousCode || '',
          code: backendUser.user?.anonymousCode || '', // backward compatibility
          realName: backendUser.user?.realName,
          email: backendUser.user?.email,
          ngoId: backendUser.user?.ngoId,
          role: backendUser.user?.role,
          status: 'Ativo', // Default status
          lastActivity: new Date().toISOString(),
          coursesCompleted: 0,
          certificatesEarned: 0,
          createdAt: backendUser.user?.createdAt
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('wira_user', JSON.stringify(userData));
        localStorage.setItem('wira_token', backendUser.token);
        toast.success(`Bem-vindo(a) ${backendUser.user?.realName || email}!`);
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao autenticar. Tente novamente.');
      }
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
    staffLogin,
    logout
  };
}

// Hook para estatísticas do dashboard
export function useDashboardStats() {
  return useApi<DashboardStats>(
    () => apiService.getDashboardStats().then(res => res.data as DashboardStats),
    []
  );
}

// Hook para atividade recente
export function useRecentActivity() {
  return useApi<Activity[]>(
    () => apiService.getRecentActivity().then(res => res.data as Activity[]),
    []
  );
}

// Hook para lista de usuários
export function useUsers(filters?: { status?: string }) {
  return useApi<User[]>(
    () => apiService.getUsers(filters).then(res => res.data as User[]),
    [filters?.status]
  );
}

// Hook para detalhes do usuário
export function useUserDetails(userId: string) {
  return useApi<User>(
    () => apiService.getUserDetails(userId).then(res => res.data as User),
    [userId]
  );
}

// Hook para cursos
export function useCourses() {
  return useApi<Course[]>(
    () => apiService.getCourses().then(res => res.data as Course[]),
    []
  );
}

// Hook para ativação de usuário
export function useUserActivation() {
  const [loading, setLoading] = useState(false);

  const activateUser = useCallback(async (userData: {
    realName: string;
    ngoId: string;
    dateOfBirth: string;
    initialSkills?: string;
  }) => {
    setLoading(true);
    try {
      const response = await apiService.activateUser(userData);
      toast.success('Usuário ativado com sucesso!');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao ativar usuário. Tente novamente.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateCode = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.generateUserCode();
      toast.success('Código gerado com sucesso!');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao gerar código. Tente novamente.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendSMS = useCallback(async (code: string, phoneNumber?: string) => {
    setLoading(true);
    try {
      const response = await apiService.sendSMSCode(code, phoneNumber);
      toast.success('SMS enviado com sucesso!');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao enviar SMS. Tente novamente.');
      }
      throw error;
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

// Hook para health check da API
export function useApiHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      const healthy = await apiService.testConnection();
      setIsHealthy(healthy);
      setLastCheck(new Date());
      return healthy;
    } catch {
      setIsHealthy(false);
      setLastCheck(new Date());
      return false;
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Verificar a cada 30 segundos
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { isHealthy, lastCheck, checkHealth };
}