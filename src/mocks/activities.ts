export type ActivityStatus = 'finished' | 'in-progress' | 'waiting' | 'not-started' | 'cancelled';
export type Priority = 'high' | 'medium' | 'low';
export type Department = 'Contábil' | 'Fiscal' | 'Pessoal' | 'Societário' | 'Consultoria';

export interface Activity {
  id: string;
  activity: string;
  responsible: string;
  progress: number;
  status: ActivityStatus;
  department: Department;
  startDate: string;
  endDate: string;
  deadline: string;
  priority: Priority;
  client: string;
  createdAt: string;
  createdBy: string;
  quantity: number;
  lastEditedBy: string;
}

export const mockActivities: Activity[] = [
  {
    id: '1',
    activity: 'Fechamento Contábil - Janeiro',
    responsible: 'Maria Silva',
    progress: 100,
    status: 'finished',
    department: 'Contábil',
    startDate: '2024-01-02',
    endDate: '2024-01-31',
    deadline: '2024-02-05',
    priority: 'high',
    client: 'Empresa ABC Ltda',
    createdAt: '2024-01-02',
    createdBy: 'Administrador',
    quantity: 1,
    lastEditedBy: 'Maria Silva',
  },
  {
    id: '2',
    activity: 'Apuração IRPJ/CSLL - 1º Trimestre',
    responsible: 'João Santos',
    progress: 75,
    status: 'in-progress',
    department: 'Fiscal',
    startDate: '2024-03-01',
    endDate: '2024-03-30',
    deadline: '2024-04-15',
    priority: 'high',
    client: 'Indústria XYZ S.A.',
    createdAt: '2024-03-01',
    createdBy: 'Administrador',
    quantity: 1,
    lastEditedBy: 'João Santos',
  },
  {
    id: '3',
    activity: 'ECD 2024 - Escrituração Contábil Digital',
    responsible: 'Ana Oliveira',
    progress: 40,
    status: 'in-progress',
    department: 'Contábil',
    startDate: '2024-02-01',
    endDate: '2024-05-30',
    deadline: '2024-06-30',
    priority: 'medium',
    client: 'Comércio Delta Ltda',
    createdAt: '2024-02-01',
    createdBy: 'Administrador',
    quantity: 15,
    lastEditedBy: 'Ana Oliveira',
  },
  {
    id: '4',
    activity: 'Folha de Pagamento - Março',
    responsible: 'Maria Silva',
    progress: 100,
    status: 'finished',
    department: 'Pessoal',
    startDate: '2024-03-20',
    endDate: '2024-03-28',
    deadline: '2024-03-30',
    priority: 'high',
    client: 'Empresa ABC Ltda',
    createdAt: '2024-03-20',
    createdBy: 'Administrador',
    quantity: 1,
    lastEditedBy: 'Maria Silva',
  },
  {
    id: '5',
    activity: 'Constituição de Nova Empresa',
    responsible: 'João Santos',
    progress: 25,
    status: 'waiting',
    department: 'Societário',
    startDate: '2024-03-15',
    endDate: '2024-04-30',
    deadline: '2024-05-15',
    priority: 'medium',
    client: 'Novo Cliente - Startup Tech',
    createdAt: '2024-03-15',
    createdBy: 'Administrador',
    quantity: 1,
    lastEditedBy: 'João Santos',
  },
  {
    id: '6',
    activity: 'Planejamento Tributário 2024',
    responsible: 'Ana Oliveira',
    progress: 0,
    status: 'not-started',
    department: 'Consultoria',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    deadline: '2024-05-01',
    priority: 'low',
    client: 'Holding Patrimonial',
    createdAt: '2024-03-25',
    createdBy: 'Administrador',
    quantity: 1,
    lastEditedBy: 'Administrador',
  },
  {
    id: '7',
    activity: 'Retificação SPED - 2023',
    responsible: 'Maria Silva',
    progress: 0,
    status: 'cancelled',
    department: 'Fiscal',
    startDate: '2024-02-10',
    endDate: '2024-02-28',
    deadline: '2024-03-01',
    priority: 'low',
    client: 'Cliente Cancelado',
    createdAt: '2024-02-10',
    createdBy: 'Administrador',
    quantity: 1,
    lastEditedBy: 'Administrador',
  },
  {
    id: '8',
    activity: 'Lucro Real - Apuração Trimestral',
    responsible: 'João Santos',
    progress: 60,
    status: 'in-progress',
    department: 'Contábil',
    startDate: '2024-03-05',
    endDate: '2024-03-25',
    deadline: '2024-03-30',
    priority: 'high',
    client: 'Indústria XYZ S.A.',
    createdAt: '2024-03-05',
    createdBy: 'Administrador',
    quantity: 1,
    lastEditedBy: 'João Santos',
  },
];

export const getStatusLabel = (status: ActivityStatus): string => {
  const labels: Record<ActivityStatus, string> = {
    'finished': 'Finalizado',
    'in-progress': 'Em andamento',
    'waiting': 'Em espera',
    'not-started': 'Não começou',
    'cancelled': 'Cancelado',
  };
  return labels[status];
};

export const getPriorityLabel = (priority: Priority): string => {
  const labels: Record<Priority, string> = {
    'high': 'Alta',
    'medium': 'Média',
    'low': 'Baixa',
  };
  return labels[priority];
};
