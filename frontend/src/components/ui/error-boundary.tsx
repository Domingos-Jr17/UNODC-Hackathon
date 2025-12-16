import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TypographyP } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface SimpleErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface SimpleErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class SimpleErrorBoundary extends Component<SimpleErrorBoundaryProps, SimpleErrorBoundaryState> {
  constructor(props: SimpleErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SimpleErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Simple Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <Card className="w-full border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-center justify-center p-4">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
              <TypographyP className="text-sm text-muted-foreground mb-3">
                Erro ao carregar componente
              </TypographyP>
              <Button
                size="sm"
                variant="outline"
                onClick={this.handleReset}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}