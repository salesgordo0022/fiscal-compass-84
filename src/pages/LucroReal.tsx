import React from 'react';
import TopBar from '@/components/layout/TopBar';
import PageDescription from '@/components/layout/PageDescription';
import { mockActivities } from '@/mocks/activities';
import ActivitiesTable from '@/components/dashboard/ActivitiesTable';

const LucroReal: React.FC = () => {
  const lucroRealStats = [
    { label: 'Empresas no Lucro Real', value: 28 },
    { label: 'Apurações Trimestrais', value: 112 },
    { label: 'Em dia', value: '89%' },
  ];

  return (
    <div className="min-h-screen">
      <TopBar title="Lucro Real" subtitle="Contábil" />
      <PageDescription description="Gestão de empresas tributadas pelo Lucro Real. Controle de apurações trimestrais ou anuais de IRPJ e CSLL, com acompanhamento de adições, exclusões e compensações." />
      
      <div className="p-6 animate-fade-in space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lucroRealStats.map((stat, index) => (
            <div key={index} className="data-card text-center">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="data-card">
          <h3 className="text-lg font-semibold mb-4">Calendário de Apurações</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['1º Trimestre', '2º Trimestre', '3º Trimestre', '4º Trimestre'].map((trimestre, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="font-medium">{trimestre}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {idx === 0 ? 'Finalizado' : idx === 1 ? 'Em andamento' : 'Pendente'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <ActivitiesTable />
      </div>
    </div>
  );
};

export default LucroReal;
