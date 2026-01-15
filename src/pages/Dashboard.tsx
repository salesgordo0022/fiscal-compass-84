import React from 'react';
import TopBar from '@/components/layout/TopBar';
import PageDescription from '@/components/layout/PageDescription';
import StatsCards from '@/components/dashboard/StatsCards';
import DonutChart from '@/components/dashboard/DonutChart';
import BarChartComponent from '@/components/dashboard/BarChartComponent';
import ActivitiesTable from '@/components/dashboard/ActivitiesTable';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen">
      <TopBar title="Dashboard" subtitle="Contábil" />
      <PageDescription description="Visão geral do sistema contábil. Acompanhe o status das atividades, métricas de desempenho e indicadores de produtividade em tempo real." />
      
      <div className="p-6 space-y-6 animate-fade-in">
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DonutChart />
          <BarChartComponent />
        </div>
        
        <ActivitiesTable />
      </div>
    </div>
  );
};

export default Dashboard;
