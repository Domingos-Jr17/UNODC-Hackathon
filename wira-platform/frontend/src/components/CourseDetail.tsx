import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import StatusBadge from '@/components/ui/StatusBadge';
import Layout from './layout/Layout';
import { ArrowLeft, BookOpen, Users, Target, Award, Play, Edit, Download } from 'lucide-react';

interface CourseModule {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

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
  instructor: string;
  certificate: boolean;
  createdAt: string;
  lastUpdated: string;
  modulesList: CourseModule[];
}

// Dados mock para diferentes cursos
const mockCourses: Record<string, Course> = {
  'costura-avancada': {
    id: 'costura-avancada',
    title: 'Costura Avançada',
    description: 'Curso completo de costura profissional com técnicas avançadas de confecção e acabamento. Este curso aborda desde os fundamentos da costura até técnicas profissionais avançadas, preparando as participantes para oportunidades de emprego ou empreendedorismo na área.',
    duration: 40,
    level: 'intermediate',
    status: 'active',
    modules: 8,
    enrolledUsers: 25,
    completionRate: 75,
    averageRating: 4.5,
    skills: ['Confecção', 'Acabamento', 'Medidas', 'Design de Roupas', 'Técnicas Profissionais'],
    instructor: 'Professora Ana Machel',
    certificate: true,
    createdAt: '2024-01-15',
    lastUpdated: '2024-10-28',
    modulesList: [
      { id: 1, title: 'Fundamentos da Costura', duration: '4h', completed: true, locked: false },
      { id: 2, title: 'Máquinas e Equipamentos', duration: '5h', completed: true, locked: false },
      { id: 3, title: 'Técnicas de Costura Avançada', duration: '6h', completed: true, locked: false },
      { id: 4, title: 'Montagem de Camisas', duration: '7h', completed: true, locked: false },
      { id: 5, title: 'Acabamento Profissional', duration: '6h', completed: false, locked: false },
      { id: 6, title: 'Padrões e Modelagem', duration: '6h', completed: false, locked: false },
      { id: 7, title: 'Criação de Peças', duration: '4h', completed: false, locked: true },
      { id: 8, title: 'Projeto Final', duration: '2h', completed: false, locked: true }
    ]
  },
  'culinaria-profissional': {
    id: 'culinaria-profissional',
    title: 'Culinária Profissional',
    description: 'Aprenda técnicas culinárias profissionais com foco na gastronomia moçambicana. Este curso aborda técnicas de cozinha, segurança alimentar e planejamento de menu, preparando as participantes para oportunidades na indústria alimentar.',
    duration: 35,
    level: 'beginner',
    status: 'active',
    modules: 7,
    enrolledUsers: 18,
    completionRate: 60,
    averageRating: 4.8,
    skills: ['Técnicas de Cozinha', 'Segurança Alimentar', 'Gastronomia MZ', 'Planejamento de Menu'],
    instructor: 'Chef João Sitoe',
    certificate: true,
    createdAt: '2024-02-01',
    lastUpdated: '2024-10-25',
    modulesList: [
      { id: 1, title: 'Introdução à Culinária', duration: '4h', completed: true, locked: false },
      { id: 2, title: 'Técnicas de Cozimento', duration: '5h', completed: true, locked: false },
      { id: 3, title: 'Cozinha Moçambicana', duration: '6h', completed: true, locked: false },
      { id: 4, title: 'Segurança Alimentar', duration: '5h', completed: false, locked: false },
      { id: 5, title: 'Planejamento de Menu', duration: '6h', completed: false, locked: true },
      { id: 6, title: 'Empreendedorismo na Gastronomia', duration: '5h', completed: false, locked: true },
      { id: 7, title: 'Projeto Final', duration: '4h', completed: false, locked: true }
    ]
  },
  'agricultura-sustentavel': {
    id: 'agricultura-sustentavel',
    title: 'Agricultura Sustentável',
    description: 'Práticas agrícolas sustentáveis com foco em segurança alimentar e comercialização. Este curso ensina técnicas modernas de agricultura que promovem sustentabilidade ecológica e econômica.',
    duration: 30,
    level: 'intermediate',
    status: 'active',
    modules: 6,
    enrolledUsers: 12,
    completionRate: 45,
    averageRating: 4.2,
    skills: ['Plantio', 'Irrigação', 'Comercialização', 'Sustentabilidade'],
    instructor: 'Eng. Maria Cossa',
    certificate: true,
    createdAt: '2024-03-10',
    lastUpdated: '2024-10-20',
    modulesList: [
      { id: 1, title: 'Fundamentos de Agricultura', duration: '4h', completed: true, locked: false },
      { id: 2, title: 'Técnicas de Plantio', duration: '6h', completed: true, locked: false },
      { id: 3, title: 'Sistemas de Irrigação', duration: '5h', completed: false, locked: false },
      { id: 4, title: 'Comercialização de Produtos', duration: '6h', completed: false, locked: true },
      { id: 5, title: 'Agricultura Sustentável', duration: '5h', completed: false, locked: true },
      { id: 6, title: 'Projeto Final', duration: '4h', completed: false, locked: true }
    ]
  },
  'gestao-negocio': {
    id: 'gestao-negocio',
    title: 'Gestão de Pequenos Negócios',
    description: 'Fundamentos de administração e gestão para empreendedores iniciantes. Este curso aborda planejamento financeiro, marketing e vendas para pequenos negócios.',
    duration: 25,
    level: 'beginner',
    status: 'draft',
    modules: 5,
    enrolledUsers: 0,
    completionRate: 0,
    averageRating: 0,
    skills: ['Planejamento', 'Finanças', 'Marketing', 'Vendas'],
    instructor: 'Prof. Carlos Guebuza',
    certificate: true,
    createdAt: '2024-10-15',
    lastUpdated: '2024-10-28',
    modulesList: [
      { id: 1, title: 'Introdução à Gestão', duration: '4h', completed: false, locked: false },
      { id: 2, title: 'Planejamento Financeiro', duration: '5h', completed: false, locked: true },
      { id: 3, title: 'Marketing Digital', duration: '6h', completed: false, locked: true },
      { id: 4, title: 'Vendas e Atendimento', duration: '5h', completed: false, locked: true },
      { id: 5, title: 'Projeto Final', duration: '5h', completed: false, locked: true }
    ]
  },
  'tecnicas-artesanato': {
    id: 'tecnicas-artesanato',
    title: 'Técnicas de Artesanato',
    description: 'Desenvolva habilidades em artesanato tradicional moçambicano com foco comercial. Aprenda a criar produtos comercializáveis usando materiais locais e técnicas tradicionais.',
    duration: 28,
    level: 'advanced',
    status: 'inactive',
    modules: 6,
    enrolledUsers: 8,
    completionRate: 38,
    averageRating: 4.0,
    skills: ['Tecnicas Tradicionais', 'Materiais Locais', 'Design', 'Comercialização'],
    instructor: 'Art. Esperança Manyanga',
    certificate: true,
    createdAt: '2024-04-05',
    lastUpdated: '2024-09-15',
    modulesList: [
      { id: 1, title: 'Introdução ao Artesanato', duration: '4h', completed: true, locked: false },
      { id: 2, title: 'Materiais Tradicionais', duration: '5h', completed: true, locked: false },
      { id: 3, title: 'Técnicas de Confecção', duration: '6h', completed: true, locked: false },
      { id: 4, title: 'Design e Criatividade', duration: '6h', completed: false, locked: false },
      { id: 5, title: 'Comercialização', duration: '4h', completed: false, locked: true },
      { id: 6, title: 'Projeto Final', duration: '3h', completed: false, locked: true }
    ]
  }
};

