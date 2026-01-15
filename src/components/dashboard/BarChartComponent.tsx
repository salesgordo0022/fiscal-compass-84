import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { barChartData } from '@/mocks/dashboard';

const BarChartComponent: React.FC = () => {
  return (
    <div className="data-card">
      <h3 className="text-lg font-semibold mb-4">Atividades por Departamento</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="category" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend 
              formatter={(value) => {
                const labels: Record<string, string> = {
                  finished: 'Finalizado',
                  inProgress: 'Em andamento',
                  waiting: 'Em espera',
                  notStarted: 'Não começou',
                  cancelled: 'Cancelado'
                };
                return <span className="text-sm">{labels[value] || value}</span>;
              }}
            />
            <Bar dataKey="finished" fill="hsl(142, 50%, 45%)" name="finished" radius={[2, 2, 0, 0]} />
            <Bar dataKey="inProgress" fill="hsl(199, 70%, 50%)" name="inProgress" radius={[2, 2, 0, 0]} />
            <Bar dataKey="waiting" fill="hsl(45, 80%, 50%)" name="waiting" radius={[2, 2, 0, 0]} />
            <Bar dataKey="notStarted" fill="hsl(0, 0%, 65%)" name="notStarted" radius={[2, 2, 0, 0]} />
            <Bar dataKey="cancelled" fill="hsl(0, 60%, 50%)" name="cancelled" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
