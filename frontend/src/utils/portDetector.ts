/**
 * Porta Backend Detector - Sistema Inteligente de Detecção Automática
 *
 * Este utilitário detecta automaticamente em qual porta o backend WIRA está rodando
 * e implementa cache para evitar múltiplas verificações desnecessárias.
 */

// Cache da porta detectada para performance
let cachedPort: number | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 60000; // 1 minuto de cache

/**
 * Detecta em qual porta o backend está rodando
 * @returns Promise<number> Porta detectada
 */
export async function detectBackendPort(): Promise<number> {
  const now = Date.now();

  // Retornar porta em cache se ainda válida
  if (cachedPort && now < cacheExpiry) {
    console.log(`🔍 Usando porta backend em cache: ${cachedPort}`);
    return cachedPort;
  }

  // Lista de portas para testar em ordem de preferência
  const possiblePorts = [3000, 3001, 3002, 3003, 3004, 3005];

  console.log('🔍 Detectando porta do backend WIRA...');

  for (const port of possiblePorts) {
    try {
      const response = await fetch(`http://localhost:${port}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(2000), // Timeout de 2 segundos
      });

      if (response.ok) {
        console.log(`✅ Backend detectado na porta ${port}`);
        cachedPort = port;
        cacheExpiry = now + CACHE_DURATION;
        return port;
      }
    } catch (error) {
      // Porta não disponível, tentar próxima
      console.log(`❌ Porta ${port} não disponível, tentando próxima...`);
    }
  }

  throw new Error('Não foi possível detectar o backend WIRA em nenhuma porta (3000-3005)');
}

/**
 * Força a nova detecção de porta (limpa cache)
 * @returns Promise<number> Porta detectada
 */
export async function forceRedetectBackendPort(): Promise<number> {
  console.log('🔄 Forçando nova detecção de porta do backend...');
  cachedPort = null;
  cacheExpiry = 0;
  return detectBackendPort();
}

/**
 * Verifica se uma porta específica está respondendo
 * @param port Porta para verificar
 * @returns Promise<boolean> True se a porta estiver respondendo
 */
export async function isBackendPortAvailable(port: number): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:${port}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(2000)
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Obtém a URL base da API com porta dinâmica
 * @returns Promise<string> URL base da API detectada
 */
export async function getApiBaseUrl(): Promise<string> {
  try {
    const port = await detectBackendPort();
    return `http://localhost:${port}`;
  } catch (error) {
    console.error('❌ Erro ao detectar porta do backend:', error);
    // Fallback para porta 3000 se detecção falhar
    return 'http://localhost:3000';
  }
}

/**
 * Verifica a saúde da conexão com o backend
 * @returns Promise<{port: number, healthy: boolean, url: string}> Status da conexão
 */
export async function checkConnectionHealth(): Promise<{port: number; healthy: boolean; url: string}> {
  try {
    const port = await detectBackendPort();
    const response = await fetch(`http://localhost:${port}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(2000)
    });

    if (response.ok) {
      const health = await response.json();
      return {
        port,
        healthy: health.status === 'OK',
        url: `http://localhost:${port}`
      };
    }
  } catch (error) {
    return {
      port: 3000,
      healthy: false,
      url: 'http://localhost:3000'
    };
  }

  // Return fallback for all code paths
  return {
    port: 3000,
    healthy: false,
    url: 'http://localhost:3000'
  };
}

/**
 * Inicia o monitoramento periódico da conexão
 * @param callback Função de callback chamada quando o status mudar
 * @param intervalMs Intervalo em milissegundos (padrão: 30000 = 30 segundos)
 * @returns Function para parar o monitoramento
 */
export function startConnectionMonitoring(
  callback: (status: {port: number; healthy: boolean; url: string}) => void,
  intervalMs: number = 30000
): () => void {
  let isMonitoring = true;

  const checkConnection = async () => {
    if (!isMonitoring) return;

    try {
      const status = await checkConnectionHealth();
      callback(status);
    } catch (error) {
      console.error('❌ Erro no monitoramento de conexão:', error);
      callback({
        port: 3000,
        healthy: false,
        url: 'http://localhost:3000'
      });
    }
  };

  // Primeira verificação imediata
  checkConnection();

  // Configurar verificação periódica
  const intervalId = setInterval(checkConnection, intervalMs);

  // Retornar função para parar monitoramento
  return () => {
    isMonitoring = false;
    clearInterval(intervalId);
  };
}

// Exportar porta atual detectada para uso externo
export { cachedPort as currentBackendPort };