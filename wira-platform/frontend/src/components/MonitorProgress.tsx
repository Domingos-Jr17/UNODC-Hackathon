import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TypographySmall, TypographyMuted } from '@/components/ui/typography';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import Layout from './layout/Layout';
import MetricCard from './ui/MetricCard';
import StatusBadge from './ui/StatusBadge';
import DataTable from './ui/DataTable';
import {
  Users,
  Calendar,
  Award,
  BarChart3,
  Eye,
  Filter,
  Activity
} from 'lucide-react';

function MonitorProgressComponent() {
	// Enhanced user type with progress data
	type User = {
		id: number;
		code: string;
		name: string;
		ngo: string;
		status: 'active' | 'inactive';
		lastActivity: string;
		progress: number;
		coursesCompleted: number;
		certificatesEarned: number;
		currentCourse: string | null;
		registrationDate: string;
	};

	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

	// Calculate metrics
	const metrics = useMemo(() => {
		const activeUsers = users.filter(u => u.status === 'active').length;
		const totalUsers = users.length;
		const avgProgress = users.length > 0
			? Math.round(users.reduce((acc, u) => acc + u.progress, 0) / users.length)
			: 0;
		const totalCertificates = users.reduce((acc, u) => acc + u.certificatesEarned, 0);

		return {
			totalUsers,
			activeUsers,
			inactiveUsers: totalUsers - activeUsers,
			avgProgress,
			totalCertificates,
			completionRate: users.length > 0
				? Math.round((users.filter(u => u.progress === 100).length / users.length) * 100)
				: 0
		};
	}, [users]);

	// Simular carregamento de dados com dados mais realistas
	useEffect(() => {
		const loadUsers = async () => {
			setLoading(true);
			// Simular chamada API
			await new Promise(resolve => setTimeout(resolve, 1500));

			const mockUsers: User[] = [
				{
					id: 1,
					code: 'V0042',
					name: 'Maria Silva',
					ngo: 'ONG-001',
					status: 'active' as const,
					lastActivity: '2 horas atrás',
					progress: 75,
					coursesCompleted: 1,
					certificatesEarned: 1,
					currentCourse: 'Culinária Profissional',
					registrationDate: '2024-01-15'
				},
				{
					id: 2,
					code: 'V0038',
					name: 'Ana Machel',
					ngo: 'ONG-001',
					status: 'active' as const,
					lastActivity: '5 horas atrás',
					progress: 37,
					coursesCompleted: 0,
					certificatesEarned: 0,
					currentCourse: 'Costura Avançada',
					registrationDate: '2024-01-20'
				},
				{
					id: 3,
					code: 'V0031',
					name: 'João Sitoe',
					ngo: 'ONG-002',
					status: 'inactive' as const,
					lastActivity: '1 dia atrás',
					progress: 15,
					coursesCompleted: 0,
					certificatesEarned: 0,
					currentCourse: 'Agricultura Sustentável',
					registrationDate: '2024-02-01'
				},
				{
					id: 4,
					code: 'V0055',
					name: 'Elsa Nhone',
					ngo: 'ONG-003',
					status: 'active' as const,
					lastActivity: '30 minutos atrás',
					progress: 100,
					coursesCompleted: 2,
					certificatesEarned: 2,
					currentCourse: null,
					registrationDate: '2024-01-10'
				},
				{
					id: 5,
					code: 'V0060',
					name: 'Carlos Muamba',
					ngo: 'ONG-001',
					status: 'active' as const,
					lastActivity: '1 hora atrás',
					progress: 52,
					coursesCompleted: 1,
					certificatesEarned: 1,
					currentCourse: 'Agricultura Sustentável',
					registrationDate: '2024-01-25'
				}
			];

			setUsers(mockUsers);
			setLoading(false);
		};

		loadUsers();
	}, []);

	const handleUserSelect = useCallback((user: User) => {
		setSelectedUser(user);
	}, []);

	const handleFilterChange = useCallback((value: 'all' | 'active' | 'inactive') => {
		setFilter(value);
	}, []);

	const filteredUsers = filter === 'all' ? users : users.filter(user => user.status === filter);

	return (
		<Layout
			title="Monitorar Progresso"
			subtitle="Acompanhe o progresso e engajamento dos usuários"
		>
			<LoadingOverlay show={loading} message="Carregando dados de progresso..." />

			{/* Metrics Dashboard */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
				<MetricCard
					title="Total de Usuários"
					value={metrics.totalUsers}
					icon={Users}
					trend={{
						value: 12,
						type: 'increase',
						period: 'este mês'
					}}
				/>
				<MetricCard
					title="Usuários Ativos"
					value={metrics.activeUsers}
					icon={Activity}
					description="Engajados ativamente"
				/>
				<MetricCard
					title="Progresso Médio"
					value={`${metrics.avgProgress}%`}
					icon={BarChart3}
					trend={{
						value: 8,
						type: 'increase',
						period: 'esta semana'
					}}
				/>
				<MetricCard
					title="Taxa de Conclusão"
					value={`${metrics.completionRate}%`}
					icon={Award}
					description="Usuários que concluíram"
				/>
				<MetricCard
					title="Certificados"
					value={metrics.totalCertificates}
					icon={Award}
					description="Emitidos até agora"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Filters Card */}
				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<Filter className="h-4 w-4" />
							Filtros
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<TypographySmall className="font-medium">Status</TypographySmall>
							<div className="flex flex-col gap-2">
								<Button
									variant={filter === 'all' ? 'default' : 'outline'}
									onClick={() => handleFilterChange('all')}
									className="justify-start"
								>
									Todos ({metrics.totalUsers})
								</Button>
								<Button
									variant={filter === 'active' ? 'default' : 'outline'}
									onClick={() => handleFilterChange('active')}
									className="justify-start"
								>
									Ativos ({metrics.activeUsers})
								</Button>
								<Button
									variant={filter === 'inactive' ? 'default' : 'outline'}
									onClick={() => handleFilterChange('inactive')}
									className="justify-start"
								>
									Inativos ({metrics.inactiveUsers})
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<TypographySmall className="font-medium">Estatísticas</TypographySmall>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<TypographyMuted>Progresso médio:</TypographyMuted>
									<TypographySmall className="font-medium">{metrics.avgProgress}%</TypographySmall>
								</div>
								<div className="flex justify-between">
									<TypographyMuted>Conclusão:</TypographyMuted>
									<TypographySmall className="font-medium">{metrics.completionRate}%</TypographySmall>
								</div>
								<div className="flex justify-between">
									<TypographyMuted>Certificados:</TypographyMuted>
									<TypographySmall className="font-medium">{metrics.totalCertificates}</TypographySmall>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Users Table */}
				<Card className="lg:col-span-3">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							Usuários ({filteredUsers.length})
						</CardTitle>
						<Button variant="outline" size="sm">
							<Calendar className="mr-2 h-4 w-4" />
							Últimos 30 dias
						</Button>
					</CardHeader>
					<CardContent>
						<DataTable
							data={filteredUsers}
							columns={[
								{
									key: 'code',
									title: 'Código',
									sortable: true,
									render: (value: string) => (
										<div className="flex items-center gap-2">
											<Badge variant="secondary" className="font-mono">
												{value}
											</Badge>
										</div>
									)
								},
								{
									key: 'name',
									title: 'Nome',
									sortable: true,
									render: (value: string, row: User) => (
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
												<TypographySmall className="text-primary font-medium">
													{value.slice(0, 2).toUpperCase()}
												</TypographySmall>
											</div>
											<div>
												<div className="font-medium">{value}</div>
												<TypographyMuted className="text-xs">{row.ngo}</TypographyMuted>
											</div>
										</div>
									)
								},
								{
									key: 'status',
									title: 'Status',
									sortable: true,
									render: (value: string) => (
										<StatusBadge status={value as any} />
									)
								},
								{
									key: 'progress',
									title: 'Progresso',
									sortable: true,
									render: (value: number, row: User) => (
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
													<div
														className={`h-full rounded-full transition-all duration-300 ${
															value > 70 ? 'bg-green-500' :
															value > 40 ? 'bg-orange-500' : 'bg-red-500'
														}`}
														style={{ width: `${value}%` }}
													/>
												</div>
												<TypographySmall className="font-medium w-10 text-right">{value}%</TypographySmall>
											</div>
											{row.currentCourse && (
												<TypographyMuted className="text-xs">
													{row.currentCourse}
												</TypographyMuted>
											)}
										</div>
									)
								},
								{
									key: 'lastActivity',
									title: 'Última Atividade',
									sortable: true,
									render: (value: string) => (
										<div className="text-sm">
											<div>{value}</div>
										</div>
									)
								}
							]}
							onRowClick={handleUserSelect}
							searchPlaceholder="Buscar por código ou nome..."
							actions={[
								{
									label: 'Ver Detalhes',
									onClick: (user) => handleUserSelect(user),
									icon: Eye
								}
							]}
						/>
					</CardContent>
				</Card>
			</div>

			{/* User Details Card */}
			{selectedUser && (
				<Card className="mt-6 border-primary/20 bg-primary/5">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5 text-primary" />
							Detalhes do Usuário: {selectedUser.code}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
							<div className="space-y-2">
								<TypographyMuted className="text-sm font-medium">Nome</TypographyMuted>
								<div className="font-medium">{selectedUser.name}</div>
								<TypographyMuted className="text-xs">[Dados criptografados]</TypographyMuted>
							</div>

							<div className="space-y-2">
								<TypographyMuted className="text-sm font-medium">ONG</TypographyMuted>
								<div className="font-medium">{selectedUser.ngo}</div>
								<StatusBadge status={selectedUser.status} />
							</div>

							<div className="space-y-2">
								<TypographyMuted className="text-sm font-medium">Progresso Geral</TypographyMuted>
								<div className="text-2xl font-bold text-primary">{selectedUser.progress}%</div>
								<div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
									<div
										className={`h-full rounded-full ${
											selectedUser.progress > 70 ? 'bg-green-500' :
											selectedUser.progress > 40 ? 'bg-orange-500' : 'bg-red-500'
										}`}
										style={{ width: `${selectedUser.progress}%` }}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<TypographyMuted className="text-sm font-medium">Cursos Concluídos</TypographyMuted>
								<div className="text-2xl font-bold">{selectedUser.coursesCompleted}</div>
								<TypographyMuted className="text-xs">de 3 disponíveis</TypographyMuted>
							</div>

							<div className="space-y-2">
								<TypographyMuted className="text-sm font-medium">Certificados</TypographyMuted>
								<div className="text-2xl font-bold">{selectedUser.certificatesEarned}</div>
								<TypographyMuted className="text-xs">Emitidos</TypographyMuted>
							</div>
						</div>

						{selectedUser.currentCourse && (
							<div className="mt-4 pt-4 border-t">
								<TypographyMuted className="text-sm font-medium mb-2">Curso Atual</TypographyMuted>
								<div className="bg-background p-3 rounded-lg border">
									<div className="font-medium">{selectedUser.currentCourse}</div>
									<TypographyMuted className="text-xs mt-1">
										Em andamento há {selectedUser.progress}% completos
									</TypographyMuted>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</Layout>
	);
}

const MonitorProgress = memo(MonitorProgressComponent);
MonitorProgress.displayName = 'MonitorProgress';

export default MonitorProgress;