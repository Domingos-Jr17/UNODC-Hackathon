import { useState, useEffect, memo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TypographyH1, TypographyH2, TypographyH4, TypographySmall, TypographyMuted } from '@/components/ui/typography';
import { Users, GraduationCap, TrendingUp, BarChart3, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from './header';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

function DashboardComponent() {
    
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        coursesCompleted: 0,
        certificatesIssued: 0,
        averageCompletionTime: 0
    });

    interface Activity {
        id: number;
        user: string;
        action: string;
        time: string;
    }

    interface User {
        id: number;
        code: string;
        name: string;
        ngo: string;
        status: string;
        lastActivity: string;
        coursesCompleted: number;
        certificatesEarned: number;
    }

    interface Course {
        id: string;
        title: string;
        activeUsers: number;
        completionRate: number;
    }

    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            // Simular carregamento de dados
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStats({
                totalUsers: 42,
                activeUsers: 38,
                coursesCompleted: 15,
                certificatesIssued: 12,
                averageCompletionTime: 45
            });

            setRecentActivity([
                { id: 1, user: 'V0042', action: 'Completou módulo Costura', time: '2 horas atrás' },
                { id: 2, user: 'V0038', action: 'Iniciou curso Culinária', time: '5 horas atrás' },
                { id: 3, user: 'V0031', action: 'Gerou certificado', time: '1 dia atrás' },
                { id: 4, user: 'V0042', action: 'Baixou vídeo offline', time: '3 horas atrás' }
            ]);

            setUsers([
                { id: 1, code: 'V0042', name: 'Maria Silva', ngo: 'ONG-001', status: 'Ativo', lastActivity: '2 horas atrás', coursesCompleted: 1, certificatesEarned: 1 },
                { id: 2, code: 'V0038', name: 'Ana Machel', ngo: 'ONG-001', status: 'Ativo', lastActivity: '5 horas atrás', coursesCompleted: 0, certificatesEarned: 0 },
                { id: 3, code: 'V0031', name: 'João Sitoe', ngo: 'ONG-002', status: 'Ativo', lastActivity: '1 dia atrás', coursesCompleted: 0, certificatesEarned: 0 }
            ]);

            setCourses([
                { id: 'costura', title: 'Costura Avançada', activeUsers: 25, completionRate: 75 },
                { id: 'culinaria', title: 'Culinária Profissional', activeUsers: 18, completionRate: 60 },
                { id: 'agricultura', title: 'Agricultura Sustentável', activeUsers: 8, completionRate: 40 }
            ]);

            setLoading(false);
        };

        loadDashboardData();
    }, []);

    // Funções memoizadas para otimização
    const handleGenerateReport = useCallback(() => {
        // Em produção, implementar geração real de relatório
        console.log('Gerando relatório...');
    }, []);

    const handleActivateUser = useCallback(() => {
        // Em produção, implementar ativação real de usuário
        console.log('Ativando usuário...');
    }, []);
    
    return (
        <>
            <LoadingOverlay show={loading} message="Carregando dashboard..." />
            <div className=" bg-background min-h-screen">
                <Header/>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-2 gap-4">
                <TypographyH1>
                    Dashboard WIRA
                </TypographyH1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-6 ">
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-10 h-10 text-primary mr-1" />
                            <TypographyH2>
                                {stats.totalUsers}
                            </TypographyH2>
                        </div>
                        <TypographyMuted>
                            Usuários Totais
                        </TypographyMuted>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-10 h-10 text-green-600 mr-1" />
                            <TypographyH2>
                                {stats.activeUsers}
                            </TypographyH2>
                        </div>
                        <TypographyMuted>
                            Usuários Ativos
                        </TypographyMuted>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="w-10 h-10 text-blue-600 mr-1" />
                            <TypographyH2>
                                {stats.coursesCompleted}
                            </TypographyH2>
                        </div>
                        <TypographyMuted>
                            Cursos Concluídos
                        </TypographyMuted>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-10 h-10 text-orange-600 mr-1" />
                            <TypographyH2>
                                {stats.certificatesIssued}
                            </TypographyH2>
                        </div>
                        <TypographyMuted>
                            Certificados Emitidos
                        </TypographyMuted>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-10 h-10 text-purple-600 mr-1" />
                            <TypographyH2>
                                {stats.averageCompletionTime} dias
                            </TypographyH2>
                        </div>
                        <TypographyMuted>
                            Tempo Médio de Conclusão
                        </TypographyMuted>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                    <CardContent>
                        <TypographyH4 className="mb-4">
                            Atividade Recente
                        </TypographyH4>

                        <div className="max-h-72 overflow-auto">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center py-2 border-b border-border">
                                    <TypographySmall className="min-w-24">
                                        {activity.user}
                                    </TypographySmall>
                                    <TypographyMuted className="ml-2 flex-1">
                                        {activity.action}
                                    </TypographyMuted>
                                    <TypographySmall className="ml-auto">
                                        {activity.time}
                                    </TypographySmall>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <TypographyH4 className="mb-4">
                            Usuários Ativos
                        </TypographyH4>

                        <div className="max-h-72 overflow-auto">
                            {users.filter(user => user.status === 'Ativo').map((user) => (
                                <div key={user.id} className="flex items-center py-2 border-b border-border">
                                    <TypographySmall className="min-w-24">
                                        {user.code}
                                    </TypographySmall>
                                    <TypographyMuted className="ml-2 flex-1">
                                        {user.name}
                                    </TypographyMuted>
                                    <TypographySmall className="ml-auto">
                                        {user.ngo}
                                    </TypographySmall>
                                    <TypographySmall className="ml-4">
                                        {user.lastActivity}
                                    </TypographySmall>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <TypographyH4 className="mb-4">
                            Progresso por Curso
                        </TypographyH4>

                        <div className="max-h-72 overflow-auto">
                            {courses.map((course) => (
                                <div key={course.id} className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <TypographySmall className="min-w-36">
                                            {course.title}
                                        </TypographySmall>
                                        <TypographyMuted>
                                            {course.activeUsers} usuários
                                        </TypographyMuted>
                                    </div>

                                    <div className="w-full">
                                        <TypographySmall className="mb-2">
                                            Taxa de Conclusão
                                        </TypographySmall>
                                        <div className="flex items-center">
                                            <div className="flex-1 h-2 bg-muted rounded-full mr-2">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        course.completionRate > 70 ? 'bg-green-500' : 'bg-orange-500'
                                                    )}
                                                    style={{ width: `${course.completionRate}%` }}
                                                />
                                            </div>
                                            <TypographySmall>
                                                {course.completionRate}%
                                            </TypographySmall>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                 </div>
            </div>
        </>
    );
}

const Dashboard = memo(DashboardComponent);
Dashboard.displayName = 'Dashboard';

export default Dashboard;