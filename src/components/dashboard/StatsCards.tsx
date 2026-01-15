import React from 'react';
import { Activity, CheckCircle, Clock, Users } from 'lucide-react';
import { summaryStats } from '@/mocks/dashboard';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="data-card flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
        <Icon className="w-6 h-6 text-foreground" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
};

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total de Atividades" 
        value={summaryStats.totalActivities}
        icon={Activity}
      />
      <StatCard 
        title="Finalizadas" 
        value={summaryStats.finished}
        icon={CheckCircle}
        description={`${Math.round((summaryStats.finished / summaryStats.totalActivities) * 100)}% do total`}
      />
      <StatCard 
        title="Em Andamento" 
        value={summaryStats.inProgress}
        icon={Clock}
      />
      <StatCard 
        title="Clientes Ativos" 
        value={summaryStats.activeClients}
        icon={Users}
        description={`de ${summaryStats.totalClients} cadastrados`}
      />
    </div>
  );
};

export default StatsCards;
