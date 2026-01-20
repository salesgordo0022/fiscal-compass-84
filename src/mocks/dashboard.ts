export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface BarChartData {
  category: string;
  finished: number;
  inProgress: number;
  waiting: number;
  notStarted: number;
  cancelled: number;
}

export const donutChartData: ChartData[] = [
  { name: 'Finalizado', value: 0, color: 'hsl(142, 50%, 45%)' },
  { name: 'Em andamento', value: 0, color: 'hsl(199, 70%, 50%)' },
  { name: 'Não começou', value: 0, color: 'hsl(0, 0%, 65%)' },
];

export const barChartData: BarChartData[] = [
  {
    category: 'Contábil',
    finished: 0,
    inProgress: 0,
    waiting: 0,
    notStarted: 0,
    cancelled: 0,
  },
  {
    category: 'Fiscal',
    finished: 0,
    inProgress: 0,
    waiting: 0,
    notStarted: 0,
    cancelled: 0,
  },
  {
    category: 'Pessoal',
    finished: 0,
    inProgress: 0,
    waiting: 0,
    notStarted: 0,
    cancelled: 0,
  },
  {
    category: 'Societário',
    finished: 0,
    inProgress: 0,
    waiting: 0,
    notStarted: 0,
    cancelled: 0,
  },
  {
    category: 'Consultoria',
    finished: 0,
    inProgress: 0,
    waiting: 0,
    notStarted: 0,
    cancelled: 0,
  },
];

export const summaryStats = {
  totalActivities: 0,
  finished: 0,
  inProgress: 0,
  pending: 0,
  totalClients: 0,
  activeClients: 0,
};
