import express, { Request, Response, NextFunction } from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Types for our application
interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalCertificates: number;
  activeProgress: number;
  users: Array<{
    code: string;
    courses: string[];
    progress: Record<string, any>;
    hasCertificate: boolean;
  }>;
}

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// CORS middleware para permitir requisições do backend
const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(corsMiddleware);

// Servir arquivos estáticos
app.use(express.static('public'));

// API proxy para o backend
app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
  try {
    const backendUrl = 'http://localhost:3000/api/dashboard/stats';
    const response = await fetch(backendUrl);
    const data: APIResponse<DashboardStats> = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    } as APIResponse);
  }
});

// Rota principal
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Criar HTML simples para o dashboard
app.get('/dashboard', (req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-MZ">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WIRA Dashboard ONG</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <header class="mb-8">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-blue-900">WIRA Platform</h1>
                    <p class="text-gray-600">Dashboard de Monitoramento de Sobreviventes</p>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-500">ONG: Centro de Acolhimento Maputo</span>
                    <button onclick="refreshData()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        <i class="fas fa-sync-alt"></i> Atualizar
                    </button>
                </div>
            </div>
        </header>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-blue-100 rounded-full">
                        <i class="fas fa-users text-blue-500"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">Sobreviventes Ativos</p>
                        <p class="text-2xl font-bold" id="totalUsers">3</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-green-100 rounded-full">
                        <i class="fas fa-book text-green-500"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">Cursos Disponíveis</p>
                        <p class="text-2xl font-bold" id="totalCourses">3</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-purple-100 rounded-full">
                        <i class="fas fa-certificate text-purple-500"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">Certificados Emitidos</p>
                        <p class="text-2xl font-bold" id="totalCertificates">1</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-orange-100 rounded-full">
                        <i class="fas fa-chart-line text-orange-500"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">Em Progresso</p>
                        <p class="text-2xl font-bold" id="activeProgress">3</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Progress Table -->
        <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-bold text-gray-800">Progresso Individual</h2>
                <p class="text-gray-600 text-sm">Acompanhamento detalhado do progresso das sobreviventes</p>
            </div>
            <div class="p-6">
                <div class="overflow-x-auto">
                    <table class="min-w-full table-auto">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cursos</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificado</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody id="progressTable" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        V0042
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Costura Avançada</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                            <div class="bg-blue-500 h-2 rounded-full" style="width: 37.5%"></div>
                                        </div>
                                        <span class="text-sm text-gray-600">37%</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        Em Andamento
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        V0038
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Culinária Profissional</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                            <div class="bg-blue-500 h-2 rounded-full" style="width: 14%"></div>
                                        </div>
                                        <span class="text-sm text-gray-600">14%</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        Em Andamento
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        V0031
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Costura Avançada</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                            <div class="bg-green-500 h-2 rounded-full" style="width: 100%"></div>
                                        </div>
                                        <span class="text-sm text-gray-600">100%</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <i class="fas fa-certificate text-green-500"></i> WIRA-V0031-COSTURA-2025
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Concluído
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- USSD Status -->
        <div class="mt-8 bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-bold text-gray-800">Status do Sistema USSD</h2>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-green-500">Online</div>
                        <div class="text-gray-600">Status do Serviço</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-blue-500">*123#</div>
                        <div class="text-gray-600">Código USSD</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-purple-500">5 min</div>
                        <div class="text-gray-600">Timeout de Sessão</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Fetch dashboard data from backend
        async function fetchDashboardData() {
            try {
                const response = await fetch('/api/dashboard/stats');
                const data = await response.json();

                if (data.success) {
                    document.getElementById('totalUsers').textContent = data.data.totalUsers;
                    document.getElementById('totalCourses').textContent = data.data.totalCourses;
                    document.getElementById('totalCertificates').textContent = data.data.totalCertificates;
                    document.getElementById('activeProgress').textContent = data.data.activeProgress;

                    console.log('Dashboard data loaded:', data.data);
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        }

        // Refresh data
        function refreshData() {
            fetchDashboardData();
        }

        // Load data on page load
        document.addEventListener('DOMContentLoaded', fetchDashboardData);

        // Auto-refresh every 30 seconds
        setInterval(fetchDashboardData, 30000);
    </script>
</body>
</html>`);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 WIRA Dashboard Server started on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🔗 Backend proxy: http://localhost:${PORT}/api/dashboard/stats`);
});

export default app;