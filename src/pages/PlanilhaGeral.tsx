import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Grid3X3, SquarePen, Trash2, ListChecks, ChevronDown, Check, MessageSquare, Eye, Pencil, UserMinus, Upload, ArrowRight } from 'lucide-react';
import { ColumnFilterInput, useColumnFilters } from '@/components/ui/column-filter';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
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
  lucroRealAliquotas,
  lucroPresumidoAliquotas,
  empresasLucroReal,
  empresasLucroPresumido,
  empresasSemMovimento,
  type EmpresaPlanilha,
} from '@/mocks/planilhaGeral';

// Opções para os selects
const trimestreOptions = [
  { value: '', label: '-' },
  { value: 'Lucro', label: 'Lucro' },
  { value: 'Prejuízo', label: 'Prejuízo' },
];

const lalurOptions = [
  { value: '', label: '-' },
  { value: '1º Trimestre Ok', label: '1º Trimestre Ok' },
  { value: '2º Trimestre Ok', label: '2º Trimestre Ok' },
  { value: '3º Trimestre Ok', label: '3º Trimestre Ok' },
  { value: '4º Trimestre Ok', label: '4º Trimestre Ok' },
  { value: '1º Trimestre Ok / Imposto enviado', label: '1º Trimestre Ok / Imposto enviado' },
  { value: '2º Trimestre Ok / Imposto enviado', label: '2º Trimestre Ok / Imposto enviado' },
  { value: '3º Trimestre Ok / Imposto enviado', label: '3º Trimestre Ok / Imposto enviado' },
  { value: '4º Trimestre Ok / Imposto enviado', label: '4º Trimestre Ok / Imposto enviado' },
];

const contDigitalOptions = [
  { value: '', label: '-' },
  { value: 'Já possui', label: 'Já possui' },
];

const regimeTributarioOptions = [
  { value: '', label: '-' },
  { value: 'Lucro presumido', label: 'Lucro Presumido' },
  { value: 'Lucro real', label: 'Lucro Real' },
  { value: 'Simples nacional', label: 'Simples Nacional' },
];

const situacaoOptions = [
  { value: '', label: '-' },
  { value: 'Saiu', label: 'Saiu' },
  { value: 'Com movimento', label: 'Com movimento' },
  { value: 'Sem movimento', label: 'Sem movimento' },
];

const regimeAnoAnteriorTipos = [
  { value: 'MEI', label: 'MEI', color: 'text-blue-600', bgColor: 'bg-blue-100 text-blue-700' },
  { value: 'Simples Nacional', label: 'Simples Nacional', color: 'text-purple-600', bgColor: 'bg-purple-100 text-purple-700' },
  { value: 'Lucro Presumido', label: 'Lucro Presumido', color: 'text-yellow-600', bgColor: 'bg-yellow-100 text-yellow-700' },
  { value: 'Lucro Real', label: 'Lucro Real', color: 'text-green-600', bgColor: 'bg-green-100 text-green-700' },
];

const getRegimeAnteriorColor = (value: string): { textColor: string; bgColor: string } => {
  if (value.includes('MEI')) return { textColor: 'text-blue-600', bgColor: 'bg-blue-100 text-blue-700' };
  if (value.includes('Simples')) return { textColor: 'text-purple-600', bgColor: 'bg-purple-100 text-purple-700' };
  if (value.toLowerCase().includes('presumido')) return { textColor: 'text-yellow-600', bgColor: 'bg-yellow-100 text-yellow-700' };
  if (value.toLowerCase().includes('real')) return { textColor: 'text-green-600', bgColor: 'bg-green-100 text-green-700' };
  return { textColor: '', bgColor: 'bg-gray-100 text-gray-700' };
};

interface AliquotaTableProps {
  title: string;
  data: { tributo: string; codigo: string; aliquota: string }[];
  onDataChange?: (newData: { tributo: string; codigo: string; aliquota: string }[]) => void;
  onClick?: () => void;
}

const AliquotaTable: React.FC<AliquotaTableProps> = ({ title, data, onDataChange, onClick }) => {
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: 'tributo' | 'codigo' | 'aliquota' } | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (rowIndex: number, field: 'tributo' | 'codigo' | 'aliquota', currentValue: string) => {
    setEditingCell({ rowIndex, field });
    setEditValue(currentValue);
  };

  const handleSaveEdit = () => {
    if (!editingCell || !onDataChange) return;
    
    const newData = data.map((item, index) => {
      if (index === editingCell.rowIndex) {
        return { ...item, [editingCell.field]: editValue };
      }
      return item;
    });
    
    onDataChange(newData);
    setEditingCell(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div 
      className="border border-border rounded-sm inline-block cursor-pointer hover:border-primary/50 transition-colors"
      onClick={onClick}
    >
      <Table className="w-auto">
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-bold text-foreground uppercase text-xs py-1.5 px-3 whitespace-nowrap">{title}</TableHead>
            <TableHead className="font-bold text-foreground uppercase text-xs py-1.5 px-3 whitespace-nowrap">CÓDIGO</TableHead>
            <TableHead className="font-bold text-foreground uppercase text-xs py-1.5 px-3 whitespace-nowrap">ALÍQUOTAS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="border-b border-border last:border-b-0">
              <TableCell className="py-1 px-3 text-sm text-primary whitespace-nowrap">
                {editingCell?.rowIndex === index && editingCell?.field === 'tributo' ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleKeyDown}
                    className="h-6 w-20 text-sm px-1"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="cursor-pointer hover:bg-muted/50 px-1 rounded"
                    onClick={() => onDataChange && handleStartEdit(index, 'tributo', item.tributo)}
                  >
                    {item.tributo}
                  </span>
                )}
              </TableCell>
              <TableCell className="py-1 px-3 text-sm whitespace-nowrap">
                {editingCell?.rowIndex === index && editingCell?.field === 'codigo' ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleKeyDown}
                    className="h-6 w-16 text-sm px-1"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="cursor-pointer hover:bg-muted/50 px-1 rounded"
                    onClick={() => onDataChange && handleStartEdit(index, 'codigo', item.codigo)}
                  >
                    {item.codigo}
                  </span>
                )}
              </TableCell>
              <TableCell className="py-1 px-3 text-sm text-primary whitespace-nowrap">
                {editingCell?.rowIndex === index && editingCell?.field === 'aliquota' ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleKeyDown}
                    className="h-6 w-16 text-sm px-1"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="cursor-pointer hover:bg-muted/50 px-1 rounded"
                    onClick={() => onDataChange && handleStartEdit(index, 'aliquota', item.aliquota)}
                  >
                    {item.aliquota}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Modal para edição das alíquotas
interface AliquotaEditModalProps {
  title: string;
  data: { tributo: string; codigo: string; aliquota: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { tributo: string; codigo: string; aliquota: string }[]) => void;
  originalData: { tributo: string; codigo: string; aliquota: string }[];
}

