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
  { name: 'Finalizado', value: 45, color: 'hsl(142, 50%, 45%)' },
  { name: 'Em andamento', value: 30, color: 'hsl(199, 70%, 50%)' },
  { name: 'Não começou', value: 25, color: 'hsl(0, 0%, 65%)' },
];

export const barChartData: BarChartData[] = [
  {
    category: 'Contábil',
    finished: 25,
    inProgress: 15,
    waiting: 5,
    notStarted: 10,
    cancelled: 2,
  },
  {
    category: 'Fiscal',
    finished: 18,
    inProgress: 12,
    waiting: 8,
    notStarted: 6,
    cancelled: 1,
  },
  {
    category: 'Pessoal',
    finished: 30,
    inProgress: 8,
    waiting: 3,
    notStarted: 4,
    cancelled: 0,
  },
  {
    category: 'Societário',
    finished: 10,
    inProgress: 5,
    waiting: 7,
    notStarted: 3,
    cancelled: 1,
  },
  {
    category: 'Consultoria',
    finished: 8,
    inProgress: 10,
    waiting: 4,
    notStarted: 6,
    cancelled: 2,
  },
];

export const summaryStats = {
  totalActivities: 157,
  finished: 91,
  inProgress: 50,
  pending: 16,
  totalClients: 48,
  activeClients: 42,
};
