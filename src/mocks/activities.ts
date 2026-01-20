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

export const mockActivities: Activity[] = [];

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
