import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Person, TrendingUp, Assessment } from '@mui/icons-material';

export default function MonitorProgress() {
    const [users, setUsers] = useState([
        { id: 1, code: 'V0042', name: 'Maria Silva', ngo: 'ONG-001', status: 'Ativo', lastActivity: '2 horas atrás' },
        { id: 2, code: 'V0038', name: 'Ana Machel', ngo: 'ONG-001', status: 'Ativo', lastActivity: '5 horas atrás' },
        { id: 3, code: 'V0031', name: 'João Sitoe', ngo: 'ONG-002', status: 'Ativo', lastActivity: '1 dia atrás' }
    ]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [filter, setFilter] = useState('all');

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredUsers = filter === 'all' ? users : users.filter(user => user.status === filter);

    return (
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Monitorar Progresso
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Filtros
                            </Typography>

                            <Box sx={{ display: 'flex', mb: 2 }}>
                                <Button
                                    variant={filter === 'all' ? 'contained' : 'outlined'}
                                    onClick={() => handleFilterChange('all')}
                                    sx={{ mr: 1 }}
                                >
                                    Todos
                                </Button>

                                <Button
                                    variant={filter === 'active' ? 'contained' : 'outlined'}
                                    onClick={() => handleFilterChange('active')}
                                    sx={{ mr: 1 }}
                                >
                                    Ativos
                                </Button>

                                <Button
                                    variant={filter === 'inactive' ? 'contained' : 'outlined'}
                                    onClick={() => handleFilterChange('inactive')}
                                >
                                    Inativos
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Usuários ({filteredUsers.length})
                            </Typography>

                            <TableContainer>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Código</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>ONG</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Última Atividade</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            selected={selectedUser?.id === user.id}
                                            onClick={() => handleUserSelect(user)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>{user.code}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.ngo}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box
                                                        sx={{
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: '50%',
                                                            backgroundColor: user.status === 'Ativo' ? '#4caf50' : '#f44336',
                                                            mr: 1
                                                        }}
                                                    />
                                                    <Typography variant="body2">
                                                        {user.status}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{user.lastActivity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {selectedUser && (
                    <Grid item xs={12} md={9}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Detalhes do Usuário: {selectedUser.code}
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Nome Completo:
                                        </Typography>
                                        <Typography variant="body1">
                                            [Dados criptografados - apenas ONG autorizada]
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Cursos em Progresso:
                                        </Typography>
                                        <Typography variant="body1">
                                            Costura Avançada: 3 de 8 módulos (37.5%)
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Certificados Obtidos:
                                        </Typography>
                                        <Typography variant="body1">
                                            1 certificado (Costura Avançada)
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Tempo Médio de Conclusão:
                                        </Typography>
                                        <Typography variant="body1">
                                            45 dias
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Previsão de Conclusão:
                                        </Typography>
                                        <Typography variant="body1">
                                            15 de Dezembro de 2025
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}