import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import StatusBadge from '@/components/ui/StatusBadge';
import Layout from './layout/Layout';
import { ArrowLeft, User, Calendar, MapPin, Phone, Mail, GraduationCap, Award, Clock, BarChart3 } from 'lucide-react';

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  completed: boolean;
  lastActivity: string;
  certificateIssued: boolean;
}

interface User {
  id: number;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  ngo: string;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
  lastActivity: string;
  coursesCompleted: number;
  certificatesEarned: number;
  totalProgress: number;
  location?: string;
  age?: number;
  courses: CourseProgress[];
}

const mockUser: User = {
  id: 1,
  code: 'V0042',
  name: 'Maria Silva',
  email: 'maria.silva@anon.wira',
  phone: '+258 84 123 4567',
  ngo: 'ONG-001 - Centro de Acolhimento Maputo',
  status: 'active',
  registrationDate: '2024-01-15',
  lastActivity: '2024-10-28 14:30',
  coursesCompleted: 1,
  certificatesEarned: 1,
  totalProgress: 75,
  location: 'Maputo, Moçambique',
  age: 28,
  courses: [
    {
      id: 'costura-avancada',
      title: 'Costura Avançada',
      progress: 100,
      completed: true,
      lastActivity: '2024-10-20',
      certificateIssued: true
    },
    {
      id: 'culinaria-profissional',
      title: 'Culinária Profissional',
      progress: 35,
      completed: false,
      lastActivity: '2024-10-25',
      certificateIssued: false
    },
    {
      id: 'gestao-negocio',
      title: 'Gestão de Pequenos Negócios',
      progress: 10,
      completed: false,
      lastActivity: '2024-10-28',
      certificateIssued: false
    }
  ]
};

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      // Simular carregamento de dados da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(mockUser);
      setLoading(false);
    };

    loadUser();
  }, [id]);

  const handleBack = () => {
    navigate('/users');
  };

  const handleSendMessage = () => {
    // Simular envio de mensagem
    alert(`Mensagem enviada para ${user?.name} (${user?.code})`);
  };

  const handleGenerateReport = () => {
    // Simular geração de relatório
    alert(`Relatório gerado para ${user?.name}`);
  };

  if (loading) {
    return (
      <Layout title="Detalhes do Usuário" subtitle="Informações completas do usuário">
        <LoadingOverlay show={loading} message="Carregando detalhes do usuário..." />
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Detalhes do Usuário" subtitle="Informações completas do usuário">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-destructive">Usuário não encontrado</h2>
            <p className="text-muted-foreground mt-2">O usuário solicitado não existe ou não está disponível</p>
            <Button className="mt-4" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Usuários
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Detalhes do Usuário" subtitle="Informações completas do usuário">
      <div className="space-y-6">
        {/* Header com ações */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Usuários
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSendMessage}>
              Mensagem
            </Button>
            <Button onClick={handleGenerateReport}>
              Gerar Relatório
            </Button>
          </div>
        </div>

        {/* Informações principais do usuário */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Resumo do usuário */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <p className="text-muted-foreground">Código: {user.code}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{user.coursesCompleted}</p>
                    <p className="text-sm text-muted-foreground">Cursos Completos</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{user.certificatesEarned}</p>
                    <p className="text-sm text-muted-foreground">Certificados</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{user.totalProgress}%</p>
                    <p className="text-sm text-muted-foreground">Progresso Total</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{user.courses.length}</p>
                    <p className="text-sm text-muted-foreground">Cursos Ativos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de contato */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span>{user.email || 'Não informado'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Telefone:</span>
                  <span>{user.phone || 'Não informado'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Localização:</span>
                  <span>{user.location || 'Não informada'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Idade:</span>
                  <span>{user.age ? `${user.age} anos` : 'Não informada'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Progresso nos cursos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progresso nos Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.courses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{course.title}</h4>
                        <div className="flex items-center gap-2">
                          {course.completed && (
                            <Badge className="bg-green-100 text-green-800">Concluído</Badge>
                          )}
                          {course.certificateIssued && (
                            <Badge className="bg-blue-100 text-blue-800">Certificado</Badge>
                          )}
                          {!course.completed && (
                            <Badge className="bg-orange-100 text-orange-800">Em Progresso</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              course.progress === 100 ? 'bg-green-500' : 
                              course.progress > 50 ? 'bg-blue-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Última atividade: {course.lastActivity}</span>
                        <span>{course.progress} de 100%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações adicionais */}
          <div className="space-y-6">
            {/* Status e informações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={user.status} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ONG</span>
                  <span className="text-right">{user.ngo}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Código</span>
                  <span className="font-mono">{user.code}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Registrado em</span>
                  <span>{new Date(user.registrationDate).toLocaleDateString('pt-MZ')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Última atividade</span>
                  <span>{new Date(user.lastActivity).toLocaleDateString('pt-MZ')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas adicionais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Horas Estudadas
                    </span>
                    <span className="font-medium">127h</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      Tempo Médio por Módulo
                    </span>
                    <span className="font-medium">45 min</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      Cursos Iniciados
                    </span>
                    <span className="font-medium">{user.courses.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Certificados
                    </span>
                    <span className="font-medium">{user.certificatesEarned}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Enviar Mensagem
                  </Button>
                  <Button className="w-full" variant="outline">
                    Atualizar Progresso
                  </Button>
                  <Button className="w-full">
                    Gerar Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}