const AliquotaEditModal: React.FC<AliquotaEditModalProps> = ({ 
  title, 
  data, 
  open, 
  onOpenChange, 
  onSave,
  originalData 
}) => {
  const [editData, setEditData] = useState(data);

  React.useEffect(() => {
    setEditData(data);
  }, [data, open]);

  const handleCellChange = (rowIndex: number, field: 'tributo' | 'codigo' | 'aliquota', value: string) => {
    setEditData(prev => prev.map((item, index) => 
      index === rowIndex ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    onSave(editData);
    onOpenChange(false);
  };

  const handleClear = () => {
    setEditData(originalData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-bold text-foreground uppercase text-xs py-1.5 px-3">TRIBUTO</TableHead>
                <TableHead className="font-bold text-foreground uppercase text-xs py-1.5 px-3">CÓDIGO</TableHead>
                <TableHead className="font-bold text-foreground uppercase text-xs py-1.5 px-3">ALÍQUOTA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editData.map((item, index) => (
                <TableRow key={index} className="border-b border-border last:border-b-0">
                  <TableCell className="py-1 px-2">
                    <Input
                      value={item.tributo}
                      onChange={(e) => handleCellChange(index, 'tributo', e.target.value)}
                      className="h-7 text-sm"
                    />
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <Input
                      value={item.codigo}
                      onChange={(e) => handleCellChange(index, 'codigo', e.target.value)}
                      className="h-7 text-sm"
                    />
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <Input
                      value={item.aliquota}
                      onChange={(e) => handleCellChange(index, 'aliquota', e.target.value)}
                      className="h-7 text-sm"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClear}>
              Limpar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal para edição individual do suporte
interface SuporteItemEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: string;
  onSave: (value: string, newTitle?: string) => void;
  originalValue: string;
  onTitleChange?: (newTitle: string) => void;
}

const SuporteItemEditModal: React.FC<SuporteItemEditModalProps> = ({
  open,
  onOpenChange,
  title,
  value,
  onSave,
  originalValue,
  onTitleChange
}) => {
  const [editValue, setEditValue] = useState(value);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title);

  React.useEffect(() => {
    setEditValue(value);
    setTitleValue(title);
    setEditingTitle(false);
  }, [value, title, open]);

  const handleSave = () => {
    onSave(editValue);
    if (onTitleChange && titleValue !== title) {
      onTitleChange(titleValue);
    }
    onOpenChange(false);
  };

  const handleClear = () => {
    setEditValue(originalValue);
    setTitleValue(title);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditingTitle(false);
    } else if (e.key === 'Escape') {
      setTitleValue(title);
      setEditingTitle(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar {titleValue}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {editingTitle ? (
                <Input
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={handleTitleKeyDown}
                  className="h-7 text-sm font-medium"
                  autoFocus
                />
              ) : (
                <Label htmlFor="suporte-value" className="flex items-center gap-2">
                  {titleValue}
                  <SquarePen 
                    className="h-4 w-4 cursor-pointer hover:text-primary" 
                    onClick={() => setEditingTitle(true)}
                  />
                </Label>
              )}
            </div>
            <Input
              id="suporte-value"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClear}>
              Limpar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const LalurBadge: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <span className="text-sm text-muted-foreground">-</span>;
  
  return (
    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 font-normal text-xs">
      {value}
    </Badge>
  );
};

const ContDigitalBadge: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <span className="text-sm text-muted-foreground">-</span>;
  
  return (
    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 font-normal text-xs">
      {value}
    </Badge>
  );
};

const RegimeBadge: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <span className="text-sm text-muted-foreground">-</span>;
  
  const isLucroReal = value.toLowerCase().includes('real');
  const isLucroPresumido = value.toLowerCase().includes('presumido');
  
  if (isLucroReal) {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-normal text-xs">
        {value}
      </Badge>
    );
  }
  
  if (isLucroPresumido) {
    return (
      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 font-normal text-xs">
        {value}
      </Badge>
    );
  }
  
  return (
    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 font-normal text-xs">
      {value}
    </Badge>
  );
};

const SituacaoBadge: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <span className="text-sm text-muted-foreground">-</span>;
  
  const isSaiu = value.toLowerCase() === 'saiu';
  const isComMovimento = value.toLowerCase().includes('com movimento');
  const isSemMovimento = value.toLowerCase().includes('sem movimento');
  
  if (isSaiu) {
    return (
      <Badge className="bg-gray-200 text-gray-600 hover:bg-gray-200 border-0 font-normal text-xs">
        {value}
      </Badge>
    );
  }
  
  if (isComMovimento) {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-normal text-xs">
        {value}
      </Badge>
    );
  }
  
  if (isSemMovimento) {
    return (
      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 font-normal text-xs">
        {value}
      </Badge>
    );
  }
  
  return (
    <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 font-normal text-xs">
      {value}
    </Badge>
  );
};

export const TrimestreBadge: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <span className="text-sm text-muted-foreground">-</span>;
  
  const isLucro = value === 'Lucro';
  const isPrejuizo = value === 'Prejuízo';
  
  if (isLucro) {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-normal text-xs">
        {value}
      </Badge>
    );
  }
  
  if (isPrejuizo) {
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 font-normal text-xs">
        {value}
      </Badge>
    );
  }
  
  return (
    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 font-normal text-xs">
      {value}
    </Badge>
  );
};

export const RegimeAnteriorBadge: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <span className="text-sm text-muted-foreground">-</span>;
  
  const { bgColor } = getRegimeAnteriorColor(value);
  
  return (
    <Badge className={`${bgColor} hover:opacity-90 border-0 font-normal text-xs`}>
      {value}
    </Badge>
  );
};

// Format date to d/MM/yyyy pattern
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  
  // Parse common date formats
  const monthMap: { [key: string]: string } = {
    'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
    'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
    'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
  };
  
  // Pattern: "31 de agosto de 2025"
  const match = dateStr.match(/(\d{1,2}) de (\w+) de (\d{4})/);
  if (match) {
    const day = match[1];
    const month = monthMap[match[2].toLowerCase()] || '01';
    const year = match[3];
    return `${day}/${month}/${year}`;
  }
  
  return dateStr;
};

// Calculate progress percentage based on checked items
const calculateProgress = (empresa: EmpresaPlanilha): number => {
  const items = [
    empresa.solicitacao,
    empresa.despesas,
    empresa.misterContDig,
    empresa.conferirExtratos,
    empresa.conciliacaoImpostos,
  ];
  const completed = items.filter(Boolean).length;
  return (completed / items.length) * 100;
};

