import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { EmptyCourses } from '@/components/ui/EmptyState';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import Layout from './layout/Layout';
import {
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  Award,
  Plus,
  Edit,
  Eye,
  Play,
  Target,
  BarChart3
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: number; // em horas
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'inactive' | 'draft';
  modules: number;
  enrolledUsers: number;
  completionRate: number;
  averageRating: number;
  skills: string[];
  createdAt: string;
  lastUpdated: string;
}

const mockCourses: Course[] = [
  {
    id: 'costura-avancada',
    title: 'Costura Avançada',
    description: 'Curso completo de costura profissional com técnicas avançadas de confecção e acabamento.',
    duration: 40,
    level: 'intermediate',
    status: 'active',
    modules: 8,
    enrolledUsers: 25,
    completionRate: 75,
    averageRating: 4.5,
    skills: ['Confecção', 'Acabamento', 'Medidas', 'Design de Roupas'],
    createdAt: '2024-01-15',
    lastUpdated: '2024-10-28'
  },
  {
    id: 'culinaria-profissional',
    title: 'Culinária Profissional',
    description: 'Aprenda técnicas culinárias profissionais com foco na gastronomia moçambicana.',
    duration: 35,
    level: 'beginner',
    status: 'active',
    modules: 7,
    enrolledUsers: 18,
    completionRate: 60,
    averageRating: 4.8,
    skills: ['Técnicas de Cozinha', 'Segurança Alimentar', 'Gastronomia MZ', 'Planejamento de Menu'],
    createdAt: '2024-02-01',
    lastUpdated: '2024-10-25'
  },
  {
    id: 'agricultura-sustentavel',
    title: 'Agricultura Sustentável',
    description: 'Práticas agrícolas sustentáveis com foco em segurança alimentar e comercialização.',
    duration: 30,
    level: 'intermediate',
    status: 'active',
    modules: 6,
    enrolledUsers: 12,
    completionRate: 45,
    averageRating: 4.2,
    skills: ['Plantio', 'Irrigação', 'Comercialização', 'Sustentabilidade'],
    createdAt: '2024-03-10',
    lastUpdated: '2024-10-20'
  },
  {
    id: 'gestao-negocio',
    title: 'Gestão de Pequenos Negócios',
    description: 'Fundamentos de administração e gestão para empreendedores iniciantes.',
    duration: 25,
    level: 'beginner',
    status: 'draft',
    modules: 5,
    enrolledUsers: 0,
    completionRate: 0,
    averageRating: 0,
    skills: ['Planejamento', 'Finanças', 'Marketing', 'Vendas'],
    createdAt: '2024-10-15',
    lastUpdated: '2024-10-28'
  },
  {
    id: 'tecnicas-artesanato',
    title: 'Técnicas de Artesanato',
    description: 'Desenvolva habilidades em artesanato tradicional moçambicano com foco comercial.',
    duration: 28,
    level: 'advanced',
    status: 'inactive',
    modules: 6,
    enrolledUsers: 8,
    completionRate: 38,
    averageRating: 4.0,
    skills: ['Tecnicas Tradicionais', 'Materiais Locais', 'Design', 'Comercialização'],
    createdAt: '2024-04-05',
    lastUpdated: '2024-09-15'
  }
];

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCourses(mockCourses);
      setLoading(false);
    };

    loadCourses();
  }, []);

  const metrics = useMemo(() => {
    const activeCourses = courses.filter(c => c.status === 'active').length;
    const totalEnrolled = courses.reduce((acc, c) => acc + c.enrolledUsers, 0);
    const avgCompletion = courses.length > 0
      ? Math.round(courses.reduce((acc, c) => acc + c.completionRate, 0) / courses.length)
      : 0;
    const totalModules = courses.reduce((acc, c) => acc + c.modules, 0);

    return {
      totalCourses: courses.length,
      activeCourses,
      totalEnrolled,
      avgCompletion,
      totalModules,
      draftCourses: courses.filter(c => c.status === 'draft').length
    };
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const levelMatch = selectedLevel === 'all' || course.level === selectedLevel;
      const statusMatch = selectedStatus === 'all' || course.status === selectedStatus;
      return levelMatch && statusMatch;
    });
  }, [courses, selectedLevel, selectedStatus]);

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-purple-100 text-purple-800'
    };
    const labels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    };
    return (
      <Badge className={colors[level as keyof typeof colors]}>
        {labels[level as keyof typeof labels]}
      </Badge>
    );
  };

  const handleCreateCourse = () => {
    navigate('/courses/create');
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/courses/${courseId}/edit`);
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <Layout title="Gestão de Cursos" subtitle="Gerencie todos os cursos profissionais">
        <LoadingOverlay show={loading} message="Carregando cursos..." />
      </Layout>
    );
  }

  return (
    <Layout title="Gestão de Cursos" subtitle="Gerencie todos os cursos profissionais">
      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard
          title="Total de Cursos"
          value={metrics.totalCourses}
          icon={BookOpen}
          description="Cursos disponíveis"
        />
        <MetricCard
          title="Cursos Ativos"
          value={metrics.activeCourses}
          icon={Play}
          description="Em andamento"
        />
        <MetricCard
          title="Total de Inscritos"
          value={metrics.totalEnrolled}
          icon={Users}
          trend={{
            value: 15,
            type: 'increase',
            period: 'este mês'
          }}
        />
        <MetricCard
          title="Taxa de Conclusão"
          value={`${metrics.avgCompletion}%`}
          icon={Target}
          description="Média geral"
        />
        <MetricCard
          title="Total de Módulos"
          value={metrics.totalModules}
          icon={BarChart3}
          description="Disponíveis"
        />
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Todos os Cursos</CardTitle>
          <Button onClick={handleCreateCourse}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Curso
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium">Nível:</span>
                <Button
                  variant={selectedLevel === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLevel('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={selectedLevel === 'beginner' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLevel('beginner')}
                >
                  Iniciante
                </Button>
                <Button
                  variant={selectedLevel === 'intermediate' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLevel('intermediate')}
                >
                  Intermediário
                </Button>
                <Button
                  variant={selectedLevel === 'advanced' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLevel('advanced')}
                >
                  Avançado
                </Button>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium">Status:</span>
                <Button
                  variant={selectedStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={selectedStatus === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('active')}
                >
                  Ativos
                </Button>
                <Button
                  variant={selectedStatus === 'draft' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('draft')}
                >
                  Rascunho
                </Button>
                <Button
                  variant={selectedStatus === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('inactive')}
                >
                  Inativos
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyCourses
          onAdd={handleCreateCourse}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      {getLevelBadge(course.level)}
                      <StatusBadge status={course.status as any} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.averageRating.toFixed(1)}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration}h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{course.modules} módulos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course.enrolledUsers} inscritos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>{course.completionRate}% conclusão</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Taxa de Conclusão</span>
                    <span className="text-sm font-bold">{course.completionRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        course.completionRate > 70 ? 'bg-green-500' :
                        course.completionRate > 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Habilidades:</span>
                  <div className="flex flex-wrap gap-1">
                    {course.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {course.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewCourse(course.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditCourse(course.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>

                {/* Footer Info */}
                <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
                  <span>Criado: {new Date(course.createdAt).toLocaleDateString('pt-MZ')}</span>
                  <span>Atualizado: {new Date(course.lastUpdated).toLocaleDateString('pt-MZ')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Cursos em Desenvolvimento</h3>
                <p className="text-2xl font-bold text-blue-600">{metrics.draftCourses}</p>
                <p className="text-sm text-muted-foreground">Aguardando publicação</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Engajamento Total</h3>
                <p className="text-2xl font-bold text-green-600">{metrics.totalEnrolled}</p>
                <p className="text-sm text-muted-foreground">Usuários inscritos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Taxa de Sucesso</h3>
                <p className="text-2xl font-bold text-purple-600">{metrics.avgCompletion}%</p>
                <p className="text-sm text-muted-foreground">Conclusão média</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

// Star component for rating
const Star = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);