import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TypographyH2, TypographyH4, TypographyP, TypographySmall, TypographyMuted } from '@/components/ui/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function MonitorProgress() {
	// Tipagem do usuário
	type User = {
		id: number;
		code: string;
		name: string;
		ngo: string;
		status: 'Ativo' | 'Inativo';
		lastActivity: string;
	};

	const [users] = useState<User[]>(
		[
			{ id: 1, code: 'V0042', name: 'Maria Silva', ngo: 'ONG-001', status: 'Ativo', lastActivity: '2 horas atrás' },
			{ id: 2, code: 'V0038', name: 'Ana Machel', ngo: 'ONG-001', status: 'Ativo', lastActivity: '5 horas atrás' },
			{ id: 3, code: 'V0031', name: 'João Sitoe', ngo: 'ONG-002', status: 'Inativo', lastActivity: '1 dia atrás' }
		]
	);

	// selectedUser tipado
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [filter, setFilter] = useState<'all' | 'Ativo' | 'Inativo'>('all');

	// Ajuste: handleUserSelect tipado
	const handleUserSelect = (user: User) => {
		setSelectedUser(user);
	};

	// Ajuste: agora recebe diretamente o valor do filtro
	const handleFilterChange = (value: 'all' | 'Ativo' | 'Inativo') => {
		setFilter(value);
	};

	const filteredUsers = filter === 'all' ? users : users.filter(user => user.status === filter);

	return (
		<div className="p-6 bg-background min-h-screen">
			<TypographyH2 className="mb-6">
				Monitorar Progresso
			</TypographyH2>

			<div className="flex flex-col lg:flex-row gap-6 mb-6">
				<div className="lg:w-1/4">
					<Card>
						<CardContent>
							<TypographyH4 className="mb-4">
								Filtros
							</TypographyH4>

							<div className="flex flex-wrap gap-2">
								<Button
									variant={filter === 'all' ? 'default' : 'outline'}
									onClick={() => handleFilterChange('all')}
								>
									Todos
								</Button>

								<Button
									variant={filter === 'Ativo' ? 'default' : 'outline'}
									onClick={() => handleFilterChange('Ativo')}
								>
									Ativos
								</Button>

								<Button
									variant={filter === 'Inativo' ? 'default' : 'outline'}
									onClick={() => handleFilterChange('Inativo')}
								>
									Inativos
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="lg:w-3/4">
					<Card>
						<CardContent>
							<TypographyH4 className="mb-4">
								Usuários ({filteredUsers.length})
							</TypographyH4>

							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Código</TableHead>
										<TableHead>Nome</TableHead>
										<TableHead>ONG</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Última Atividade</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredUsers.map((user) => (
										<TableRow
											key={user.id}
											className={cn("cursor-pointer", selectedUser?.id === user.id && "bg-muted")}
											onClick={() => handleUserSelect(user)}
										>
											<TableCell>{user.code}</TableCell>
											<TableCell>{user.name}</TableCell>
											<TableCell>{user.ngo}</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<div
														className={cn(
															"w-3 h-3 rounded-full",
															user.status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'
														)}
													/>
													<TypographySmall>
														{user.status}
													</TypographySmall>
												</div>
											</TableCell>
											<TableCell>{user.lastActivity}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
			</div>

			
			{selectedUser && (
				<div className="mb-6">
					<Card>
						<CardContent>
							<TypographyH4 className="mb-4">
								Detalhes do Usuário: {selectedUser.code}
							</TypographyH4>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<TypographyMuted className="mb-1">
										Nome Completo:
									</TypographyMuted>
									<TypographyP>
										[Dados criptografados - apenas ONG autorizada]
									</TypographyP>
								</div>

								<div>
									<TypographyMuted className="mb-1">
										Cursos em Progresso:
									</TypographyMuted>
									<TypographyP>
										Costura Avançada: 3 de 8 módulos (37.5%)
									</TypographyP>
								</div>

								<div>
									<TypographyMuted className="mb-1">
										Certificados Obtidos:
									</TypographyMuted>
									<TypographyP>
										1 certificado (Costura Avançada)
									</TypographyP>
								</div>

								<div>
									<TypographyMuted className="mb-1">
										Tempo Médio de Conclusão:
									</TypographyMuted>
									<TypographyP>
										45 dias
									</TypographyP>
								</div>

								<div>
									<TypographyMuted className="mb-1">
										Previsão de Conclusão:
									</TypographyMuted>
									<TypographyP>
										15 de Dezembro de 2025
									</TypographyP>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}