// Progress bar component with color based on percentage
const ProgressBarWithPopover: React.FC<{ value: number; empresa: EmpresaPlanilha }> = ({ value, empresa }) => {
  let colorClass = 'bg-red-500';
  if (value >= 80) colorClass = 'bg-green-500';
  else if (value >= 40) colorClass = 'bg-yellow-500';

  const checklistItems = [
    { label: 'Solicitação', done: empresa.solicitacao },
    { label: 'Despesas', done: empresa.despesas },
    { label: 'Mister/Cont. dig', done: empresa.misterContDig },
    { label: 'Conferir extratos', done: empresa.conferirExtratos },
    { label: 'Conciliação impostos', done: empresa.conciliacaoImpostos },
  ];
  
  return (
    <div className="flex items-center gap-3">
      <div className="w-24">
        <Progress value={value} className="h-3 border border-border" indicatorClassName={colorClass} />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="text-sm text-muted-foreground hover:text-primary cursor-pointer min-w-[36px]">
            {Math.round(value)}%
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="start">
          <div className="space-y-2">
            <p className="text-sm font-medium mb-2">Progresso das tarefas</p>
            {checklistItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${item.done ? 'bg-green-500' : 'bg-muted'}`} />
                <span className={`text-sm ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export interface Anotacao {
  id: string;
  texto: string;
  data: string;
}

export interface ChecklistItem {
  id: string;
  texto: string;
  concluido: boolean;
}

export interface LalurTrimestreState {
  ok: boolean;
  impostoEnviado: boolean;
}

export interface LalurState {
  trimestre1: LalurTrimestreState;
  trimestre2: LalurTrimestreState;
  trimestre3: LalurTrimestreState;
  trimestre4: LalurTrimestreState;
}

// Dados salvos de cada empresa
export interface EmpresaSavedData {
  codigo: string;
  cnpj: string;
  checklistItems: ChecklistItem[];
  anotacoes: Anotacao[];
  trimestre: string;
  lalur: LalurState;
  contDigital: string;
  regime: string;
  situacao: string;
  mensalidades: string;
  regimeAnoAnterior: string;
  ultimaModificacao?: string;
  modificadoPor?: string;
}

// Formata data/hora da última modificação
export const formatUltimaModificacao = (iso?: string): string => {
  if (!iso) return 'Nunca modificada';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Nunca modificada';
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Chave do último fechamento mensal (último dia do mês).
// Se hoje for o último dia do mês, a referência é o mês atual; caso contrário, o mês anterior.
export const getUltimoFechamentoKey = (now: Date = new Date()): string => {
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const ref = now.getDate() === lastDay ? now : new Date(now.getFullYear(), now.getMonth(), 0);
  return `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}`;
};

export interface EmpresaEditState {
  codigo: string;
  cnpj: string;
  editandoCodigo: boolean;
  checklistItems: ChecklistItem[];
  novoChecklistItem: string;
  anotacoes: Anotacao[];
  novaAnotacao: string;
  editingAnotacaoId: string | null;
  editingAnotacaoTexto: string;
  // Campos de detalhes editáveis
  trimestre: string;
  lalur: LalurState;
  contDigital: string;
  regime: string;
  situacao: string;
  mensalidades: string;
  regimeAnoAnterior: string;
}

export const emptyLalurState: LalurState = {
  trimestre1: { ok: false, impostoEnviado: false },
  trimestre2: { ok: false, impostoEnviado: false },
  trimestre3: { ok: false, impostoEnviado: false },
  trimestre4: { ok: false, impostoEnviado: false },
};

// Helper para formatar o valor de LALUR
export const formatLalurValue = (lalur: LalurState): string => {
  const parts: string[] = [];
  
  [1, 2, 3, 4].forEach((num) => {
    const key = `trimestre${num}` as keyof LalurState;
    const trimestre = lalur[key];
    if (trimestre.ok || trimestre.impostoEnviado) {
      let label = `${num}º`;
      if (trimestre.ok) label += ' Ok';
      if (trimestre.impostoEnviado) label += ' Imp.';
      parts.push(label);
    }
  });
  
  return parts.join(' | ');
};

// Helper para parsear o valor de LALUR de string para objeto
export const parseLalurValue = (value: string): LalurState => {
  const result: LalurState = { ...emptyLalurState };
  if (!value) return result;
  
  // Parse old format or new format
  if (value.includes('1º')) {
    result.trimestre1 = { ok: value.includes('Ok'), impostoEnviado: value.includes('Imposto enviado') || value.includes('Imp.') };
  }
  if (value.includes('2º')) {
    result.trimestre2 = { ok: value.includes('Ok'), impostoEnviado: value.includes('Imposto enviado') || value.includes('Imp.') };
  }
  if (value.includes('3º')) {
    result.trimestre3 = { ok: value.includes('Ok'), impostoEnviado: value.includes('Imposto enviado') || value.includes('Imp.') };
  }
  if (value.includes('4º')) {
    result.trimestre4 = { ok: value.includes('Ok'), impostoEnviado: value.includes('Imposto enviado') || value.includes('Imp.') };
  }
  
  return result;
};

export interface EmpresasTableProps {
  empresas: EmpresaPlanilha[];
  onEmpresaClick: (empresa: EmpresaPlanilha) => void;
  savedDataMap: Record<string, EmpresaSavedData>;
  onRemove?: (empresaId: string) => void;
}

export const EmpresasTable: React.FC<EmpresasTableProps> = ({ empresas, onEmpresaClick, savedDataMap, onRemove }) => {
  const { filters, setFilter, matchesFilter } = useColumnFilters(['cod', 'cnpj', 'empresa', 'dataFechamento'] as const);

  const filteredEmpresas = empresas.filter((empresa) => {
    const data = savedDataMap[empresa.id];
    return (
      matchesFilter(data?.codigo || empresa.cod, 'cod') &&
      matchesFilter(data?.cnpj || empresa.cnpj, 'cnpj') &&
      matchesFilter(empresa.empresa, 'empresa') &&
      matchesFilter(empresa.dataFechamento, 'dataFechamento')
    );
  });

  // Helper para obter dados salvos ou originais
  const getEmpresaData = (empresa: EmpresaPlanilha) => {
    const saved = savedDataMap[empresa.id];
    if (saved) {
      return {
        trimestre: saved.trimestre,
        lalur: formatLalurValue(saved.lalur),
        contDigital: saved.contDigital,
        regime: saved.regime,
        situacao: saved.situacao,
        mensalidades: saved.mensalidades,
        regimeAnoAnterior: saved.regimeAnoAnterior,
        anotacoes: saved.anotacoes,
        checklistItems: saved.checklistItems,
      };
    }
    return {
      trimestre: empresa.trimestre,
      lalur: empresa.lalur,
      contDigital: empresa.contDigital,
      regime: empresa.regime,
      situacao: empresa.situacao,
      mensalidades: empresa.mensalidades,
      regimeAnoAnterior: empresa.regimeAnoAnterior,
      anotacoes: empresa.anotacao ? [{ id: '1', texto: empresa.anotacao, data: new Date().toLocaleDateString('pt-BR') }] : [],
      checklistItems: [
        { id: '1', texto: 'Solicitação', concluido: empresa.solicitacao },
        { id: '2', texto: 'Despesas', concluido: empresa.despesas },
        { id: '3', texto: 'Mister/Cont. dig', concluido: empresa.misterContDig },
        { id: '4', texto: 'Conferir extratos', concluido: empresa.conferirExtratos },
        { id: '5', texto: 'Conciliação impostos', concluido: empresa.conciliacaoImpostos },
      ],
    };
  };

  // Calcular progresso baseado nos dados salvos
  const calculateSavedProgress = (empresa: EmpresaPlanilha) => {
    const data = getEmpresaData(empresa);
    if (data.checklistItems.length === 0) return 0;
    const completed = data.checklistItems.filter(item => item.concluido).length;
    return (completed / data.checklistItems.length) * 100;
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[60px]">COD.</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[150px]">CNPJ</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[200px]">Empresas</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[140px]">Progresso</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[80px] text-center">Detalhes</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[80px] text-center">Anotações</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[120px] text-center">Data do fechamento</TableHead>
            {onRemove && <TableHead className="text-xs font-medium text-muted-foreground min-w-[60px] text-center">Ações</TableHead>}
          </TableRow>
          <TableRow className="border-b border-border bg-muted/20">
            <TableHead className="py-1 px-2"><ColumnFilterInput value={filters.cod} onChange={(v) => setFilter('cod', v)} placeholder="Buscar cod..." /></TableHead>
            <TableHead className="py-1 px-2"><ColumnFilterInput value={filters.cnpj} onChange={(v) => setFilter('cnpj', v)} placeholder="Buscar CNPJ..." /></TableHead>
            <TableHead className="py-1 px-2"><ColumnFilterInput value={filters.empresa} onChange={(v) => setFilter('empresa', v)} placeholder="Buscar empresa..." /></TableHead>
            <TableHead className="py-1 px-2" />
            <TableHead className="py-1 px-2" />
            <TableHead className="py-1 px-2" />
            <TableHead className="py-1 px-2"><ColumnFilterInput value={filters.dataFechamento} onChange={(v) => setFilter('dataFechamento', v)} placeholder="Buscar data..." /></TableHead>
            {onRemove && <TableHead className="py-1 px-2" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmpresas.map((empresa) => {
            const empresaData = getEmpresaData(empresa);
            const savedProgress = calculateSavedProgress(empresa);
            const progressColorClass = savedProgress >= 80 ? 'bg-green-500' : savedProgress >= 40 ? 'bg-yellow-500' : 'bg-red-500';
            
            return (
              <TableRow 
                key={empresa.id} 
                className="border-b border-border hover:bg-muted/20 cursor-pointer"
                onClick={() => onEmpresaClick(empresa)}
              >
              <TableCell className="py-2 text-sm">{savedDataMap[empresa.id]?.codigo || empresa.cod}</TableCell>
                <TableCell className="py-2 text-sm text-muted-foreground font-mono">
                  {savedDataMap[empresa.id]?.cnpj || empresa.cnpj || '-'}
                </TableCell>
                <TableCell className="py-2 text-sm font-medium text-primary hover:underline">
                  {empresa.empresa}
                </TableCell>
                <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <Progress value={savedProgress} className="h-3 border border-border" indicatorClassName={progressColorClass} />
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-sm text-muted-foreground hover:text-primary cursor-pointer min-w-[36px]">
                          {Math.round(savedProgress)}%
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-3" align="start">
                        <div className="space-y-2">
                          <p className="text-sm font-medium mb-2">Progresso das tarefas</p>
                          {empresaData.checklistItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${item.concluido ? 'bg-green-500' : 'bg-muted'}`} />
                              <span className={`text-sm ${item.concluido ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {item.texto}
                              </span>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
                <TableCell className="py-2 text-center" onClick={(e) => e.stopPropagation()}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver detalhes">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-3" align="start">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Trimestre:</span>
                          <TrimestreBadge value={empresaData.trimestre} />
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">LALUR:</span>
                          <LalurBadge value={empresaData.lalur} />
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Conta Digital:</span>
                          <ContDigitalBadge value={empresaData.contDigital} />
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Regime:</span>
                          <RegimeBadge value={empresaData.regime} />
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Situação:</span>
                          <SituacaoBadge value={empresaData.situacao} />
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Mensalidades:</span>
                          <span className="text-sm">{empresaData.mensalidades || '-'}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Regime ano anterior:</span>
                          <RegimeAnteriorBadge value={empresaData.regimeAnoAnterior} />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="py-2 text-center" onClick={(e) => e.stopPropagation()}>
                  {empresaData.anotacoes.length > 0 ? (
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
                            {empresaData.anotacoes.map(a => a.texto).join(' | ')}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="py-2 text-sm text-center">{formatDate(empresa.dataFechamento)}</TableCell>
                {onRemove && (
                  <TableCell className="py-2 text-center" onClick={(e) => e.stopPropagation()}>
                    <DeleteConfirmDialog
                      entityName={empresa.empresa}
                      onConfirm={() => onRemove(empresa.id)}
                    />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

const PlanilhaGeral: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('lucro-real');
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaPlanilha | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [regimeAnoPopoverOpen, setRegimeAnoPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [savedDataMap, setSavedDataMap] = useState<Record<string, EmpresaSavedData>>({});
  
  const [empresasLucroRealList, setEmpresasLucroRealList] = useState<EmpresaPlanilha[]>(empresasLucroReal);
  const [empresasLucroPresumidoList, setEmpresasLucroPresumidoList] = useState<EmpresaPlanilha[]>(empresasLucroPresumido);
  const [empresasSemMovimentoList, setEmpresasSemMovimentoList] = useState<EmpresaPlanilha[]>(empresasSemMovimento);
  const [empresasSimplesNacionalList, setEmpresasSimplesNacionalList] = useState<EmpresaPlanilha[]>([]);

  // Carregar dados do banco de dados na inicialização
  useEffect(() => {
    const loadFromDatabase = async () => {
      try {
        // Carregar empresas do banco
        const { data: dbEmpresas, error: empresasError } = await (supabase
          .from('planilha_geral_empresas') as any)
          .select('*');

        if (empresasError) {
          console.error('Erro ao carregar empresas:', empresasError);
          // Fallback para localStorage
          const savedLists = localStorage.getItem('planilhaGeral_empresasLists');
          if (savedLists) {
            const parsed = JSON.parse(savedLists);
            if (parsed.lucroReal) setEmpresasLucroRealList(parsed.lucroReal);
            if (parsed.lucroPresumido) setEmpresasLucroPresumidoList(parsed.lucroPresumido);
            if (parsed.simplesNacional) setEmpresasSimplesNacionalList(parsed.simplesNacional);
            if (parsed.semMovimento) setEmpresasSemMovimentoList(parsed.semMovimento);
          }
        } else if (dbEmpresas && dbEmpresas.length > 0) {
          // Converter dados do banco para o formato da aplicação
          const lucroReal: EmpresaPlanilha[] = [];
          const lucroPresumido: EmpresaPlanilha[] = [];
          const semMovimento: EmpresaPlanilha[] = [];
          const simplesNacional: EmpresaPlanilha[] = [];

          dbEmpresas.forEach((emp: any) => {
            const empresa: EmpresaPlanilha = {
              id: emp.id,
              cod: emp.cod || '',
              cnpj: emp.cnpj || '',
              empresa: emp.empresa,
              solicitacao: emp.solicitacao || false,
              despesas: emp.despesas || false,
              misterContDig: emp.mister_cont_dig || false,
              conferirExtratos: emp.conferir_extratos || false,
              conciliacaoImpostos: emp.conciliacao_impostos || false,
              darf: emp.darf || false,
              anotacao: emp.anotacao || '',
              trimestreNum: emp.trimestre_num || '',
              dataFechamento: emp.data_fechamento || '',
              trimestre: emp.trimestre || '',
              lalur: emp.lalur || '',
              contDigital: emp.cont_digital || '',
              regime: emp.regime || '',
              situacao: emp.situacao || '',
              mensalidades: emp.mensalidades || '',
              regimeAnoAnterior: emp.regime_ano_anterior || '',
            };

            if (emp.tab === 'lucro-presumido') lucroPresumido.push(empresa);
            else if (emp.tab === 'sem-movimento') semMovimento.push(empresa);
            else if (emp.tab === 'simples-nacional') simplesNacional.push(empresa);
            else lucroReal.push(empresa);
          });

          setEmpresasLucroRealList(lucroReal);
          setEmpresasLucroPresumidoList(lucroPresumido);
          setEmpresasSemMovimentoList(semMovimento);
          setEmpresasSimplesNacionalList(simplesNacional);
        } else {
          // Banco vazio - usar dados mock e salvar no banco (com prefixo nos IDs para evitar colisão)
          const prefixedLucroReal = empresasLucroReal.map(e => ({ ...e, id: `lr-${e.id}`, tab: 'lucro-real' }));
          const prefixedLucroPresumido = empresasLucroPresumido.map(e => ({ ...e, id: `lp-${e.id}`, tab: 'lucro-presumido' }));
          const prefixedSemMovimento = empresasSemMovimento.map(e => ({ ...e, tab: 'sem-movimento' }));
          
          const allEmpresas = [...prefixedLucroReal, ...prefixedLucroPresumido, ...prefixedSemMovimento];
          
          // Atualizar listas locais com IDs prefixados
          setEmpresasLucroRealList(prefixedLucroReal);
          setEmpresasLucroPresumidoList(prefixedLucroPresumido);
          setEmpresasSemMovimentoList(prefixedSemMovimento);

          for (const emp of allEmpresas) {
            await (supabase.from('planilha_geral_empresas') as any).upsert({
              id: emp.id,
              cod: emp.cod,
              cnpj: emp.cnpj || '',
              empresa: emp.empresa,
              solicitacao: emp.solicitacao,
              despesas: emp.despesas,
              mister_cont_dig: emp.misterContDig,
              conferir_extratos: emp.conferirExtratos,
              conciliacao_impostos: emp.conciliacaoImpostos,
              darf: emp.darf,
              anotacao: emp.anotacao,
              trimestre_num: emp.trimestreNum,
              data_fechamento: emp.dataFechamento,
              trimestre: emp.trimestre,
              lalur: emp.lalur,
              cont_digital: emp.contDigital,
              regime: emp.regime,
              situacao: emp.situacao,
              mensalidades: emp.mensalidades,
              regime_ano_anterior: emp.regimeAnoAnterior,
              tab: emp.tab,
            });
          }
        }

        // Carregar savedDataMap do banco
        const { data: dbSavedData, error: savedError } = await (supabase
          .from('planilha_geral_saved_data') as any)
          .select('*');

        if (savedError) {
          console.error('Erro ao carregar saved data:', savedError);
          const saved = localStorage.getItem('planilhaGeral_savedDataMap');
          if (saved) setSavedDataMap(JSON.parse(saved));
        } else if (dbSavedData && dbSavedData.length > 0) {
          const map: Record<string, EmpresaSavedData> = {};
          dbSavedData.forEach((sd: any) => {
            map[sd.empresa_id] = {
              codigo: sd.codigo || '',
              cnpj: sd.cnpj || '',
              checklistItems: sd.checklist_items || [],
              anotacoes: sd.anotacoes || [],
              trimestre: sd.trimestre || '',
              lalur: sd.lalur || emptyLalurState,
              contDigital: sd.cont_digital || '',
              regime: sd.regime || '',
              situacao: sd.situacao || '',
              mensalidades: sd.mensalidades || '',
              regimeAnoAnterior: sd.regime_ano_anterior || '',
              ultimaModificacao: sd.updated_at || undefined,
              modificadoPor: sd.modificado_por || undefined,
            };
          });
          setSavedDataMap(map);
        } else {
          // Tentar carregar do localStorage como fallback
          const saved = localStorage.getItem('planilhaGeral_savedDataMap');
          if (saved) {
            const parsed = JSON.parse(saved);
            setSavedDataMap(parsed);
            // Salvar no banco
            for (const [empresaId, data] of Object.entries(parsed)) {
              const sd = data as EmpresaSavedData;
              await (supabase.from('planilha_geral_saved_data') as any).upsert({
                empresa_id: empresaId,
                codigo: sd.codigo,
                cnpj: sd.cnpj,
                checklist_items: sd.checklistItems,
                anotacoes: sd.anotacoes,
                trimestre: sd.trimestre,
                lalur: sd.lalur,
                cont_digital: sd.contDigital,
                regime: sd.regime,
                situacao: sd.situacao,
                mensalidades: sd.mensalidades,
                regime_ano_anterior: sd.regimeAnoAnterior,
              });
            }
          }
        }

        setDbInitialized(true);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFromDatabase();
  }, []);

  // Zeramento automático das fichas de Lucro Real e Lucro Presumido no último dia de cada mês
  useEffect(() => {
    if (!dbInitialized) return;

    const RESET_STORAGE_KEY = 'planilhaGeral_ultimoResetMensal';
    const dueKey = getUltimoFechamentoKey();
    if (localStorage.getItem(RESET_STORAGE_KEY) === dueKey) return;

    const executarReset = async () => {
      try {
        const { data: rows } = await (supabase
          .from('planilha_geral_empresas') as any)
          .select('id')
          .in('tab', ['lucro-real', 'lucro-presumido']);

        const empresaIds: string[] = (rows || []).map((r: any) => r.id);

        if (empresaIds.length > 0) {
          await (supabase.from('planilha_geral_empresas') as any)
            .update({
              solicitacao: false,
              despesas: false,
              mister_cont_dig: false,
              conferir_extratos: false,
              conciliacao_impostos: false,
              darf: false,
              anotacao: '',
              trimestre: '',
              lalur: '',
              data_fechamento: '',
              situacao: '',
            })
            .in('id', empresaIds);

          await (supabase.from('planilha_geral_saved_data') as any)
            .update({
              checklist_items: [],
              anotacoes: [],
              trimestre: '',
              lalur: emptyLalurState,
              situacao: '',
              modificado_por: 'Sistema (zeramento mensal)',
              updated_at: new Date().toISOString(),
            })
            .in('empresa_id', empresaIds);
        }

        localStorage.setItem(RESET_STORAGE_KEY, dueKey);

        const limparEmpresa = (e: EmpresaPlanilha): EmpresaPlanilha => ({
          ...e,
          solicitacao: false,
          despesas: false,
          misterContDig: false,
          conferirExtratos: false,
          conciliacaoImpostos: false,
          darf: false,
          anotacao: '',
          trimestre: '',
          lalur: '',
          dataFechamento: '',
          situacao: '',
        });

        setEmpresasLucroRealList(prev => prev.map(limparEmpresa));
        setEmpresasLucroPresumidoList(prev => prev.map(limparEmpresa));
        setSavedDataMap(prev => {
          const next = { ...prev };
          empresaIds.forEach(id => {
            if (next[id]) {
              next[id] = {
                ...next[id],
                checklistItems: [],
                anotacoes: [],
                trimestre: '',
                lalur: emptyLalurState,
                situacao: '',
                ultimaModificacao: new Date().toISOString(),
                modificadoPor: 'Sistema (zeramento mensal)',
              };
            }
          });
          return next;
        });

        toast.info('Fichas de Lucro Real e Lucro Presumido zeradas para o novo mês.');
      } catch (error) {
        console.error('Erro no zeramento mensal:', error);
      }
    };

    executarReset();
  }, [dbInitialized]);

  // Função auxiliar para salvar empresa no banco
  const saveEmpresaToDb = async (empresa: EmpresaPlanilha, tab: string) => {
    await (supabase.from('planilha_geral_empresas') as any).upsert({
      id: empresa.id,
      cod: empresa.cod,
      cnpj: empresa.cnpj || '',
      empresa: empresa.empresa,
      solicitacao: empresa.solicitacao,
      despesas: empresa.despesas,
      mister_cont_dig: empresa.misterContDig,
      conferir_extratos: empresa.conferirExtratos,
      conciliacao_impostos: empresa.conciliacaoImpostos,
      darf: empresa.darf,
      anotacao: empresa.anotacao,
      trimestre_num: empresa.trimestreNum,
      data_fechamento: empresa.dataFechamento,
      trimestre: empresa.trimestre,
      lalur: empresa.lalur,
      cont_digital: empresa.contDigital,
      regime: empresa.regime,
      situacao: empresa.situacao,
      mensalidades: empresa.mensalidades,
      regime_ano_anterior: empresa.regimeAnoAnterior,
      tab,
    });
  };

  // Função para salvar savedData no banco
  const saveSavedDataToDb = async (empresaId: string, data: EmpresaSavedData) => {
    await (supabase.from('planilha_geral_saved_data') as any).upsert({
      empresa_id: empresaId,
      codigo: data.codigo,
      cnpj: data.cnpj,
      checklist_items: data.checklistItems,
      anotacoes: data.anotacoes,
      trimestre: data.trimestre,
      lalur: data.lalur,
      cont_digital: data.contDigital,
      regime: data.regime,
      situacao: data.situacao,
      mensalidades: data.mensalidades,
      regime_ano_anterior: data.regimeAnoAnterior,
      modificado_por: data.modificadoPor || '',
      updated_at: new Date().toISOString(),
    });
  };

  // Manter localStorage como backup
  useEffect(() => {
    if (!dbInitialized) return;
    localStorage.setItem('planilhaGeral_empresasLists', JSON.stringify({
      lucroReal: empresasLucroRealList,
      lucroPresumido: empresasLucroPresumidoList,
      simplesNacional: empresasSimplesNacionalList,
      semMovimento: empresasSemMovimentoList,
    }));
  }, [empresasLucroRealList, empresasLucroPresumidoList, empresasSimplesNacionalList, empresasSemMovimentoList, dbInitialized]);

  useEffect(() => {
    if (!dbInitialized) return;
    localStorage.setItem('planilhaGeral_savedDataMap', JSON.stringify(savedDataMap));
  }, [savedDataMap, dbInitialized]);
  
  // Estados para alíquotas editáveis
  const [lucroRealData, setLucroRealData] = useState(lucroRealAliquotas);
  const [lucroPresumidoData, setLucroPresumidoData] = useState(lucroPresumidoAliquotas);
  
  // Estados para modais de edição
  const [lucroRealModalOpen, setLucroRealModalOpen] = useState(false);
  const [lucroPresumidoModalOpen, setLucroPresumidoModalOpen] = useState(false);
  const [suporteDominioModalOpen, setSuporteDominioModalOpen] = useState(false);
  const [suporteEconetModalOpen, setSuporteEconetModalOpen] = useState(false);
  
  // Estados para suporte
  const [suporteDominio, setSuporteDominio] = useState('0154130168006');
  const [suporteEconet, setSuporteEconet] = useState('0154130168006');
  const [suporteDominioTitle, setSuporteDominioTitle] = useState('Suporte Domínio');
  const [suporteEconetTitle, setSuporteEconetTitle] = useState('Suporte Econet');
  const originalSuporteDominio = '0154130168006';
  const originalSuporteEconet = '0154130168006';
  
  const [editState, setEditState] = useState<EmpresaEditState>({
    codigo: '',
    cnpj: '',
    editandoCodigo: false,
    checklistItems: [],
    novoChecklistItem: '',
    anotacoes: [],
    novaAnotacao: '',
    editingAnotacaoId: null,
    editingAnotacaoTexto: '',
    trimestre: '',
    lalur: { ...emptyLalurState },
    contDigital: '',
    regime: '',
    situacao: '',
    mensalidades: '',
    regimeAnoAnterior: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para importar planilha
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

        console.log('Planilha lida. Linhas:', jsonData.length);

        if (jsonData.length === 0) {
          toast.error('Planilha vazia ou formato inválido');
          setIsImporting(false);
          return;
        }

        const firstRow = jsonData[0];
        const columnHeaders = Object.keys(firstRow);
        console.log('Colunas detectadas na planilha:', columnHeaders);

        // Detectar colunas automaticamente (case-insensitive)
        const findCol = (row: Record<string, any>, names: string[]) => {
          const keys = Object.keys(row);
          for (const name of names) {
            const found = keys.find(k => k.toLowerCase().trim() === name.toLowerCase());
            if (found) return found;
          }
          for (const name of names) {
            const found = keys.find(k => k.toLowerCase().trim().includes(name.toLowerCase()));
            if (found) return found;
          }
          return null;
        };
        
        const empresaCol = findCol(firstRow, ['empresa', 'apelido', 'razão social', 'razao social', 'nome fantasia', 'denominação', 'denominacao', 'nome']);
        const cnpjCol = findCol(firstRow, ['numero', 'número', 'cnpj', 'cpf/cnpj', 'cnpj/cpf', 'cpf_cnpj', 'cnpj_cpf', 'cpf']);
        const codCol = findCol(firstRow, ['cod', 'código', 'codigo', '#', 'id', 'seq']);
        const regimeCol = findCol(firstRow, ['tributação', 'tributacao', 'regime', 'enquadramento', 'tipo']);

        console.log('Mapeamento de colunas:', { empresaCol, cnpjCol, codCol, regimeCol });

        if (!empresaCol) {
          const colunasDetectadas = columnHeaders.join(', ');
          toast.error(`Coluna de nome/empresa não encontrada. Colunas detectadas: ${colunasDetectadas}. Use uma destas: Empresa, Razão Social, Nome, Apelido.`);
          setIsImporting(false);
          return;
        }

        const getListAndSetter = () => {
          if (activeTab === 'lucro-real') return { list: empresasLucroRealList, setter: setEmpresasLucroRealList, regime: 'Lucro real' };
          if (activeTab === 'lucro-presumido') return { list: empresasLucroPresumidoList, setter: setEmpresasLucroPresumidoList, regime: 'Lucro presumido' };
          if (activeTab === 'simples-nacional') return { list: empresasSimplesNacionalList, setter: setEmpresasSimplesNacionalList, regime: 'Simples nacional' };
          return { list: empresasSemMovimentoList, setter: setEmpresasSemMovimentoList, regime: '' };
        };

        const { setter, regime } = getListAndSetter();
        const tabName = activeTab === 'lucro-real' ? 'lucro-real' : activeTab === 'lucro-presumido' ? 'lucro-presumido' : activeTab === 'simples-nacional' ? 'simples-nacional' : 'sem-movimento';

        // Remover empresas anteriores da aba (conforme solicitado pelo usuário)
        // Antes de substituir, removemos do banco
        if (activeTab === 'lucro-real') {
          await (supabase.from('planilha_geral_empresas') as any).delete().eq('tab', 'lucro-real');
        } else if (activeTab === 'lucro-presumido') {
          await (supabase.from('planilha_geral_empresas') as any).delete().eq('tab', 'lucro-presumido');
        } else if (activeTab === 'simples-nacional') {
          await (supabase.from('planilha_geral_empresas') as any).delete().eq('tab', 'simples-nacional');
        } else {
          await (supabase.from('planilha_geral_empresas') as any).delete().eq('tab', 'sem-movimento');
        }

        const importedList: EmpresaPlanilha[] = [];

        // Criar novas empresas a partir da planilha
        jsonData.forEach((row) => {
          const empresaNome = String(row[empresaCol] || '').trim();
          if (!empresaNome) return;

          const regimeValue = regimeCol ? String(row[regimeCol] || '').trim() : '';
          const cnpj = cnpjCol ? String(row[cnpjCol] || '').trim() : '';
          const cod = codCol ? String(row[codCol] || '').trim() : '';

          const newEmpresa: EmpresaPlanilha = {
            id: `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            cod,
            cnpj,
            empresa: empresaNome,
            solicitacao: false,
            despesas: false,
            misterContDig: false,
            conferirExtratos: false,
            conciliacaoImpostos: false,
            darf: false,
            anotacao: '',
            trimestreNum: '',
            dataFechamento: '',
            trimestre: '',
            lalur: '',
            contDigital: '',
            regime: regimeValue || regime,
            situacao: '',
            mensalidades: '',
            regimeAnoAnterior: '',
          };
          importedList.push(newEmpresa);
        });

        console.log('Novas empresas para importar:', importedList.length);

        // Substituir a lista existente pela nova lista importada
        setter(importedList);

        // Salvar apenas as novas no banco
        for (const emp of importedList) {
          try {
            await saveEmpresaToDb(emp, tabName);
          } catch (err) {
            console.error('Erro ao salvar empresa importada:', emp.empresa, err);
          }
        }

        const skipped = jsonData.length - importedList.length;
        const tabNames: Record<string, string> = {
          'lucro-real': 'Lucro Real',
          'lucro-presumido': 'Lucro Presumido',
          'simples-nacional': 'Simples Nacional',
          'sem-movimento': 'Saiu / Sem Movimento'
        };
        const msg = `${importedList.length} empresa(s) importada(s) na aba ${tabNames[tabName]}` + (skipped > 0 ? ` (${skipped} duplicada(s) ignorada(s))` : '');
        toast.success(msg);
      } catch (error) {
        console.error('Erro ao importar planilha:', error);
        toast.error('Erro ao importar planilha. Verifique o formato do arquivo.');
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Funções para adicionar empresas
  const handleAddEmpresa = (data: Record<string, string>) => {
    const newEmpresa: EmpresaPlanilha = {
      id: `new-${Date.now()}`,
      cod: data.cod || '',
      empresa: data.empresa,
      solicitacao: false,
      despesas: false,
      misterContDig: false,
      conferirExtratos: false,
      conciliacaoImpostos: false,
      darf: false,
      anotacao: '',
      trimestreNum: '',
      dataFechamento: '',
      trimestre: '',
      lalur: '',
      contDigital: '',
      regime: data.regime || '',
      situacao: '',
      mensalidades: '',
      regimeAnoAnterior: '',
    };

    if (activeTab === 'lucro-real') {
      setEmpresasLucroRealList(prev => [...prev, newEmpresa]);
    } else if (activeTab === 'lucro-presumido') {
      setEmpresasLucroPresumidoList(prev => [...prev, newEmpresa]);
    } else if (activeTab === 'simples-nacional') {
      setEmpresasSimplesNacionalList(prev => [...prev, newEmpresa]);
    } else {
      setEmpresasSemMovimentoList(prev => [...prev, newEmpresa]);
    }

    // Salvar no banco
    saveEmpresaToDb(newEmpresa, activeTab);
  };

  const handleRemoveEmpresa = async (empresaId: string) => {
    if (activeTab === 'lucro-real') {
      setEmpresasLucroRealList(prev => prev.filter(e => e.id !== empresaId));
    } else if (activeTab === 'lucro-presumido') {
      setEmpresasLucroPresumidoList(prev => prev.filter(e => e.id !== empresaId));
    } else if (activeTab === 'simples-nacional') {
      setEmpresasSimplesNacionalList(prev => prev.filter(e => e.id !== empresaId));
    } else {
      setEmpresasSemMovimentoList(prev => prev.filter(e => e.id !== empresaId));
    }
    // Remover dados salvos também
    setSavedDataMap(prev => {
      const newMap = { ...prev };
      delete newMap[empresaId];
      return newMap;
    });

    // Remover do banco
    await (supabase.from('planilha_geral_empresas') as any).delete().eq('id', empresaId);
    await (supabase.from('planilha_geral_saved_data') as any).delete().eq('empresa_id', empresaId);
  };

  const getActiveEmpresas = () => {
    if (activeTab === 'lucro-real') return empresasLucroRealList;
    if (activeTab === 'lucro-presumido') return empresasLucroPresumidoList;
    if (activeTab === 'simples-nacional') return empresasSimplesNacionalList;
    return empresasSemMovimentoList;
  };


  const handleEmpresaClick = (empresa: EmpresaPlanilha) => {
    setSelectedEmpresa(empresa);
    
    // Verificar se já tem dados salvos para esta empresa
    const savedData = savedDataMap[empresa.id];
    
    if (savedData) {
      // Usar dados salvos
      setEditState({
        codigo: savedData.codigo,
        cnpj: savedData.cnpj,
        editandoCodigo: false,
        checklistItems: savedData.checklistItems,
        novoChecklistItem: '',
        anotacoes: savedData.anotacoes,
        novaAnotacao: '',
        editingAnotacaoId: null,
        editingAnotacaoTexto: '',
        trimestre: savedData.trimestre,
        lalur: savedData.lalur,
        contDigital: savedData.contDigital,
        regime: savedData.regime,
        situacao: savedData.situacao,
        mensalidades: savedData.mensalidades,
        regimeAnoAnterior: savedData.regimeAnoAnterior,
      });
    } else {
      // Usar dados originais da empresa
      const existingAnotacoes: Anotacao[] = empresa.anotacao 
        ? [{ id: '1', texto: empresa.anotacao, data: new Date().toLocaleDateString('pt-BR') }]
        : [];
      
      const defaultChecklist: ChecklistItem[] = [
        { id: '1', texto: 'Solicitação', concluido: empresa.solicitacao },
        { id: '2', texto: 'Despesas', concluido: empresa.despesas },
        { id: '3', texto: 'Mister/Cont. dig', concluido: empresa.misterContDig },
        { id: '4', texto: 'Conferir extratos', concluido: empresa.conferirExtratos },
        { id: '5', texto: 'Conciliação impostos', concluido: empresa.conciliacaoImpostos },
      ];
      
      setEditState({
        codigo: empresa.cod,
        cnpj: empresa.cnpj || '',
        editandoCodigo: false,
        checklistItems: defaultChecklist,
        novoChecklistItem: '',
        anotacoes: existingAnotacoes,
        novaAnotacao: '',
        editingAnotacaoId: null,
        editingAnotacaoTexto: '',
        trimestre: empresa.trimestre,
        lalur: parseLalurValue(empresa.lalur),
        contDigital: empresa.contDigital,
        regime: empresa.regime,
        situacao: empresa.situacao,
        mensalidades: empresa.mensalidades,
        regimeAnoAnterior: empresa.regimeAnoAnterior,
      });
    }
    setSheetOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedEmpresa) return;
    
    // Se houver nova anotação, adicionar à lista antes de salvar
    let anotacoesFinais = editState.anotacoes;
    if (editState.novaAnotacao.trim()) {
      const newAnotacao: Anotacao = {
        id: Date.now().toString(),
        texto: editState.novaAnotacao,
        data: new Date().toLocaleDateString('pt-BR'),
      };
      anotacoesFinais = [...editState.anotacoes, newAnotacao];
    }
    
    // Salvar dados no map
    const newSavedData: EmpresaSavedData = {
      codigo: editState.codigo,
      cnpj: editState.cnpj,
      checklistItems: editState.checklistItems,
      anotacoes: anotacoesFinais,
      trimestre: editState.trimestre,
      lalur: editState.lalur,
      contDigital: editState.contDigital,
      regime: editState.regime,
      situacao: editState.situacao,
      mensalidades: editState.mensalidades,
      regimeAnoAnterior: editState.regimeAnoAnterior,
      ultimaModificacao: new Date().toISOString(),
      modificadoPor: user?.name || user?.email || 'Usuário',
    };

    setSavedDataMap(prev => ({
      ...prev,
      [selectedEmpresa.id]: newSavedData
    }));

    // Salvar savedData no banco
    saveSavedDataToDb(selectedEmpresa.id, newSavedData);

    // Determinar para qual aba a empresa deve ir baseado na situação
    const situacaoLower = editState.situacao.toLowerCase();
    const isSaiu = situacaoLower === 'saiu';
    const isSemMovimento = situacaoLower.includes('sem movimento');
    const isComMovimento = situacaoLower.includes('com movimento');

    // Determinar aba de destino baseado na situação e regime
    let targetTab: 'lucro-real' | 'lucro-presumido' | 'simples-nacional' | 'sem-movimento' | null = null;
    
    if (isSaiu || isSemMovimento) {
      targetTab = 'sem-movimento';
    } else if (isComMovimento || editState.situacao === '') {
      const regimeLower = editState.regime.toLowerCase();
      if (regimeLower.includes('real')) {
        targetTab = 'lucro-real';
      } else if (regimeLower.includes('presumido')) {
        targetTab = 'lucro-presumido';
      } else if (regimeLower.includes('simples')) {
        targetTab = 'simples-nacional';
      }
    }

    // Mover empresa entre abas se necessário
    const updatedEmpresa = { 
      ...selectedEmpresa,
      situacao: editState.situacao,
      regime: editState.regime,
    };
    const finalTab = targetTab || activeTab;

    if (targetTab && targetTab !== activeTab) {
      // Remover da aba atual
      if (activeTab === 'lucro-real') {
        setEmpresasLucroRealList(prev => prev.filter(e => e.id !== selectedEmpresa.id));
      } else if (activeTab === 'lucro-presumido') {
        setEmpresasLucroPresumidoList(prev => prev.filter(e => e.id !== selectedEmpresa.id));
      } else if (activeTab === 'simples-nacional') {
        setEmpresasSimplesNacionalList(prev => prev.filter(e => e.id !== selectedEmpresa.id));
      } else {
        setEmpresasSemMovimentoList(prev => prev.filter(e => e.id !== selectedEmpresa.id));
      }

      // Adicionar na aba de destino
      if (targetTab === 'lucro-real') {
        setEmpresasLucroRealList(prev => [updatedEmpresa, ...prev]);
      } else if (targetTab === 'lucro-presumido') {
        setEmpresasLucroPresumidoList(prev => [updatedEmpresa, ...prev]);
      } else if (targetTab === 'simples-nacional') {
        setEmpresasSimplesNacionalList(prev => [updatedEmpresa, ...prev]);
      } else {
        setEmpresasSemMovimentoList(prev => [updatedEmpresa, ...prev]);
      }

      const tabNames: Record<string, string> = {
        'lucro-real': 'Lucro Real',
        'lucro-presumido': 'Lucro Presumido',
        'simples-nacional': 'Simples Nacional',
        'sem-movimento': 'Sem Movimento'
      };
      
      toast.success(`Empresa movida para a aba "${tabNames[targetTab!]}"`);
    }

    // Salvar empresa no banco com a aba correta
    saveEmpresaToDb(updatedEmpresa, finalTab);
    
    // Limpar campo de nova anotação
    setEditState(prev => ({ ...prev, novaAnotacao: '' }));
    setSheetOpen(false);
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

  const handleAddAnotacao = () => {
    if (!editState.novaAnotacao.trim()) return;
    
    const newAnotacao: Anotacao = {
      id: Date.now().toString(),
      texto: editState.novaAnotacao,
      data: new Date().toLocaleDateString('pt-BR'),
    };
    
    setEditState(prev => ({
      ...prev,
      anotacoes: [...prev.anotacoes, newAnotacao],
      novaAnotacao: '',
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

  const calculateEditProgress = (): number => {
    if (editState.checklistItems.length === 0) return 0;
    const completed = editState.checklistItems.filter(item => item.concluido).length;
    return (completed / editState.checklistItems.length) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <TopBar title="PLANILHA GERAL" subtitle="CONTÁBIL" />

      {/* Page Description */}
      <PageDescription description="Planilha de Controle Contábil. Centralize informações fiscais e operacionais das empresas, incluindo Lucro Real, Lucro Presumido, situação fiscal e obrigações contábeis." />

      {/* Aliquotas Tables */}
      <div className="px-6 pt-12 pb-12">
        <div className="flex flex-wrap items-start justify-center gap-4">
          <div className="w-fit">
            <AliquotaTable 
              title="LUCRO REAL" 
              data={lucroRealData} 
              onDataChange={setLucroRealData}
              onClick={() => setLucroRealModalOpen(true)}
            />
          </div>
          <div className="w-fit">
            <AliquotaTable 
              title="LUCRO PRESUMIDO" 
              data={lucroPresumidoData} 
              onDataChange={setLucroPresumidoData}
              onClick={() => setLucroPresumidoModalOpen(true)}
            />
          </div>
          {/* Suporte Info */}
          <div className="w-fit space-y-1">
            <p 
              className="text-sm text-primary cursor-pointer hover:underline"
              onClick={() => setSuporteDominioModalOpen(true)}
            >
              {suporteDominioTitle}: {suporteDominio}.
            </p>
            <p 
              className="text-sm text-primary cursor-pointer hover:underline"
              onClick={() => setSuporteEconetModalOpen(true)}
            >
              {suporteEconetTitle}: {suporteEconet}.
            </p>
          </div>
        </div>
      </div>

      {/* Modais de Edição */}
      <AliquotaEditModal
        title="LUCRO REAL"
        data={lucroRealData}
        open={lucroRealModalOpen}
        onOpenChange={setLucroRealModalOpen}
        onSave={setLucroRealData}
        originalData={lucroRealAliquotas}
      />
      <AliquotaEditModal
        title="LUCRO PRESUMIDO"
        data={lucroPresumidoData}
        open={lucroPresumidoModalOpen}
        onOpenChange={setLucroPresumidoModalOpen}
        onSave={setLucroPresumidoData}
        originalData={lucroPresumidoAliquotas}
      />
      <SuporteItemEditModal
        open={suporteDominioModalOpen}
        onOpenChange={setSuporteDominioModalOpen}
        title={suporteDominioTitle}
        value={suporteDominio}
        onSave={setSuporteDominio}
        originalValue={originalSuporteDominio}
        onTitleChange={setSuporteDominioTitle}
      />
      <SuporteItemEditModal
        open={suporteEconetModalOpen}
        onOpenChange={setSuporteEconetModalOpen}
        title={suporteEconetTitle}
        value={suporteEconet}
        onSave={setSuporteEconet}
        originalValue={originalSuporteEconet}
        onTitleChange={setSuporteEconetTitle}
      />

      {/* Tabs and Table */}
      <div className="px-6 pb-6 pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
              <TabsTrigger
                value="lucro-real"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                EMPRESAS LUCRO REAL
              </TabsTrigger>
              <TabsTrigger
                value="lucro-presumido"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                EMPRESAS LUCRO PRESUMIDO
              </TabsTrigger>
              <TabsTrigger
                value="sem-movimento"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                SAIU / SEM MOVIMENTO
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
                {isImporting ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Carregando planilha...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Planilha
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleImportFile}
              />
              <AddEntityDialog
                title="Adicionar Empresa"
                buttonLabel="Adicionar Empresa"
                fields={[
                  { name: 'empresa', label: 'Nome da Empresa', type: 'text', placeholder: 'Nome da empresa', required: true },
                  { name: 'cod', label: 'Código', type: 'text', placeholder: 'Ex: 123' },
                  { name: 'regime', label: 'Regime Tributário', type: 'select', options: [
                    { value: 'Lucro real', label: 'Lucro Real' },
                    { value: 'Lucro presumido', label: 'Lucro Presumido' },
                    { value: 'Simples nacional', label: 'Simples Nacional' },
                  ] },
                ]}
                onAdd={handleAddEmpresa}
              />
            </div>
          </div>

          <div className="border border-border rounded-sm overflow-hidden">
            <TabsContent value="lucro-real" className="m-0">
              <EmpresasTable empresas={empresasLucroRealList} onEmpresaClick={handleEmpresaClick} savedDataMap={savedDataMap} onRemove={handleRemoveEmpresa} />
            </TabsContent>
            <TabsContent value="lucro-presumido" className="m-0">
              <EmpresasTable empresas={empresasLucroPresumidoList} onEmpresaClick={handleEmpresaClick} savedDataMap={savedDataMap} onRemove={handleRemoveEmpresa} />
            </TabsContent>
            <TabsContent value="sem-movimento" className="m-0">
              <EmpresasTable empresas={empresasSemMovimentoList} onEmpresaClick={handleEmpresaClick} savedDataMap={savedDataMap} onRemove={handleRemoveEmpresa} />
            </TabsContent>
          </div>
        </Tabs>


      </div>

      {/* Side Panel / Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:w-[55%] sm:max-w-[800px] overflow-y-auto">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-lg font-bold">
              {selectedEmpresa?.empresa}
            </SheetTitle>
            <div className="flex items-center gap-4 mt-2">
              {/* Código */}
              {editState.editandoCodigo ? (
                <div className="flex items-center gap-1">
                  <SquarePen className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm text-muted-foreground">COD:</Label>
                  <Input 
                    value={editState.codigo}
                    onChange={(e) => setEditState(prev => ({ ...prev, codigo: e.target.value }))}
                    className="h-8 w-24 text-sm"
                    autoFocus
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setEditState(prev => ({ ...prev, editandoCodigo: false }))}
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => setEditState(prev => ({ ...prev, editandoCodigo: true }))}
                  >
                    <SquarePen className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Label className="text-sm text-muted-foreground">COD:</Label>
                  <span className="text-sm font-medium">{editState.codigo || '-'}</span>
                </div>
              )}

              {/* CNPJ */}
              <div className="flex items-center gap-1">
                <Label className="text-sm text-muted-foreground">CNPJ:</Label>
                <Input 
                  value={editState.cnpj}
                  onChange={(e) => setEditState(prev => ({ ...prev, cnpj: e.target.value }))}
                  className="h-8 w-44 text-sm font-mono"
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Última modificação:{' '}
              <span className="font-medium text-foreground">
                {formatUltimaModificacao(selectedEmpresa ? savedDataMap[selectedEmpresa.id]?.ultimaModificacao : undefined)}
              </span>
              {selectedEmpresa && savedDataMap[selectedEmpresa.id]?.modificadoPor && (
                <>
                  {' · Por: '}
                  <span className="font-medium text-foreground">
                    {savedDataMap[selectedEmpresa.id]?.modificadoPor}
                  </span>
                </>
              )}
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="py-6 space-y-6 pr-4">
              {/* Company Info Grid - Editável */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Trimestre</Label>
                  <Select 
                    value={editState.trimestre || 'empty'} 
                    onValueChange={(value) => setEditState(prev => ({ ...prev, trimestre: value === 'empty' ? '' : value }))}
                  >
                    <SelectTrigger className={`mt-1 h-8 text-sm ${
                      editState.trimestre === 'Lucro' ? 'text-green-600 font-medium' : 
                      editState.trimestre === 'Prejuízo' ? 'text-red-600 font-medium' : ''
                    }`}>
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">-</SelectItem>
                      <SelectItem value="Lucro" className="text-green-600 font-medium">Lucro</SelectItem>
                      <SelectItem value="Prejuízo" className="text-red-600 font-medium">Prejuízo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">LALUR</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="mt-1 h-8 w-full justify-between text-sm font-normal"
                      >
                        <span className={formatLalurValue(editState.lalur) ? '' : 'text-muted-foreground'}>
                          {formatLalurValue(editState.lalur) || '-'}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-4" align="start">
                      <div className="space-y-3">
                        <Label className="text-xs text-muted-foreground block">Marque os trimestres concluídos:</Label>
                        {[
                          { key: 'trimestre1' as const, label: '1º Trimestre' },
                          { key: 'trimestre2' as const, label: '2º Trimestre' },
                          { key: 'trimestre3' as const, label: '3º Trimestre' },
                          { key: 'trimestre4' as const, label: '4º Trimestre' },
                        ].map((item) => {
                          const trimestre = editState.lalur[item.key];
                          const isExpanded = trimestre.ok || trimestre.impostoEnviado;
                          return (
                            <div key={item.key} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  id={`lalur-${item.key}`}
                                  checked={trimestre.ok}
                                  onCheckedChange={(checked) => setEditState(prev => ({ 
                                    ...prev, 
                                    lalur: { 
                                      ...prev.lalur, 
                                      [item.key]: { 
                                        ...prev.lalur[item.key], 
                                        ok: !!checked,
                                        // Se desmarcar ok, desmarcar também imposto
                                        impostoEnviado: checked ? prev.lalur[item.key].impostoEnviado : false
                                      } 
                                    } 
                                  }))}
                                />
                                <Label htmlFor={`lalur-${item.key}`} className="text-sm cursor-pointer font-medium">
                                  {item.label}
                                </Label>
                              </div>
                              {trimestre.ok && (
                                <div className="ml-6 flex items-center gap-2">
                                  <Checkbox 
                                    id={`lalur-${item.key}-imposto`}
                                    checked={trimestre.impostoEnviado}
                                    onCheckedChange={(checked) => setEditState(prev => ({ 
                                      ...prev, 
                                      lalur: { 
                                        ...prev.lalur, 
                                        [item.key]: { ...prev.lalur[item.key], impostoEnviado: !!checked } 
                                      } 
                                    }))}
                                  />
                                  <Label htmlFor={`lalur-${item.key}-imposto`} className="text-xs cursor-pointer text-muted-foreground">
                                    Imposto enviado
                                  </Label>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Conta Digital</Label>
                  <Select 
                    value={editState.contDigital || 'empty'} 
                    onValueChange={(value) => setEditState(prev => ({ ...prev, contDigital: value === 'empty' ? '' : value }))}
                  >
                    <SelectTrigger className={`mt-1 h-8 text-sm ${editState.contDigital ? 'text-orange-600 font-medium' : ''}`}>
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">-</SelectItem>
                      <SelectItem value="Já possui" className="text-orange-600 font-medium">Já possui</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Regime</Label>
                  <Select 
                    value={editState.regime || 'empty'} 
                    onValueChange={(value) => setEditState(prev => ({ ...prev, regime: value === 'empty' ? '' : value }))}
                  >
                    <SelectTrigger className={`mt-1 h-8 text-sm ${
                      editState.regime?.toLowerCase().includes('real') ? 'text-green-600 font-medium' : 
                      editState.regime?.toLowerCase().includes('presumido') ? 'text-yellow-600 font-medium' : ''
                    }`}>
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">-</SelectItem>
                      <SelectItem value="Lucro real" className="text-green-600 font-medium">Lucro Real</SelectItem>
                      <SelectItem value="Lucro presumido" className="text-yellow-600 font-medium">Lucro Presumido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Situação</Label>
                  <Select 
                    value={editState.situacao || 'empty'} 
                    onValueChange={(value) => setEditState(prev => ({ ...prev, situacao: value === 'empty' ? '' : value }))}
                  >
                    <SelectTrigger className={`mt-1 h-8 text-sm ${
                      editState.situacao?.toLowerCase() === 'saiu' ? 'text-gray-500 font-medium' : 
                      editState.situacao?.toLowerCase().includes('com movimento') ? 'text-green-600 font-medium' : 
                      editState.situacao?.toLowerCase().includes('sem movimento') ? 'text-yellow-600 font-medium' : ''
                    }`}>
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">-</SelectItem>
                      <SelectItem value="Saiu" className="text-gray-500 font-medium">Saiu</SelectItem>
                      <SelectItem value="Com movimento" className="text-green-600 font-medium">Com movimento</SelectItem>
                      <SelectItem value="Sem movimento" className="text-yellow-600 font-medium">Sem movimento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Mensalidades</Label>
                  <Input 
                    value={editState.mensalidades}
                    onChange={(e) => {
                      // Remove tudo que não é número
                      const numericValue = e.target.value.replace(/\D/g, '');
                      // Converte para centavos e formata
                      const cents = parseInt(numericValue || '0', 10);
                      const formatted = (cents / 100).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      });
                      setEditState(prev => ({ ...prev, mensalidades: formatted }));
                    }}
                    placeholder="R$ 0,00"
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div className="col-span-2 p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Regime no ano anterior</Label>
                  <Popover open={regimeAnoPopoverOpen} onOpenChange={setRegimeAnoPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={`mt-1 h-8 w-full justify-between text-sm font-normal ${
                          editState.regimeAnoAnterior ? getRegimeAnteriorColor(editState.regimeAnoAnterior).textColor + ' font-medium' : ''
                        }`}
                      >
                        <span className={editState.regimeAnoAnterior ? '' : 'text-muted-foreground'}>
                          {editState.regimeAnoAnterior || '-'}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-4 bg-background border" align="start">
                      <div className="space-y-3">
                        <Label className="text-xs text-muted-foreground block">Selecione o regime e digite o ano:</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {regimeAnoAnteriorTipos.map((regime) => {
                            const isSelected = editState.regimeAnoAnterior.includes(regime.value);
                            return (
                              <Button
                                key={regime.value}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                className={`text-xs h-8 ${isSelected ? regime.bgColor : regime.color}`}
                                onClick={() => {
                                  // Extract existing year if any
                                  const yearMatch = editState.regimeAnoAnterior.match(/\d{4}/);
                                  const year = yearMatch ? yearMatch[0] : '';
                                  setEditState(prev => ({
                                    ...prev,
                                    regimeAnoAnterior: year ? `${regime.value} ${year}` : regime.value
                                  }));
                                }}
                              >
                                {regime.label}
                              </Button>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground whitespace-nowrap">Ano:</Label>
                          <Input
                            placeholder="Ex: 2026"
                            className="h-8 text-sm"
                            maxLength={4}
                            value={(() => {
                              const match = editState.regimeAnoAnterior.match(/\d+/);
                              return match ? match[0] : '';
                            })()}
                            onChange={(e) => {
                              const year = e.target.value.replace(/\D/g, '').slice(0, 4);
                              // Extract regime type
                              const regimeMatch = regimeAnoAnteriorTipos.find(r => 
                                editState.regimeAnoAnterior.includes(r.value)
                              );
                              const regimeName = regimeMatch?.value || '';
                              
                              if (regimeName && year) {
                                setEditState(prev => ({
                                  ...prev,
                                  regimeAnoAnterior: `${regimeName} ${year}`
                                }));
                              } else if (regimeName) {
                                setEditState(prev => ({
                                  ...prev,
                                  regimeAnoAnterior: regimeName
                                }));
                              } else if (year) {
                                setEditState(prev => ({
                                  ...prev,
                                  regimeAnoAnterior: year
                                }));
                              } else {
                                setEditState(prev => ({
                                  ...prev,
                                  regimeAnoAnterior: ''
                                }));
                              }
                            }}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-xs text-muted-foreground"
                            onClick={() => {
                              setEditState(prev => ({ ...prev, regimeAnoAnterior: '' }));
                            }}
                          >
                            Limpar
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => {
                              setRegimeAnoPopoverOpen(false);
                            }}
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>


              <Separator />

              {/* Checklist */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Checklist - Passos da Atividade</Label>
                </div>
                
                {/* Add new item input */}
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

                {/* Checklist items */}
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

                {/* Progress */}
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
                
                {/* Lista de anotações existentes */}
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
                
                {/* Campo para nova anotação */}
                <Textarea 
                  placeholder="Digite uma nova anotação..."
                  value={editState.novaAnotacao}
                  onChange={(e) => setEditState(prev => ({ ...prev, novaAnotacao: e.target.value }))}
                  className="min-h-[80px] resize-none"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-border">
                <Button className="w-full" onClick={handleSaveChanges}>
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PlanilhaGeral;
