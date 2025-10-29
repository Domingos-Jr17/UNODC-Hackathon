// Serviço de API para integração com backend

// Importar sistema de detecção de portas dinâmicas
import { getApiBaseUrl } from '../utils/portDetector';

// URL base dinâmica com fallback estático
const STATIC_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = STATIC_API_URL, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Try to use dynamic port detection for better connection reliability
    let baseUrl = this.baseURL;

    // If using static URL and it fails, try dynamic detection
    if (baseUrl === STATIC_API_URL) {
      try {
        baseUrl = await getApiBaseUrl();
        console.log(`🔗 Usando URL dinâmica detectada: ${baseUrl}`);
      } catch (error) {
        console.warn(`⚠️ Falha ao detectar porta dinâmica, usando URL estática: ${baseUrl}`, error);
      }
    }

    const url = `${baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        message: 'Success'
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408, 'TIMEOUT');
        }
        throw new ApiError(error.message, 500, 'NETWORK_ERROR');
      }
      throw new ApiError('Unknown error', 500, 'UNKNOWN');
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Métodos específicos da aplicação
  async authenticateUser(code: string) {
    return this.post('/api/auth/login', { code });
  }

  // Staff authentication for NGO dashboard
  async authenticateStaff(email: string, password: string) {
    return this.post('/api/auth/staff/login', { email, password });
  }

  async getDashboardStats() {
    return this.get('/api/dashboard/stats');
  }

  async getRecentActivity() {
    return this.get('/api/dashboard/activity');
  }

  async getUsers(filters?: { status?: string; limit?: number; offset?: number }) {
    return this.get('/api/users', filters);
  }

  async getUserDetails(userId: string) {
    return this.get(`/api/users/${userId}`);
  }

  async activateUser(userData: {
    realName: string;
    ngoId: string;
    dateOfBirth: string;
    initialSkills?: string;
  }) {
    return this.post('/api/users/activate', userData);
  }

  async generateUserCode() {
    return this.post('/api/users/generate-code');
  }

  async sendSMSCode(code: string, phoneNumber?: string) {
    return this.post('/api/sms/send', { code, phoneNumber });
  }

  async getCourses() {
    return this.get('/api/courses');
  }

  async getCourseProgress(userId: string) {
    return this.get(`/api/users/${userId}/progress`);
  }

  async updateProgress(userId: string, courseId: string, moduleId: string, completed: boolean) {
    return this.post(`/api/users/${userId}/progress`, {
      courseId,
      moduleId,
      completed
    });
  }

  async getCertificates(userId: string) {
    return this.get(`/api/users/${userId}/certificates`);
  }

  async generateCertificate(userId: string, courseId: string) {
    return this.post(`/api/certificates/generate`, { userId, courseId });
  }

  // Health check
  async healthCheck() {
    // For health check, always try dynamic port detection first
    try {
      const baseUrl = await getApiBaseUrl();
      const url = `${baseUrl}/health`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          data,
          status: response.status,
          message: 'Success'
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('❌ Falha no health check com porta dinâmica, tentando método padrão:', error);
      // Fallback to standard method
      return this.get('/health');
    }
  }

  // Testar conexão com API
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.healthCheck();
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Instância singleton do serviço
export const apiService = new ApiService();

// Hook para usar o serviço de API
export const useApi = () => {
  return apiService;
};

// Tipos para a aplicação
export interface User {
  id: string;
  anonymousCode: string;
  code?: string; // For backward compatibility
  realName?: string;
  email?: string;
  ngoId: string;
  role?: 'VICTIM' | 'STAFF' | 'ADMIN';
  status: 'Ativo' | 'Inativo';
  lastActivity: string;
  coursesCompleted: number;
  certificatesEarned: number;
  dateOfBirth?: string;
  initialSkills?: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  coursesCompleted: number;
  certificatesIssued: number;
  averageCompletionTime: number;
}

export interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: number;
  modules: CourseModule[];
  activeUsers: number;
  completionRate: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  order: number;
  duration: number;
}

export interface Progress {
  userId: string;
  courseId: string;
  completedModules: string[];
  completionPercentage: number;
  lastAccessDate: string;
  certificateIssued: boolean;
}

export { ApiError };