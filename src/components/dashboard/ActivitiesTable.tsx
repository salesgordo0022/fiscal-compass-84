import React from 'react';
import { mockActivities, getStatusLabel, getPriorityLabel, ActivityStatus, Priority } from '@/mocks/activities';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ColumnFilterInput, useColumnFilters } from '@/components/ui/column-filter';

const StatusBadge: React.FC<{ status: ActivityStatus }> = ({ status }) => {
  const statusClasses: Record<ActivityStatus, string> = {
    'finished': 'status-finished',
    'in-progress': 'status-in-progress',
    'waiting': 'status-waiting',
    'not-started': 'status-not-started',
    'cancelled': 'status-cancelled',
  };

  return (
    <span className={cn('status-badge', statusClasses[status])}>
      {getStatusLabel(status)}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const priorityClasses: Record<Priority, string> = {
    'high': 'bg-destructive/15 text-destructive',
    'medium': 'bg-warning/15 text-warning',
    'low': 'bg-muted text-muted-foreground',
  };

  return (
    <span className={cn('status-badge', priorityClasses[priority])}>
      {getPriorityLabel(priority)}
    </span>
  );
};

const ActivitiesTable: React.FC = () => {
  return (
    <div className="data-card overflow-hidden p-0">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">Atividades Recentes</h3>
        <p className="text-sm text-muted-foreground">Lista completa de atividades do sistema</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Atividade</TableHead>
              <TableHead className="font-semibold">Responsável</TableHead>
              <TableHead className="font-semibold">Progresso</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Departamento</TableHead>
              <TableHead className="font-semibold">Prazo</TableHead>
              <TableHead className="font-semibold">Prioridade</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockActivities.map((activity) => (
              <TableRow key={activity.id} className="hover:bg-muted/30">
                <TableCell className="font-medium max-w-[250px]">
                  <span className="truncate block" title={activity.activity}>
                    {activity.activity}
                  </span>
                </TableCell>
                <TableCell>{activity.responsible}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Progress value={activity.progress} className="h-2 w-16" />
                    <span className="text-xs text-muted-foreground">{activity.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={activity.status} />
                </TableCell>
                <TableCell>{activity.department}</TableCell>
                <TableCell className="text-sm">
                  {new Date(activity.deadline).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={activity.priority} />
                </TableCell>
                <TableCell className="max-w-[150px]">
                  <span className="truncate block" title={activity.client}>
                    {activity.client}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActivitiesTable;
