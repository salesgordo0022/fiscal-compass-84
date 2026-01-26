import React, { useState } from 'react';
import { Plus, Grid3X3, SquarePen, Trash2, ListChecks, ChevronDown, Check, MessageSquare, Eye, Pencil, UserMinus } from 'lucide-react';
import { toast } from 'sonner';
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

const TrimestreBadge: React.FC<{ value: string }> = ({ value }) => {
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

const RegimeAnteriorBadge: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <span className="text-sm text-muted-foreground">-</span>;
  
  const { bgColor } = getRegimeAnteriorColor(value);
  
  return (
    <Badge className={`${bgColor} hover:opacity-90 border-0 font-normal text-xs`}>
      {value}
    </Badge>
  );
};

// Format date to d/MM/yyyy pattern
const formatDate = (dateStr: string): string => {
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

interface LalurTrimestreState {
  ok: boolean;
  impostoEnviado: boolean;
}

interface LalurState {
  trimestre1: LalurTrimestreState;
  trimestre2: LalurTrimestreState;
  trimestre3: LalurTrimestreState;
  trimestre4: LalurTrimestreState;
}

// Dados salvos de cada empresa
interface EmpresaSavedData {
  codigo: string;
  checklistItems: ChecklistItem[];
  anotacoes: Anotacao[];
  trimestre: string;
  lalur: LalurState;
  contDigital: string;
  regime: string;
  situacao: string;
  mensalidades: string;
  regimeAnoAnterior: string;
}

interface EmpresaEditState {
  codigo: string;
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

const emptyLalurState: LalurState = {
  trimestre1: { ok: false, impostoEnviado: false },
  trimestre2: { ok: false, impostoEnviado: false },
  trimestre3: { ok: false, impostoEnviado: false },
  trimestre4: { ok: false, impostoEnviado: false },
};

// Helper para formatar o valor de LALUR
const formatLalurValue = (lalur: LalurState): string => {
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
const parseLalurValue = (value: string): LalurState => {
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

interface EmpresasTableProps {
  empresas: EmpresaPlanilha[];
  onEmpresaClick: (empresa: EmpresaPlanilha) => void;
  savedDataMap: Record<string, EmpresaSavedData>;
  onRemove?: (empresaId: string) => void;
}

const EmpresasTable: React.FC<EmpresasTableProps> = ({ empresas, onEmpresaClick, savedDataMap, onRemove }) => {
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
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[200px]">Empresas</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[140px]">Progresso</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[80px] text-center">Detalhes</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[80px] text-center">Anotações</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[120px] text-center">Data do fechamento</TableHead>
            {onRemove && <TableHead className="text-xs font-medium text-muted-foreground min-w-[60px] text-center">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {empresas.map((empresa) => {
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
  const [activeTab, setActiveTab] = useState('lucro-real');
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaPlanilha | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [regimeAnoPopoverOpen, setRegimeAnoPopoverOpen] = useState(false);
  const [savedDataMap, setSavedDataMap] = useState<Record<string, EmpresaSavedData>>({});
  
  // Estados para listas de empresas
  const [empresasLucroRealList, setEmpresasLucroRealList] = useState<EmpresaPlanilha[]>(empresasLucroReal);
  const [empresasLucroPresumidoList, setEmpresasLucroPresumidoList] = useState<EmpresaPlanilha[]>(empresasLucroPresumido);
  const [empresasSemMovimentoList, setEmpresasSemMovimentoList] = useState<EmpresaPlanilha[]>(empresasSemMovimento);
  
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
    } else {
      setEmpresasSemMovimentoList(prev => [...prev, newEmpresa]);
    }
  };

  const handleRemoveEmpresa = (empresaId: string) => {
    if (activeTab === 'lucro-real') {
      setEmpresasLucroRealList(prev => prev.filter(e => e.id !== empresaId));
    } else if (activeTab === 'lucro-presumido') {
      setEmpresasLucroPresumidoList(prev => prev.filter(e => e.id !== empresaId));
    } else {
      setEmpresasSemMovimentoList(prev => prev.filter(e => e.id !== empresaId));
    }
    // Remover dados salvos também
    setSavedDataMap(prev => {
      const newMap = { ...prev };
      delete newMap[empresaId];
      return newMap;
    });
  };

  const getActiveEmpresas = () => {
    if (activeTab === 'lucro-real') return empresasLucroRealList;
    if (activeTab === 'lucro-presumido') return empresasLucroPresumidoList;
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

  const handleSaveChanges = () => {
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
      checklistItems: editState.checklistItems,
      anotacoes: anotacoesFinais,
      trimestre: editState.trimestre,
      lalur: editState.lalur,
      contDigital: editState.contDigital,
      regime: editState.regime,
      situacao: editState.situacao,
      mensalidades: editState.mensalidades,
      regimeAnoAnterior: editState.regimeAnoAnterior,
    };

    setSavedDataMap(prev => ({
      ...prev,
      [selectedEmpresa.id]: newSavedData
    }));

    // Determinar para qual aba a empresa deve ir baseado na situação
    const situacaoLower = editState.situacao.toLowerCase();
    const isSaiu = situacaoLower === 'saiu';
    const isSemMovimento = situacaoLower.includes('sem movimento');
    const isComMovimento = situacaoLower.includes('com movimento');

    // Determinar aba de destino baseado na situação e regime
    let targetTab: 'lucro-real' | 'lucro-presumido' | 'sem-movimento' | null = null;
    
    if (isSaiu || isSemMovimento) {
      targetTab = 'sem-movimento';
    } else if (isComMovimento || editState.situacao === '') {
      // Se tem movimento ou situação não definida, usar o regime para determinar a aba
      const regimeLower = editState.regime.toLowerCase();
      if (regimeLower.includes('real')) {
        targetTab = 'lucro-real';
      } else if (regimeLower.includes('presumido')) {
        targetTab = 'lucro-presumido';
      }
    }

    // Mover empresa entre abas se necessário
    if (targetTab && targetTab !== activeTab) {
      // Remover da aba atual
      if (activeTab === 'lucro-real') {
        setEmpresasLucroRealList(prev => prev.filter(e => e.id !== selectedEmpresa.id));
      } else if (activeTab === 'lucro-presumido') {
        setEmpresasLucroPresumidoList(prev => prev.filter(e => e.id !== selectedEmpresa.id));
      } else {
        setEmpresasSemMovimentoList(prev => prev.filter(e => e.id !== selectedEmpresa.id));
      }

      // Adicionar na aba de destino
      const updatedEmpresa = { ...selectedEmpresa };
      if (targetTab === 'lucro-real') {
        setEmpresasLucroRealList(prev => [updatedEmpresa, ...prev]);
      } else if (targetTab === 'lucro-presumido') {
        setEmpresasLucroPresumidoList(prev => [updatedEmpresa, ...prev]);
      } else {
        setEmpresasSemMovimentoList(prev => [updatedEmpresa, ...prev]);
      }

      // Mostrar mensagem de movimentação
      const tabNames: Record<string, string> = {
        'lucro-real': 'Lucro Real',
        'lucro-presumido': 'Lucro Presumido',
        'sem-movimento': 'Sem Movimento'
      };
      
      toast.success(`Empresa movida para a aba "${tabNames[targetTab!]}"`);
    }
    
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
            <AddEntityDialog
              title="Adicionar Empresa"
              buttonLabel="Adicionar Empresa"
              fields={[
                { name: 'empresa', label: 'Nome da Empresa', type: 'text', placeholder: 'Nome da empresa', required: true },
                { name: 'cod', label: 'Código', type: 'text', placeholder: 'Ex: 123' },
                { name: 'regime', label: 'Regime Tributário', type: 'select', options: [
                  { value: 'Lucro real', label: 'Lucro Real' },
                  { value: 'Lucro presumido', label: 'Lucro Presumido' },
                ] },
              ]}
              onAdd={handleAddEmpresa}
            />
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
            <div className="flex items-center gap-2 mt-2">
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
                  <span className="text-sm font-medium">{editState.codigo}</span>
                </div>
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
