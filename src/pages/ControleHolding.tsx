import React, { useState } from 'react';
import { ColumnFilterInput, useColumnFilters } from '@/components/ui/column-filter';
import { Plus, Grid3X3, SquarePen, Trash2, ListChecks, MessageSquare, Eye, Calendar as CalendarIcon, Kanban, Bell, BellRing, UserMinus } from 'lucide-react';
import AddEntityDialog from '@/components/dialogs/AddEntityDialog';
import DeleteConfirmDialog from '@/components/dialogs/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TopBar from '@/components/layout/TopBar';
import PageDescription from '@/components/layout/PageDescription';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  tarefasHolding, 
  statusColors, 
  enquadramentoOptions, 
  cnpjColorOptions,
  type TarefaHolding, 
  type StatusTarefa 
} from '@/mocks/controleHolding';
import { toast } from 'sonner';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Format date to d/MM/yyyy pattern
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  
  const monthMap: { [key: string]: string } = {
    'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
    'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
    'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
  };
  
  const match = dateStr.match(/(\d{1,2}) de (\w+) de (\d{4})/);
  if (match) {
    const day = match[1];
    const month = monthMap[match[2].toLowerCase()] || '01';
    const year = match[3];
    return `${day}/${month}/${year}`;
  }
  
  return dateStr;
};

// Parse date string to Date object
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  const monthMap: { [key: string]: number } = {
    'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
    'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
    'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
  };
  
  const match = dateStr.match(/(\d{1,2}) de (\w+) de (\d{4})/);
  if (match) {
    const day = parseInt(match[1]);
    const month = monthMap[match[2].toLowerCase()];
    const year = parseInt(match[3]);
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }
  
  return null;
};

// Status Badge Component
const StatusBadge: React.FC<{ status: StatusTarefa }> = ({ status }) => {
  const config = statusColors[status];
  return (
    <Badge className={`${config.bg} ${config.text} hover:opacity-90 border-0 font-normal text-xs`}>
      {config.label}
    </Badge>
  );
};

// Enquadramento Badge Component
const EnquadramentoBadge: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <span className="text-sm text-muted-foreground">-</span>;
  
  const option = enquadramentoOptions.find(o => o.value === value);
  if (!option) return <span className="text-sm">{value}</span>;
  
  return (
    <Badge className={`bg-purple-100 text-purple-700 hover:bg-purple-100 border-0 font-normal text-xs`}>
      {option.label}
    </Badge>
  );
};

interface Anotacao {
  id: string;
  texto: string;
  data: string;
}

interface ChecklistItem {
  id: string;
  texto: string;
  concluido: boolean;
}

interface TarefaSavedData {
  checklistItems: ChecklistItem[];
  anotacoes: Anotacao[];
  empresa: string;
  cnpj: string;
  cnpjColor: string;
  enquadramento: string;
  status: StatusTarefa;
  descricao: string;
  dataCriacao: string;
}

interface TarefaEditState {
  checklistItems: ChecklistItem[];
  novoChecklistItem: string;
  anotacoes: Anotacao[];
  novaAnotacao: string;
  editingAnotacaoId: string | null;
  editingAnotacaoTexto: string;
  empresa: string;
  cnpj: string;
  cnpjColor: string;
  enquadramento: string;
  status: StatusTarefa;
  descricao: string;
  dataCriacao: string;
}

interface TarefasTableProps {
  tarefas: TarefaHolding[];
  onTarefaClick: (tarefa: TarefaHolding) => void;
  savedDataMap: Record<string, TarefaSavedData>;
  onStatusChange: (tarefaId: string, newStatus: StatusTarefa) => void;
}