const getCourseById = (id: string): Course | undefined => {
  return mockCourses[id];
};

const getLevelLabel = (level: string) => {
  const labels: Record<string, string> = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado'
  };
  return labels[level] || level;
};

const getLevelBadgeColor = (level: string) => {
  const colors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-purple-100 text-purple-800'
  };
  return colors[level] || 'bg-gray-100 text-gray-800';
};

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      // Simular carregamento de dados da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const courseData = getCourseById(id || '');
      setCourse(courseData || null);
      setLoading(false);
    };

    loadCourse();
  }, [id]);

  const handleEdit = () => {
    navigate(`/courses/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/courses');
  };

  if (loading) {
    return (
      <Layout title="Detalhes do Curso" subtitle="Informações completas do curso">
        <LoadingOverlay show={loading} message="Carregando detalhes do curso..." />
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout title="Detalhes do Curso" subtitle="Informações completas do curso">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-destructive">Curso não encontrado</h2>
            <p className="text-muted-foreground mt-2">O curso solicitado não existe ou não está disponível</p>
            <Button className="mt-4" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Cursos
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Detalhes do Curso" subtitle="Informações completas do curso">
      <div className="space-y-6">
        {/* Header com ações */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Cursos
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Curso
          </Button>
        </div>

        {/* Informações principais do curso */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getLevelBadgeColor(course.level)}>
                    {getLevelLabel(course.level)}
                  </Badge>
                  <StatusBadge status={course.status} />
                </div>
              </div>
              {course.certificate && (
                <Badge className="bg-blue-100 text-blue-800">
                  <Award className="mr-1 h-3 w-3" />
                  Certificado
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duração Total</p>
                    <p className="font-medium">{course.duration} horas</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inscritos</p>
                    <p className="font-medium">{course.enrolledUsers} usuários</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                    <p className="font-medium">{course.completionRate}%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Play className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Instrutor(a)</p>
                    <p className="font-medium">{course.instructor}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habilidades e informações adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Habilidades Ensino</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Módulos</span>
                  <span className="font-medium">{course.modules}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Criado em</span>
                  <span className="font-medium">{new Date(course.createdAt).toLocaleDateString('pt-MZ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última atualização</span>
                  <span className="font-medium">{new Date(course.lastUpdated).toLocaleDateString('pt-MZ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Classificação média</span>
                  <span className="font-medium">{course.averageRating}/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de módulos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Módulos do Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {course.modulesList.map((module) => (
                <Card key={module.id} className={`p-4 ${module.locked ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        module.completed 
                          ? 'bg-green-100 text-green-800' 
                          : module.locked 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {module.completed ? '✓' : module.id}
                      </div>
                      <div>
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-sm text-muted-foreground">{module.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {module.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Concluído
                        </Badge>
                      )}
                      {module.locked && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-400">
                          Bloqueado
                        </Badge>
                      )}
                      {!module.completed && !module.locked && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Pendente
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações finais */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Conteúdo
          </Button>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Gerenciar Curso
          </Button>
        </div>
      </div>
    </Layout>
  );
}