import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MetricCard from '@/components/ui/MetricCard';
import EmptyState from '@/components/ui/EmptyState';
import { EmptyReports } from '@/components/ui/EmptyState';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import Layout from './layout/Layout';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  GraduationCap,
  Award,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw
} from 'lucide-react';

interface ReportMetric {
  title: string;
  value: string | number;
  description?: string;
  icon: any;
  trend?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
}

interface AvailableReport {
  id: string;
  title: string;
  description: string;
  type: 'progress' | 'users' | 'courses' | 'certificates' | 'ngos';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  lastGenerated?: string;
  scheduled?: boolean;
  format: 'pdf' | 'excel' | 'csv';
}

const mockMetrics: ReportMetric[] = [
  {
    title: 'Relatórios Gerados',
    value: 47,
    description: 'Este mês',
    icon: FileText,
    trend: {
      value: 12,
      type: 'increase',
      period: 'vs mês passado'
    }
  },
  {
    title: 'Usuários Ativos',
    value: 38,
    description: 'Em acompanhamento',
    icon: Users,
    trend: {
      value: 8,
      type: 'increase',
      period: 'esta semana'
    }
  },
  {
    title: 'Taxa de Conclusão',
    value: '68%',
    description: 'Média geral',
    icon: GraduationCap,
    trend: {
      value: 5,
      type: 'increase',
      period: 'vs trimestre anterior'
    }
  },
  {
    title: 'Certificados Emitidos',
    value: 12,
    description: 'Este mês',
    icon: Award,
    trend: {
      value: 15,
      type: 'increase',
      period: 'vs mês passado'
    }
  }
];

const availableReports: AvailableReport[] = [
  {
    id: 'monthly-progress',
    title: 'Relatório de Progresso Mensal',
    description: 'Análise detalhada do progresso dos usuários em todos os cursos',
    type: 'progress',
    frequency: 'monthly',
    lastGenerated: '2024-10-28',
    scheduled: true,
    format: 'pdf'
  },
  {
    id: 'user-engagement',
    title: 'Relatório de Engajamento de Usuários',
    description: 'Métricas de atividade, retenção e engajamento dos usuários',
    type: 'users',
    frequency: 'weekly',
    lastGenerated: '2024-10-27',
    scheduled: true,
    format: 'excel'
  },
  {
    id: 'course-performance',
    title: 'Desempenho de Cursos',
    description: 'Análise de conclusão, popularidade e eficácia dos cursos',
    type: 'courses',
    frequency: 'monthly',
    lastGenerated: '2024-10-25',
    scheduled: false,
    format: 'pdf'
  },
  {
    id: 'certificates-summary',
    title: 'Resumo de Certificados',
    description: 'Estatísticas de certificados emitidos e validações',
    type: 'certificates',
    frequency: 'monthly',
    lastGenerated: '2024-10-28',
    scheduled: true,
    format: 'csv'
  },
  {
    id: 'ngo-performance',
    title: 'Desempenho das ONGs',
    description: 'Análise do desempenho por organização parceira',
    type: 'ngos',
    frequency: 'quarterly',
    lastGenerated: '2024-10-20',
    scheduled: false,
    format: 'pdf'
  },
  {
    id: 'annual-summary',
    title: 'Relatório Anual Completo',
    description: 'Visão completa anual do impacto e resultados da plataforma',
    type: 'progress',
    frequency: 'yearly',
    lastGenerated: '2024-01-15',
    scheduled: false,
    format: 'pdf'
  }
];

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    };

    loadReports();
  }, []);

  const handleGenerateReport = async (reportId: string) => {
    setGeneratingReport(reportId);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGeneratingReport(null);
    // TODO: Handle successful report generation
    console.log(`Report ${reportId} generated successfully`);
  };

  const handleDownloadReport = (reportId: string) => {
    // TODO: Implement download functionality
    console.log(`Downloading report ${reportId}`);
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'progress':
        return <TrendingUp className="h-5 w-5" />;
      case 'users':
        return <Users className="h-5 w-5" />;
      case 'courses':
        return <GraduationCap className="h-5 w-5" />;
      case 'certificates':
        return <Award className="h-5 w-5" />;
      case 'ngos':
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      daily: 'bg-blue-100 text-blue-800',
      weekly: 'bg-green-100 text-green-800',
      monthly: 'bg-purple-100 text-purple-800',
      quarterly: 'bg-orange-100 text-orange-800',
      yearly: 'bg-red-100 text-red-800',
      custom: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      yearly: 'Anual',
      custom: 'Personalizado'
    };

    return (
      <Badge className={colors[frequency as keyof typeof colors] || colors.custom}>
        {labels[frequency as keyof typeof labels] || frequency}
      </Badge>
    );
  };

  const getFormatBadge = (format: string) => {
    const colors = {
      pdf: 'bg-red-100 text-red-800',
      excel: 'bg-green-100 text-green-800',
      csv: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={colors[format as keyof typeof colors] || colors.pdf}>
        {format.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Layout title="Relatórios" subtitle="Análise e insights da plataforma WIRA">
        <LoadingOverlay show={loading} message="Carregando relatórios..." />
      </Layout>
    );
  }

  return (
    <Layout title="Relatórios" subtitle="Análise e insights da plataforma WIRA">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mockMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            trend={metric.trend}
          />
        ))}
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Relatórios Disponíveis</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {availableReports.length === 0 ? (
            <EmptyReports
              onGenerate={() => console.log('Generate first report')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableReports.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedReport === report.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getReportIcon(report.type)}
                        <CardTitle className="text-base font-medium leading-tight">
                          {report.title}
                        </CardTitle>
                      </div>
                      {report.scheduled && (
                        <Badge variant="secondary" className="text-xs">
                          Agendado
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {report.description}
                    </p>

                    <div className="flex items-center gap-2">
                      {getFrequencyBadge(report.frequency)}
                      {getFormatBadge(report.format)}
                    </div>

                    {report.lastGenerated && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Gerado em {new Date(report.lastGenerated).toLocaleDateString('pt-MZ')}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={generatingReport === report.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateReport(report.id);
                        }}
                      >
                        {generatingReport === report.id ? (
                          <>
                            <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-3 w-3" />
                            Gerar
                          </>
                        )}
                      </Button>

                      {report.lastGenerated && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadReport(report.id);
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Análise Personalizada</h3>
                <p className="text-sm text-muted-foreground">
                  Crie relatórios customizados com filtros específicos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Agendar Relatórios</h3>
                <p className="text-sm text-muted-foreground">
                  Configure geração automática periódica
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Dashboard ao Vivo</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize métricas em tempo real
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}