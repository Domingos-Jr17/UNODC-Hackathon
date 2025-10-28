import { useApiHealth } from '../hooks/useApi';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

export const ApiStatusIndicator: React.FC = () => {
  const { isHealthy, lastCheck } = useApiHealth();

  if (isHealthy === null) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <AlertTriangle className="w-3 h-3" />
        <span>Verificando API...</span>
      </div>
    );
  }

  if (isHealthy) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-600">
        <Wifi className="w-3 h-3" />
        <span>API Online</span>
        {lastCheck && (
          <span className="text-muted-foreground">
            ({lastCheck.toLocaleTimeString()})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-red-600">
      <WifiOff className="w-3 h-3" />
      <span>API Offline</span>
      {lastCheck && (
        <span className="text-muted-foreground">
          ({lastCheck.toLocaleTimeString()})
        </span>
      )}
    </div>
  );
};