import React from 'react';
import TopBar from '@/components/layout/TopBar';
import PageDescription from '@/components/layout/PageDescription';
import { categorizedLists } from '@/mocks/lists';
import CategoryListCard from '@/components/lists/CategoryListCard';

const LucroPresumido: React.FC = () => {
  const simplesList = categorizedLists.find(list => list.id === '3');

  const stats = [
    { label: 'Empresas no Lucro Presumido', value: 85 },
    { label: 'DARFs Gerados este mês', value: 340 },
    { label: 'Taxa de Adimplência', value: '94%' },
  ];

  return (
    <div className="min-h-screen">
      <TopBar title="Lucro Presumido" subtitle="Contábil" />
      <PageDescription description="Controle de empresas optantes pelo Lucro Presumido. Gestão de presunção de lucro, cálculo simplificado de IRPJ/CSLL e acompanhamento de obrigações tributárias." />
      
      <div className="p-6 animate-fade-in space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="data-card text-center">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {simplesList && <CategoryListCard category={simplesList} />}
          
          <div className="data-card">
            <h3 className="text-lg font-semibold mb-4">Alíquotas de Presunção</h3>
            <div className="space-y-3">
              {[
                { tipo: 'Comércio', percentual: '8%' },
                { tipo: 'Serviços em geral', percentual: '32%' },
                { tipo: 'Transporte de cargas', percentual: '8%' },
                { tipo: 'Serviços hospitalares', percentual: '8%' },
                { tipo: 'Revenda de combustíveis', percentual: '1,6%' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span>{item.tipo}</span>
                  <span className="font-bold">{item.percentual}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LucroPresumido;
