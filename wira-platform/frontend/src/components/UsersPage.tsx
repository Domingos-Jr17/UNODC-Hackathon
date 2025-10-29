import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/DataTable';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { EmptyUsers } from '@/components/ui/EmptyState';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import Layout from './layout/Layout';
import { Users, UserPlus, Eye, Download, Filter, Search } from 'lucide-react';
import { getUserProgressStatus } from '@/components/ui/StatusBadge';

interface User {
  id: number;
  code: string;
  name: string;
  email?: string;
  ngo: string;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
  lastActivity: string;
  coursesCompleted: number;
  certificatesEarned: number;
  totalProgress: number;
  phone?: string;
  location?: string;
  age?: number;
}

const mockUsers: User[] = [
  {
    id: 1,
    code: 'V0042',
    name: 'Maria Silva',
    email: 'maria.silva@anon.wira',
    ngo: 'ONG-001',
    status: 'active',
    registrationDate: '2024-01-15',
    lastActivity: '2024-10-28 14:30',
    coursesCompleted: 1,
    certificatesEarned: 1,
    totalProgress: 75,
    phone: '+258 84 123 4567',
    location: 'Maputo',
    age: 28
  },
  {
    id: 2,
    code: 'V0038',
    name: 'Ana Machel',
    ngo: 'ONG-001',
    status: 'active',
    registrationDate: '2024-01-20',
    lastActivity: '2024-10-28 09:15',
    coursesCompleted: 0,
    certificatesEarned: 0,
    totalProgress: 37,
    phone: '+258 84 765 4321',
    location: 'Matola',
    age: 32
  },
  {
    id: 3,
    code: 'V0031',
    name: 'João Sitoe',
    ngo: 'ONG-002',
    status: 'active',
    registrationDate: '2024-02-01',
    lastActivity: '2024-10-27 16:45',
    coursesCompleted: 0,
    certificatesEarned: 0,
    totalProgress: 15,
    phone: '+258 84 999 8888',
    location: 'Xai-Xai',
    age: 25
  },
  {
    id: 4,
    code: 'V0055',
    name: 'Elsa Nhone',
    ngo: 'ONG-003',
    status: 'pending',
    registrationDate: '2024-10-25',
    lastActivity: '2024-10-25 11:00',
    coursesCompleted: 0,
    certificatesEarned: 0,
    totalProgress: 0,
    phone: '+258 84 555 6666',
    location: 'Beira',
    age: 30
  },
  {
    id: 5,
    code: 'V0060',
    name: 'Carlos Muamba',
    ngo: 'ONG-001',
    status: 'inactive',
    registrationDate: '2024-01-10',
    lastActivity: '2024-09-15 08:30',
    coursesCompleted: 2,
    certificatesEarned: 2,
    totalProgress: 100,
    phone: '+258 84 111 2222',
    location: 'Nampula',
    age: 35
  }
];

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedNGO, setSelectedNGO] = useState<string>('');

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUsers(mockUsers);
      setLoading(false);
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.ngo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !selectedStatus || user.status === selectedStatus;
      const matchesNGO = !selectedNGO || user.ngo === selectedNGO;

      return matchesSearch && matchesStatus && matchesNGO;
    });
  }, [users, searchTerm, selectedStatus, selectedNGO]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      pending: users.filter(u => u.status === 'pending').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      avgProgress: Math.round(users.reduce((acc, u) => acc + u.totalProgress, 0) / users.length) || 0
    };
  }, [users]);

  const ngoOptions = useMemo(() => {
    const ngos = [...new Set(users.map(u => u.ngo))];
    return ngos.map(ngo => ({ value: ngo, label: ngo }));
  }, [users]);

  const statusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'pending', label: 'Pendente' },
    { value: 'inactive', label: 'Inativo' }
  ];

  const columns = [
    {
      key: 'code',
      title: 'Código',
      sortable: true,
      width: '100px',
      render: (value: string) => (
        <Badge variant="secondary" className="font-mono">
          {value}
        </Badge>
      )
    },
    {
      key: 'name',
      title: 'Nome',
      sortable: true,
      filterable: true,
      render: (value: string, row: User) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.email && (
            <div className="text-sm text-muted-foreground">{row.email}</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      filterable: true,
      filterOptions: statusOptions,
      render: (value: string) => (
        <StatusBadge status={value as any} />
      )
    },
    {
      key: 'ngo',
      title: 'ONG',
      sortable: true,
      filterable: true,
      filterOptions: ngoOptions,
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'totalProgress',
      title: 'Progresso',
      sortable: true,
      render: (value: number, row: User) => (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  value > 70 ? 'bg-green-500' :
                  value > 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium w-10 text-right">{value}%</span>
          <StatusBadge status={getUserProgressStatus(value)} />
        </div>
      )
    },
    {
      key: 'coursesCompleted',
      title: 'Cursos',
      sortable: true,
      render: (value: number, row: User) => (
        <div className="text-sm">
          <div className="font-medium">{value}</div>
          <div className="text-muted-foreground">{row.certificatesEarned} certificados</div>
        </div>
      )
    },
    {
      key: 'lastActivity',
      title: 'Última Atividade',
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">
          {new Date(value).toLocaleDateString('pt-MZ')}
          <div className="text-muted-foreground">
            {new Date(value).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    }
  ];

  const handleRowClick = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const handleExportUsers = () => {
    // TODO: Implement export functionality
    console.log('Exporting users...');
  };

  if (loading) {
    return (
      <Layout title="Gestão de Usuários" subtitle="Gerencie todos os usuários da plataforma">
        <LoadingOverlay show={loading} message="Carregando usuários..." />
      </Layout>
    );
  }

  return (
    <Layout title="Gestão de Usuários" subtitle="Gerencie todos os usuários da plataforma">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard
          title="Total de Usuários"
          value={stats.total}
          icon={Users}
          trend={{
            value: 8,
            type: 'increase',
            period: 'este mês'
          }}
        />
        <MetricCard
          title="Usuários Ativos"
          value={stats.active}
          icon={Users}
          description="Atualmente engajados"
        />
        <MetricCard
          title="Pendentes"
          value={stats.pending}
          icon={UserPlus}
          description="Aguardando ativação"
        />
        <MetricCard
          title="Inativos"
          value={stats.inactive}
          icon={Users}
          description="Sem atividade recente"
        />
        <MetricCard
          title="Progresso Médio"
          value={`${stats.avgProgress}%`}
          icon={Users}
          trend={{
            value: 5,
            type: 'increase',
            period: 'esta semana'
          }}
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Todos os Usuários</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportUsers}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <EmptyUsers
              onAdd={() => console.log('Add user')}
            />
          ) : (
            <DataTable
              data={filteredUsers}
              columns={columns}
              onRowClick={handleRowClick}
              searchPlaceholder="Buscar por nome, código ou ONG..."
              actions={[
                {
                  label: 'Ver Detalhes',
                  onClick: (user) => navigate(`/users/${user.id}`),
                  icon: Eye
                }
              ]}
            />
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}