const TarefasTable: React.FC<TarefasTableProps> = ({ tarefas, onTarefaClick, savedDataMap, onStatusChange }) => {
  const getTarefaData = (tarefa: TarefaHolding) => {
    const saved = savedDataMap[tarefa.id];
    if (saved) {
      return {
        empresa: saved.empresa,
        cnpj: saved.cnpj,
        cnpjColor: saved.cnpjColor,
        enquadramento: saved.enquadramento,
        status: saved.status,
        descricao: saved.descricao,
        dataCriacao: saved.dataCriacao,
        anotacoes: saved.anotacoes,
        checklistItems: saved.checklistItems,
      };
    }
    return {
      empresa: tarefa.empresa,
      cnpj: tarefa.cnpj,
      cnpjColor: tarefa.cnpjColor,
      enquadramento: tarefa.enquadramento,
      status: tarefa.status,
      descricao: tarefa.descricao,
      dataCriacao: tarefa.dataCriacao,
      anotacoes: tarefa.descricao ? [{ id: '1', texto: tarefa.descricao, data: new Date().toLocaleDateString('pt-BR') }] : [],
      checklistItems: [
        { id: '1', texto: 'Verificar documentação', concluido: false },
        { id: '2', texto: 'Analisar estrutura', concluido: false },
        { id: '3', texto: 'Validar informações', concluido: false },
      ],
    };
  };

  const calculateSavedProgress = (tarefa: TarefaHolding) => {
    const data = getTarefaData(tarefa);
    if (data.checklistItems.length === 0) return 0;
    const completed = data.checklistItems.filter(item => item.concluido).length;
    return (completed / data.checklistItems.length) * 100;
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[250px]">Tarefa (Empresa)</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[160px]">CNPJ</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[120px]">Status</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[160px]">Enquadramento</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[80px] text-center">Anotações</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[120px] text-center">Data de Criação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tarefas.map((tarefa) => {
            const tarefaData = getTarefaData(tarefa);
            const savedProgress = calculateSavedProgress(tarefa);
            const progressColorClass = savedProgress >= 80 ? 'bg-green-500' : savedProgress >= 40 ? 'bg-yellow-500' : 'bg-red-500';
            
            return (
              <TableRow 
                key={tarefa.id} 
                className="border-b border-border hover:bg-muted/20"
              >
                <TableCell 
                  className="py-2 text-sm font-medium text-primary hover:underline cursor-pointer"
                  onClick={() => onTarefaClick(tarefa)}
                >
                  {tarefaData.empresa}
                </TableCell>
                <TableCell className="py-2">
                  <span className={`text-sm font-medium ${tarefaData.cnpjColor}`}>{tarefaData.cnpj}</span>
                </TableCell>
                <TableCell className="py-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="cursor-pointer">
                        <StatusBadge status={tarefaData.status} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="start">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground mb-2 font-medium">Alterar status:</p>
                        {Object.entries(statusColors).map(([key, config]) => (
                          <button
                            key={key}
                            className={`w-full text-left px-2 py-1.5 rounded text-sm hover:bg-muted/50 transition-colors flex items-center gap-2 ${
                              tarefaData.status === key ? 'bg-muted' : ''
                            }`}
                            onClick={() => onStatusChange(tarefa.id, key as StatusTarefa)}
                          >
                            <div className={`w-2 h-2 rounded-full ${config.bg.replace('bg-', 'bg-').replace('-100', '-500')}`} />
                            <span className={config.text}>{config.label}</span>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="py-2">
                  <EnquadramentoBadge value={tarefaData.enquadramento} />
                </TableCell>
                <TableCell className="py-2 text-center">
                  {tarefaData.anotacoes.length > 0 ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-1 hover:bg-muted rounded">
                          <MessageSquare className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Anotação</h4>
                          <p className="text-sm text-muted-foreground">
                            {tarefaData.anotacoes.map(a => a.texto).join(' | ')}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="py-2 text-sm text-center">{formatDate(tarefaData.dataCriacao)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

// Kanban Board Component
interface KanbanBoardProps {
  tarefas: TarefaHolding[];
  savedDataMap: Record<string, TarefaSavedData>;
  onStatusChange: (tarefaId: string, newStatus: StatusTarefa) => void;
  onAddTarefa: (status: StatusTarefa, empresa: string, cnpj: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tarefas, savedDataMap, onStatusChange, onAddTarefa }) => {
  const [draggedTarefaId, setDraggedTarefaId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<StatusTarefa | null>(null);
  const [addingToStatus, setAddingToStatus] = useState<StatusTarefa | null>(null);
  const [newEmpresa, setNewEmpresa] = useState('');
  const [newCnpj, setNewCnpj] = useState('');
  
  const statuses: StatusTarefa[] = ['a_fazer', 'em_andamento', 'em_revisao', 'concluida', 'cancelada'];
  
  const getTarefasByStatus = (status: StatusTarefa) => {
    return tarefas.filter(tarefa => {
      const saved = savedDataMap[tarefa.id];
      return (saved?.status || tarefa.status) === status;
    });
  };

  const handleDragStart = (e: React.DragEvent, tarefaId: string) => {
    setDraggedTarefaId(tarefaId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tarefaId);
  };

  const handleDragEnd = () => {
    setDraggedTarefaId(null);
    setDragOverStatus(null);
  };

  const handleDragOver = (e: React.DragEvent, status: StatusTarefa) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatus(status);
  };

  const handleDragLeave = () => {
    setDragOverStatus(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: StatusTarefa) => {
    e.preventDefault();
    const tarefaId = e.dataTransfer.getData('text/plain');
    if (tarefaId) {
      onStatusChange(tarefaId, newStatus);
    }
    setDraggedTarefaId(null);
    setDragOverStatus(null);
  };

  const handleAddCard = () => {
    if (addingToStatus && newEmpresa.trim()) {
      onAddTarefa(addingToStatus, newEmpresa.trim(), newCnpj.trim());
      setNewEmpresa('');
      setNewCnpj('');
      setAddingToStatus(null);
    }
  };

  const handleCloseDialog = () => {
    setAddingToStatus(null);
    setNewEmpresa('');
    setNewCnpj('');
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-4 min-h-[500px]">
        {statuses.map((status) => {
          const config = statusColors[status];
          const tarefasStatus = getTarefasByStatus(status);
          const isDropTarget = dragOverStatus === status;
          
          return (
            <div key={status} className="flex flex-col">
              <div className={`p-3 rounded-t-lg ${config.bg} border border-b-0 border-border`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="h-5 min-w-[20px] justify-center text-xs">
                      {tarefasStatus.length}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 hover:bg-background/50"
                      onClick={() => setAddingToStatus(status)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div 
                className={`flex-1 p-2 border border-t-0 border-border rounded-b-lg space-y-2 overflow-y-auto max-h-[450px] transition-colors ${
                  isDropTarget ? 'bg-primary/10 border-primary' : 'bg-muted/30'
                }`}
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
              >
                {tarefasStatus.map((tarefa) => {
                  const saved = savedDataMap[tarefa.id];
                  const empresa = saved?.empresa || tarefa.empresa;
                  const isDragging = draggedTarefaId === tarefa.id;
                  
                  return (
                    <div 
                      key={tarefa.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, tarefa.id)}
                      onDragEnd={handleDragEnd}
                      className={`p-3 bg-background border border-border rounded-md shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
                        isDragging ? 'opacity-50 scale-95' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground line-clamp-2">{empresa}</p>
                      <p className={`text-xs mt-1 ${saved?.cnpjColor || tarefa.cnpjColor}`}>
                        {saved?.cnpj || tarefa.cnpj}
                      </p>
                    </div>
                  );
                })}
                {tarefasStatus.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-muted-foreground text-xs">
                    {isDropTarget ? 'Solte aqui' : 'Nenhuma tarefa'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={addingToStatus !== null} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Novo Card - {addingToStatus && statusColors[addingToStatus].label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="new-empresa">Empresa *</Label>
              <Input 
                id="new-empresa"
                placeholder="Nome da empresa"
                value={newEmpresa}
                onChange={(e) => setNewEmpresa(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-cnpj">CNPJ</Label>
              <Input 
                id="new-cnpj"
                placeholder="00.000.000/0000-00"
                value={newCnpj}
                onChange={(e) => setNewCnpj(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleAddCard} disabled={!newEmpresa.trim()}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Calendar Event Interface
interface CalendarEvent {
  id: string;
  titulo: string;
  descricao: string;
  data: Date;
  lembrete: boolean;
  lembreteMinutos: number;
  tipo: 'tarefa' | 'evento';
  tarefaId?: string;
  cor?: string;
}

// Event color options
const eventColorOptions = [
  { value: 'bg-blue-100 text-blue-700', label: 'Azul', preview: 'bg-blue-500' },
  { value: 'bg-green-100 text-green-700', label: 'Verde', preview: 'bg-green-500' },
  { value: 'bg-yellow-100 text-yellow-700', label: 'Amarelo', preview: 'bg-yellow-500' },
  { value: 'bg-red-100 text-red-700', label: 'Vermelho', preview: 'bg-red-500' },
  { value: 'bg-purple-100 text-purple-700', label: 'Roxo', preview: 'bg-purple-500' },
  { value: 'bg-pink-100 text-pink-700', label: 'Rosa', preview: 'bg-pink-500' },
  { value: 'bg-orange-100 text-orange-700', label: 'Laranja', preview: 'bg-orange-500' },
  { value: 'bg-teal-100 text-teal-700', label: 'Verde-água', preview: 'bg-teal-500' },
];

// Calendar View Component
interface CalendarViewProps {
  tarefas: TarefaHolding[];
  savedDataMap: Record<string, TarefaSavedData>;
  onAddTarefa: (status: StatusTarefa, empresa: string, cnpj: string, dataCriacao?: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tarefas, savedDataMap, onAddTarefa }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTarefa, setSelectedTarefa] = useState<TarefaHolding | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  // New event form state
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescricao, setNewEventDescricao] = useState('');
  const [newEventTipo, setNewEventTipo] = useState<'tarefa' | 'evento'>('evento');
  const [newEventLembrete, setNewEventLembrete] = useState(false);
  const [newEventLembreteMinutos, setNewEventLembreteMinutos] = useState(30);
  const [newEventCor, setNewEventCor] = useState('bg-blue-100 text-blue-700');
  
  const getTarefasByDate = (date: Date) => {
    return tarefas.filter(tarefa => {
      const saved = savedDataMap[tarefa.id];
      const dateStr = saved?.dataCriacao || tarefa.dataCriacao;
      const tarefaDate = parseDate(dateStr);
      return tarefaDate && isSameDay(tarefaDate, date);
    });
  };

  const getEventsByDate = (date: Date) => {
    return events.filter(event => isSameDay(event.data, date));
  };

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const firstDayOffset = start.getDay();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const handleTarefaClick = (tarefa: TarefaHolding) => {
    setSelectedTarefa(tarefa);
    setModalOpen(true);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setAddEventOpen(true);
    setNewEventTitle('');
    setNewEventDescricao('');
    setNewEventTipo('evento');
    setNewEventLembrete(false);
    setNewEventLembreteMinutos(30);
    setNewEventCor('bg-blue-100 text-blue-700');
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEventTitle.trim()) return;

    if (newEventTipo === 'tarefa') {
      const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      const dataCriacao = `${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]} de ${selectedDate.getFullYear()}`;
      onAddTarefa('a_fazer', newEventTitle.trim(), '', dataCriacao);
    } else {
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}`,
        titulo: newEventTitle.trim(),
        descricao: newEventDescricao,
        data: selectedDate,
        lembrete: newEventLembrete,
        lembreteMinutos: newEventLembreteMinutos,
        tipo: 'evento',
        cor: newEventCor,
      };
      setEvents(prev => [...prev, newEvent]);
    }

    if (newEventLembrete) {
      toast.success(`Lembrete ativado para ${newEventLembreteMinutos} minutos antes!`);
    }
    
    toast.success(`${newEventTipo === 'tarefa' ? 'Tarefa' : 'Evento'} adicionado com sucesso!`);
    setAddEventOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    toast.success('Evento removido!');
  };

  const getTarefaData = (tarefa: TarefaHolding) => {
    const saved = savedDataMap[tarefa.id];
    if (saved) return saved;
    return {
      empresa: tarefa.empresa,
      cnpj: tarefa.cnpj,
      cnpjColor: tarefa.cnpjColor,
      enquadramento: tarefa.enquadramento,
      status: tarefa.status,
      descricao: tarefa.descricao,
      dataCriacao: tarefa.dataCriacao,
    };
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            Anterior
          </Button>
          <h3 className="text-lg font-medium">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            Próximo
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-b">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] p-1 border border-border/50 bg-muted/20" />
          ))}
          
          {days.map((day) => {
            const dayTarefas = getTarefasByDate(day);
            const dayEvents = getEventsByDate(day);
            const isToday = isSameDay(day, new Date());
            const allItems = [...dayTarefas.map(t => ({ type: 'tarefa' as const, item: t })), ...dayEvents.map(e => ({ type: 'evento' as const, item: e }))];
            
            return (
              <div 
                key={day.toISOString()} 
                className={`min-h-[100px] p-1 border border-border cursor-pointer hover:bg-muted/30 transition-colors ${isToday ? 'bg-primary/5 border-primary' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {format(day, 'd')}
                  </span>
                  <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleDayClick(day); }}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {allItems.slice(0, 3).map((entry, idx) => {
                    if (entry.type === 'tarefa') {
                      const tarefa = entry.item as TarefaHolding;
                      const saved = savedDataMap[tarefa.id];
                      const status = saved?.status || tarefa.status;
                      const config = statusColors[status];
                      
                      return (
                        <div 
                          key={tarefa.id}
                          className={`p-1 rounded text-xs truncate cursor-pointer ${config.bg} ${config.text} flex items-center gap-1`}
                          onClick={(e) => { e.stopPropagation(); handleTarefaClick(tarefa); }}
                          title={saved?.empresa || tarefa.empresa}
                        >
                          {saved?.empresa || tarefa.empresa}
                        </div>
                      );
                    } else {
                      const event = entry.item as CalendarEvent;
                      return (
                        <div 
                          key={event.id}
                          className={`p-1 rounded text-xs truncate cursor-pointer flex items-center gap-1 ${event.cor || 'bg-blue-100 text-blue-700'}`}
                          onClick={(e) => e.stopPropagation()}
                          title={event.titulo}
                        >
                          {event.lembrete && <BellRing className="h-3 w-3 shrink-0" />}
                          {event.titulo}
                        </div>
                      );
                    }
                  })}
                  {allItems.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{allItems.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de visualização de tarefa */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTarefa && getTarefaData(selectedTarefa).empresa}</DialogTitle>
          </DialogHeader>
          {selectedTarefa && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">CNPJ</Label>
                  <p className={`text-sm font-medium ${getTarefaData(selectedTarefa).cnpjColor}`}>
                    {getTarefaData(selectedTarefa).cnpj}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={getTarefaData(selectedTarefa).status} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Enquadramento</Label>
                  <div className="mt-1">
                    <EnquadramentoBadge value={getTarefaData(selectedTarefa).enquadramento} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Data de Criação</Label>
                  <p className="text-sm">{formatDate(getTarefaData(selectedTarefa).dataCriacao)}</p>
                </div>
              </div>
              {getTarefaData(selectedTarefa).descricao && (
                <div>
                  <Label className="text-xs text-muted-foreground">Descrição</Label>
                  <p className="text-sm mt-1">{getTarefaData(selectedTarefa).descricao}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de adicionar evento/tarefa */}
      <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              Adicionar em {selectedDate && format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={newEventTipo} onValueChange={(v) => setNewEventTipo(v as 'tarefa' | 'evento')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="tarefa">Tarefa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{newEventTipo === 'tarefa' ? 'Nome da Empresa' : 'Título do Evento'}</Label>
              <Input 
                placeholder={newEventTipo === 'tarefa' ? 'Nome da empresa...' : 'Título...'}
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
            </div>
            
            {newEventTipo === 'evento' && (
              <>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea 
                    placeholder="Descrição do evento..."
                    value={newEventDescricao}
                    onChange={(e) => setNewEventDescricao(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Cor</Label>
                  <div className="flex flex-wrap gap-2">
                    {eventColorOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`w-8 h-8 rounded-full ${option.preview} transition-all ${
                          newEventCor === option.value 
                            ? 'ring-2 ring-offset-2 ring-primary scale-110' 
                            : 'hover:scale-105'
                        }`}
                        onClick={() => setNewEventCor(option.value)}
                        title={option.label}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label>Ativar Lembrete</Label>
                </div>
                <Checkbox 
                  checked={newEventLembrete}
                  onCheckedChange={(checked) => setNewEventLembrete(checked as boolean)}
                />
              </div>
              
              {newEventLembrete && (
                <div className="space-y-2 pl-6">
                  <Label className="text-sm">Lembrar antes de</Label>
                  <Select value={String(newEventLembreteMinutos)} onValueChange={(v) => setNewEventLembreteMinutos(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="1440">1 dia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddEventOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddEvent} disabled={!newEventTitle.trim()}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ControleHolding: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tabela-completa');
  const [selectedTarefa, setSelectedTarefa] = useState<TarefaHolding | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [savedDataMap, setSavedDataMap] = useState<Record<string, TarefaSavedData>>({});

  const [editState, setEditState] = useState<TarefaEditState>({
    checklistItems: [],
    novoChecklistItem: '',
    anotacoes: [],
    novaAnotacao: '',
    editingAnotacaoId: null,
    editingAnotacaoTexto: '',
    empresa: '',
    cnpj: '',
    cnpjColor: 'text-blue-600',
    enquadramento: '',
    status: 'a_fazer',
    descricao: '',
    dataCriacao: '',
  });

  const handleTarefaClick = (tarefa: TarefaHolding) => {
    setSelectedTarefa(tarefa);
    
    const savedData = savedDataMap[tarefa.id];
    
    if (savedData) {
      setEditState({
        checklistItems: savedData.checklistItems,
        novoChecklistItem: '',
        anotacoes: savedData.anotacoes,
        novaAnotacao: '',
        editingAnotacaoId: null,
        editingAnotacaoTexto: '',
        empresa: savedData.empresa,
        cnpj: savedData.cnpj,
        cnpjColor: savedData.cnpjColor,
        enquadramento: savedData.enquadramento,
        status: savedData.status,
        descricao: savedData.descricao,
        dataCriacao: savedData.dataCriacao,
      });
    } else {
      const existingAnotacoes: Anotacao[] = tarefa.descricao 
        ? [{ id: '1', texto: tarefa.descricao, data: new Date().toLocaleDateString('pt-BR') }]
        : [];
      
      const defaultChecklist: ChecklistItem[] = [
        { id: '1', texto: 'Verificar documentação', concluido: false },
        { id: '2', texto: 'Analisar estrutura', concluido: false },
        { id: '3', texto: 'Validar informações', concluido: false },
      ];
      
      setEditState({
        checklistItems: defaultChecklist,
        novoChecklistItem: '',
        anotacoes: existingAnotacoes,
        novaAnotacao: '',
        editingAnotacaoId: null,
        editingAnotacaoTexto: '',
        empresa: tarefa.empresa,
        cnpj: tarefa.cnpj,
        cnpjColor: tarefa.cnpjColor,
        enquadramento: tarefa.enquadramento,
        status: tarefa.status,
        descricao: tarefa.descricao,
        dataCriacao: tarefa.dataCriacao,
      });
    }
    setSheetOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedTarefa) return;
    
    let anotacoesFinais = editState.anotacoes;
    if (editState.novaAnotacao.trim()) {
      const newAnotacao: Anotacao = {
        id: Date.now().toString(),
        texto: editState.novaAnotacao,
        data: new Date().toLocaleDateString('pt-BR'),
      };
      anotacoesFinais = [...editState.anotacoes, newAnotacao];
    }
    
    setSavedDataMap(prev => ({
      ...prev,
      [selectedTarefa.id]: {
        checklistItems: editState.checklistItems,
        anotacoes: anotacoesFinais,
        empresa: editState.empresa,
        cnpj: editState.cnpj,
        cnpjColor: editState.cnpjColor,
        enquadramento: editState.enquadramento,
        status: editState.status,
        descricao: editState.descricao,
        dataCriacao: editState.dataCriacao,
      }
    }));
    
    setEditState(prev => ({ ...prev, novaAnotacao: '' }));
    setSheetOpen(false);
    toast.success('Alterações salvas com sucesso!');
  };

  const handleChecklistToggle = (id: string) => {
    setEditState(prev => ({
      ...prev,
      checklistItems: prev.checklistItems.map(item =>
        item.id === id ? { ...item, concluido: !item.concluido } : item
      ),
    }));
  };

  const handleAddChecklistItem = () => {
    if (!editState.novoChecklistItem.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      texto: editState.novoChecklistItem,
      concluido: false,
    };
    
    setEditState(prev => ({
      ...prev,
      checklistItems: [...prev.checklistItems, newItem],
      novoChecklistItem: '',
    }));
  };

  const handleDeleteChecklistItem = (id: string) => {
    setEditState(prev => ({
      ...prev,
      checklistItems: prev.checklistItems.filter(item => item.id !== id),
    }));
  };

  const handleDeleteAnotacao = (id: string) => {
    setEditState(prev => ({
      ...prev,
      anotacoes: prev.anotacoes.filter(a => a.id !== id),
    }));
  };

  const handleStartEditAnotacao = (anotacao: Anotacao) => {
    setEditState(prev => ({
      ...prev,
      editingAnotacaoId: anotacao.id,
      editingAnotacaoTexto: anotacao.texto,
    }));
  };

  const handleSaveEditAnotacao = () => {
    if (!editState.editingAnotacaoId) return;
    
    setEditState(prev => ({
      ...prev,
      anotacoes: prev.anotacoes.map(a => 
        a.id === prev.editingAnotacaoId 
          ? { ...a, texto: prev.editingAnotacaoTexto }
          : a
      ),
      editingAnotacaoId: null,
      editingAnotacaoTexto: '',
    }));
  };

  const handleCancelEditAnotacao = () => {
    setEditState(prev => ({
      ...prev,
      editingAnotacaoId: null,
      editingAnotacaoTexto: '',
    }));
  };

  const handleStatusChange = (tarefaId: string, newStatus: StatusTarefa) => {
    setSavedDataMap(prev => {
      const existing = prev[tarefaId];
      const tarefa = tarefasHolding.find(t => t.id === tarefaId);
      if (!tarefa) return prev;
      
      return {
        ...prev,
        [tarefaId]: existing 
          ? { ...existing, status: newStatus }
          : {
              checklistItems: [
                { id: '1', texto: 'Verificar documentação', concluido: false },
                { id: '2', texto: 'Analisar estrutura', concluido: false },
                { id: '3', texto: 'Validar informações', concluido: false },
              ],
              anotacoes: tarefa.descricao ? [{ id: '1', texto: tarefa.descricao, data: new Date().toLocaleDateString('pt-BR') }] : [],
              empresa: tarefa.empresa,
              cnpj: tarefa.cnpj,
              cnpjColor: tarefa.cnpjColor,
              enquadramento: tarefa.enquadramento,
              status: newStatus,
              descricao: tarefa.descricao,
              dataCriacao: tarefa.dataCriacao,
            }
      };
    });
    toast.success('Status atualizado!');
  };

  const handleAddTarefa = (status: StatusTarefa, empresa: string, cnpj: string, dataCriacaoParam?: string) => {
    const newId = `new-${Date.now()}`;
    const now = new Date();
    const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const dataCriacao = dataCriacaoParam || `${now.getDate()} de ${monthNames[now.getMonth()]} de ${now.getFullYear()}`;
    
    // Add to tarefasHolding (simulated - in real app this would be an API call)
    tarefasHolding.push({
      id: newId,
      empresa,
      cnpj: cnpj || '00.000.000/0000-00',
      cnpjColor: 'text-blue-600',
      enquadramento: 'presumido_servico',
      status,
      descricao: '',
      dataCriacao,
    });
    
    // Save initial data
    setSavedDataMap(prev => ({
      ...prev,
      [newId]: {
        checklistItems: [
          { id: '1', texto: 'Verificar documentação', concluido: false },
          { id: '2', texto: 'Analisar estrutura', concluido: false },
          { id: '3', texto: 'Validar informações', concluido: false },
        ],
        anotacoes: [],
        empresa,
        cnpj: cnpj || '00.000.000/0000-00',
        cnpjColor: 'text-blue-600',
        enquadramento: 'presumido_servico',
        status,
        descricao: '',
        dataCriacao,
      }
    }));
    
    toast.success('Card adicionado com sucesso!');
  };

  const calculateEditProgress = (): number => {
    if (editState.checklistItems.length === 0) return 0;
    const completed = editState.checklistItems.filter(item => item.concluido).length;
    return (completed / editState.checklistItems.length) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="CONTROLE DE HOLDING" subtitle="CONTÁBIL" />
      <PageDescription description="Página dedicada ao controle de Holdings: estrutura societária, participações, gestão patrimonial e governança corporativa. Acompanhe integralização de capital e verificações societárias." />

      <div className="px-6 pb-6 pt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
              <TabsTrigger
                value="tabela-completa"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                TABELA COMPLETA
              </TabsTrigger>
              <TabsTrigger
                value="quadro-status"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm"
              >
                <Kanban className="h-4 w-4 mr-2" />
                QUADRO DE STATUS
              </TabsTrigger>
              <TabsTrigger
                value="calendario"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                CALENDÁRIO
              </TabsTrigger>
            </TabsList>
            <AddEntityDialog 
              title="Adicionar Tarefa"
              buttonLabel="Adicionar Tarefa"
              fields={[
                { name: 'empresa', label: 'Nome da Empresa', type: 'text', placeholder: 'Digite o nome da empresa...', required: true },
                { name: 'cnpj', label: 'CNPJ', type: 'text', placeholder: '00.000.000/0000-00' }
              ]}
              onAdd={(data) => {
                handleAddTarefa('a_fazer', data.empresa, data.cnpj || '');
              }}
              trigger={
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Tarefa
                </Button>
              }
            />
          </div>

          <div className="border border-border rounded-sm overflow-hidden">
            <TabsContent value="tabela-completa" className="m-0">
              <TarefasTable tarefas={tarefasHolding} onTarefaClick={handleTarefaClick} savedDataMap={savedDataMap} onStatusChange={handleStatusChange} />
            </TabsContent>
            <TabsContent value="quadro-status" className="m-0 p-4">
              <KanbanBoard tarefas={tarefasHolding} savedDataMap={savedDataMap} onStatusChange={handleStatusChange} onAddTarefa={handleAddTarefa} />
            </TabsContent>
            <TabsContent value="calendario" className="m-0 p-4">
              <CalendarView tarefas={tarefasHolding} savedDataMap={savedDataMap} onAddTarefa={handleAddTarefa} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Side Panel / Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:w-[55%] sm:max-w-[800px] overflow-y-auto">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-lg font-bold">
              {editState.empresa}
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="py-6 space-y-6 pr-4">
              {/* Task Info Grid - Editável */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Empresa</Label>
                  <Input 
                    value={editState.empresa}
                    onChange={(e) => setEditState(prev => ({ ...prev, empresa: e.target.value }))}
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                
                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">CNPJ</Label>
                  <Input 
                    value={editState.cnpj}
                    onChange={(e) => setEditState(prev => ({ ...prev, cnpj: e.target.value }))}
                    className={`mt-1 h-8 text-sm ${editState.cnpjColor} font-medium`}
                  />
                </div>
                
                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Cor do CNPJ</Label>
                  <Select 
                    value={editState.cnpjColor} 
                    onValueChange={(value) => setEditState(prev => ({ ...prev, cnpjColor: value }))}
                  >
                    <SelectTrigger className="mt-1 h-8 text-sm">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${cnpjColorOptions.find(c => c.value === editState.cnpjColor)?.bgPreview}`} />
                          <span>{cnpjColorOptions.find(c => c.value === editState.cnpjColor)?.label}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {cnpjColorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color.bgPreview}`} />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Enquadramento</Label>
                  <Select 
                    value={editState.enquadramento || 'empty'} 
                    onValueChange={(value) => setEditState(prev => ({ ...prev, enquadramento: value === 'empty' ? '' : value }))}
                  >
                    <SelectTrigger className="mt-1 h-8 text-sm">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">-</SelectItem>
                      {enquadramentoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className={option.color}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Select 
                    value={editState.status} 
                    onValueChange={(value) => setEditState(prev => ({ ...prev, status: value as StatusTarefa }))}
                  >
                    <SelectTrigger className={`mt-1 h-8 text-sm ${statusColors[editState.status].text} font-medium`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusColors).map(([key, config]) => (
                        <SelectItem key={key} value={key} className={`${config.text} font-medium`}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <Separator />

              {/* Checklist */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Checklist - Passos da Atividade</Label>
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Adicionar novo passo..."
                    value={editState.novoChecklistItem}
                    onChange={(e) => setEditState(prev => ({ ...prev, novoChecklistItem: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={handleAddChecklistItem}
                    disabled={!editState.novoChecklistItem.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {editState.checklistItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum passo adicionado</p>
                ) : (
                  <div className="space-y-2">
                    {editState.checklistItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center space-x-3 p-3 rounded-md border border-border hover:bg-muted/30 transition-colors group"
                      >
                        <Checkbox 
                          id={`checklist-${item.id}`}
                          checked={item.concluido}
                          onCheckedChange={() => handleChecklistToggle(item.id)}
                        />
                        <Label 
                          htmlFor={`checklist-${item.id}`} 
                          className={`text-sm cursor-pointer flex-1 ${item.concluido ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item.texto}
                        </Label>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                          onClick={() => handleDeleteChecklistItem(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {editState.checklistItems.length > 0 && (
                  <div className="flex items-center gap-3 pt-2">
                    <Progress 
                      value={calculateEditProgress()} 
                      className="h-2 flex-1" 
                      indicatorClassName={
                        calculateEditProgress() >= 80 ? 'bg-green-500' : 
                        calculateEditProgress() >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }
                    />
                    <span className="text-xs text-muted-foreground">{Math.round(calculateEditProgress())}%</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Anotações */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Anotações</Label>
                
                {editState.anotacoes.length > 0 && (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {editState.anotacoes.map((anotacao) => (
                      <div key={anotacao.id} className="p-3 bg-muted/50 rounded-md group">
                        {editState.editingAnotacaoId === anotacao.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editState.editingAnotacaoTexto}
                              onChange={(e) => setEditState(prev => ({ ...prev, editingAnotacaoTexto: e.target.value }))}
                              className="min-h-[60px] resize-none text-sm"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1" onClick={handleCancelEditAnotacao}>
                                Cancelar
                              </Button>
                              <Button size="sm" className="flex-1" onClick={handleSaveEditAnotacao}>
                                Salvar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm">{anotacao.texto}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground">{anotacao.data}</p>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-6 w-6"
                                  onClick={() => handleStartEditAnotacao(anotacao)}
                                >
                                  <SquarePen className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-6 w-6 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteAnotacao(anotacao.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <Textarea
                  placeholder="Adicionar nova anotação..."
                  value={editState.novaAnotacao}
                  onChange={(e) => setEditState(prev => ({ ...prev, novaAnotacao: e.target.value }))}
                  className="min-h-[80px] resize-none"
                />
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSheetOpen(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSaveChanges}>
                  Salvar Alterações
                </Button>
              </div>
              
              {/* Remove Button */}
              <DeleteConfirmDialog
                entityName={selectedTarefa?.empresa || ''}
                onConfirm={() => {
                  if (!selectedTarefa) return;
                  // Remove from tarefasHolding array
                  const index = tarefasHolding.findIndex(t => t.id === selectedTarefa.id);
                  if (index !== -1) {
                    tarefasHolding.splice(index, 1);
                  }
                  // Remove from savedDataMap
                  setSavedDataMap(prev => {
                    const newMap = { ...prev };
                    delete newMap[selectedTarefa.id];
                    return newMap;
                  });
                  toast.success('Tarefa removida com sucesso!');
                  setSheetOpen(false);
                }}
                trigger={
                  <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive gap-2 mt-4">
                    <Trash2 className="h-4 w-4" />
                    Remover Tarefa
                  </Button>
                }
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ControleHolding;
