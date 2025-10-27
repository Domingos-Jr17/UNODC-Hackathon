import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, Box, CircularProgress } from '@mui/material';
import { People, School, TrendingUp, Assessment, Work } from '@mui/icons-material';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 42,
        activeUsers: 38,
        coursesCompleted: 15,
        certificatesIssued: 12,
        averageCompletionTime: 45 // days
    });

    const [recentActivity, setRecentActivity] = useState([
        { id: 1, user: 'V0042', action: 'Completou módulo Costura', time: '2 horas atrás' },
        { id: 2, user: 'V0038', action: 'Iniciou curso Culinária', time: '5 horas atrás' },
        { id: 3, user: 'V0031', action: 'Gerou certificado', time: '1 dia atrás' },
        { id: 4, user: 'V0042', action: 'Baixou vídeo offline', time: '3 horas atrás' }
    ]);

    const [users, setUsers] = useState([
        { id: 1, code: 'V0042', name: 'Maria Silva', ngo: 'ONG-001', status: 'Ativo', lastActivity: '2 horas atrás', coursesCompleted: 1, certificatesEarned: 1 },
        { id: 2, code: 'V0038', name: 'Ana Machel', ngo: 'ONG-001', status: 'Ativo', lastActivity: '5 horas atrás', coursesCompleted: 0, certificatesEarned: 0 },
        { id: 3, code: 'V0031', name: 'João Sitoe', ngo: 'ONG-002', status: 'Ativo', lastActivity: '1 dia atrás', coursesCompleted: 0, certificatesEarned: 0 }
    ]);

    const [courses, setCourses] = useState([
        { id: 'costura', title: 'Costura Avançada', activeUsers: 25, completionRate: 75 },
        { id: 'culinaria', title: 'Culinária Profissional', activeUsers: 18, completionRate: 60 },
        { id: 'agricultura', title: 'Agricultura Sustentável', activeUsers: 8, completionRate: 40 }
    ]);

    const handleActivateUser = () => {
        // Simular ativação de novo usuário
        alert('Função de ativação de novo usuário - em desenvolvimento');
    };

    const handleGenerateReport = () => {
        // Simular geração de relatório
        alert('Função de geração de relatório - em desenvolvimento');
    };

    return (
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, p: 2 }}>
                <Typography variant="h4" component="h1">
                    Dashboard WIRA
                </Typography>

                <Button variant="contained" color="primary" onClick={handleGenerateReport}>
                    Gerar Relatório
                </Button>

                <Button variant="outlined" color="secondary" onClick={handleActivateUser}>
                    Ativar Novo Usuário
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <People sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
                                <Typography variant="h5">
                                    {stats.totalUsers}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Usuários Totais
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 1 }} />
                                <Typography variant="h5">
                                    {stats.activeUsers}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Usuários Ativos
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <School sx={{ fontSize: 40, color: 'info.main', mr: 1 }} />
                                <Typography variant="h5">
                                    {stats.coursesCompleted}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Cursos Concluídos
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Assessment sx={{ fontSize: 40, color: 'warning.main', mr: 1 }} />
                                <Typography variant="h5">
                                    {stats.certificatesIssued}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Certificados Emitidos
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Work sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} />
                                <Typography variant="h5">
                                    {stats.averageCompletionTime} dias
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Tempo Médio de Conclusão
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Atividade Recente
                            </Typography>

                            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                {recentActivity.map((activity) => (
                                    <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
                                        <Typography variant="body2" sx={{ minWidth: 100 }}>
                                            {activity.user}
                                        </Typography>
                                        <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                                            {activity.action}
                                        </Typography>
                                        <Typography variant="caption" sx={{ ml: 'auto' }}>
                                            {activity.time}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Usuários Ativos
                            </Typography>

                            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                {users.filter(user => user.status === 'Ativo').map((user) => (
                                    <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
                                        <Typography variant="body2" sx={{ minWidth: 100 }}>
                                            {user.code}
                                        </Typography>
                                        <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                                            {user.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ ml: 'auto' }}>
                                            {user.ngo}
                                        </Typography>
                                        <Typography variant="caption" sx={{ ml: 'auto' }}>
                                            {user.lastActivity}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Progresso por Curso
                            </Typography>

                            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                {courses.map((course) => (
                                    <Box key={course.id} sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ minWidth: 150 }}>
                                                {course.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {course.activeUsers} usuários
                                            </Typography>
                                        </Box>

                                        <Box sx={{ width: '100%', mt: 1 }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                Taxa de Conclusão
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ flex: 1, height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, mr: 1 }}>
                                                    <Box
                                                        sx={{
                                                            height: '100%',
                                                            backgroundColor: course.completionRate > 70 ? '#4caf50' : '#ff9800',
                                                            borderRadius: 4
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="body2" sx={{ ml: 1 }}>
                                                    {course.completionRate}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
        </Box>
    );
}