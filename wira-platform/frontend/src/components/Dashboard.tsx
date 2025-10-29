import { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TypographySmall, TypographyMuted } from '@/components/ui/typography';
import { Users, GraduationCap, TrendingUp, BarChart3, Briefcase, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import Layout from './layout/Layout';
import MetricCard from './ui/MetricCard';
import StatusBadge from './ui/StatusBadge';
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

    return (
        <Layout
            title="Dashboard WIRA"
            subtitle="Visão geral da plataforma"
        >
            <LoadingOverlay show={loading} message="Carregando dashboard..." />

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <MetricCard
                    title="Usuários Totais"
                    value={stats.totalUsers}
                    icon={Users}
                    trend={{
                        value: 12,
                        type: 'increase',
                        period: 'este mês'
                    }}
                />
                <MetricCard
                    title="Usuários Ativos"
                    value={stats.activeUsers}
                    icon={TrendingUp}
                    trend={{
                        value: 8,
                        type: 'increase',
                        period: 'esta semana'
                    }}
                />
                <MetricCard
                    title="Cursos Concluídos"
                    value={stats.coursesCompleted}
                    icon={GraduationCap}
                    trend={{
                        value: 15,
                        type: 'increase',
                        period: 'este mês'
                    }}
                />
                <MetricCard
                    title="Certificados Emitidos"
                    value={stats.certificatesIssued}
                    icon={BarChart3}
                    description="Certificados válidos"
                />
                <MetricCard
                    title="Tempo Médio de Conclusão"
                    value={`${stats.averageCompletionTime} dias`}
                    icon={Briefcase}
                    trend={{
                        value: 5,
                        type: 'decrease',
                        period: 'vs mês passado'
                    }}
                />
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Atividade Recente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-80 overflow-auto">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        <TypographySmall className="text-primary font-medium">
                                            {activity.user.slice(-2)}
                                        </TypographySmall>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <TypographySmall className="font-medium text-foreground">
                                            {activity.user}
                                        </TypographySmall>
                                        <TypographyMuted className="text-sm mt-1">
                                            {activity.action}
                                        </TypographyMuted>
                                        <TypographySmall className="text-xs text-muted-foreground mt-1">
                                            {activity.time}
                                        </TypographySmall>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Active Users */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Usuários Ativos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-80 overflow-auto">
                            {users.filter(user => user.status === 'Ativo').map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <TypographySmall className="text-primary font-medium">
                                                {user.code.slice(-2)}
                                            </TypographySmall>
                                        </div>
                                        <div>
                                            <TypographySmall className="font-medium text-foreground">
                                                {user.name}
                                            </TypographySmall>
                                            <TypographyMuted className="text-sm">
                                                {user.code} • {user.ngo}
                                            </TypographyMuted>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <TypographySmall className="text-sm">
                                                {user.coursesCompleted} cursos
                                            </TypographySmall>
                                            <TypographySmall className="text-xs text-muted-foreground">
                                                {user.certificatesEarned} certificados
                                            </TypographySmall>
                                        </div>
                                        <StatusBadge status="active" />
                                        <div className="text-right">
                                            <TypographySmall className="text-xs text-muted-foreground">
                                                {user.lastActivity}
                                            </TypographySmall>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Course Progress */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Progresso por Curso
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div key={course.id} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <TypographySmall className="font-medium text-foreground">
                                                {course.title}
                                            </TypographySmall>
                                            <TypographyMuted className="text-sm">
                                                {course.activeUsers} usuários ativos
                                            </TypographyMuted>
                                        </div>
                                        <StatusBadge
                                            status={course.completionRate > 70 ? 'success' : course.completionRate > 40 ? 'in-progress' : 'warning'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <TypographySmall className="text-sm">Taxa de Conclusão</TypographySmall>
                                            <TypographySmall className="text-sm font-medium">
                                                {course.completionRate}%
                                            </TypographySmall>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-500 ease-out",
                                                    course.completionRate > 70 ? 'bg-green-500' :
                                                    course.completionRate > 40 ? 'bg-orange-500' : 'bg-red-500'
                                                )}
                                                style={{ width: `${course.completionRate}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}

const Dashboard = memo(DashboardComponent);
Dashboard.displayName = 'Dashboard';

export default Dashboard;