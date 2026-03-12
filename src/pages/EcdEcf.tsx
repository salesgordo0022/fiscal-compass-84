import React, { useState } from 'react';
import { ColumnFilterInput, useColumnFilters } from '@/components/ui/column-filter';
import { CheckCircle2, XCircle, FileText, Calculator, MessageSquare, Eye, Plus, Trash2 } from 'lucide-react';
import AddEntityDialog from '@/components/dialogs/AddEntityDialog';
import DeleteConfirmDialog from '@/components/dialogs/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
  empresasEcdEcf,
  statusEnvioConfig,
  regimeConfig,
  type EmpresaEcdEcf,
  type StatusEnvio,
  type RegimeEcdEcf,
} from '@/mocks/ecdEcf';
import { toast } from 'sonner';

// Format date to d/MM/yyyy pattern (same as Controle de Holding)
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  
  const monthMap: { [key: string]: string } = {
    'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
    'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
    'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
  };
  
  const match = dateStr.match(/(\d{1,2}) de (\w+) de (\d{4})/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = monthMap[match[2].toLowerCase()] || '01';
    const year = match[3];
    return `${day}/${month}/${year}`;
  }
  
  return dateStr;
};

// Status Badge Component
const StatusBadge: React.FC<{ status: StatusEnvio }> = ({ status }) => {
  const config = statusEnvioConfig[status];
  const Icon = status === 'enviado' ? CheckCircle2 : XCircle;
  return (
    <Badge className={`${config.bg} ${config.text} hover:opacity-90 border-0 font-normal text-xs gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// Regime Badge Component
const RegimeBadge: React.FC<{ regime: RegimeEcdEcf }> = ({ regime }) => {
  if (!regime) return <span className="text-sm text-muted-foreground">-</span>;
  
  const config = regimeConfig[regime];
  return (
    <Badge className={`${config.bg} ${config.text} hover:opacity-90 border-0 font-normal text-xs`}>
      {config.label}
    </Badge>
  );
};

// Situação Popover Component (simple like Terceiro Setor)
interface SituacaoPopoverProps {
  situacao: string;
}

const SituacaoPopover: React.FC<SituacaoPopoverProps> = ({ situacao }) => {
  if (!situacao) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-1 hover:bg-muted rounded">
          <MessageSquare className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Anotação</h4>
          <p className="text-sm text-muted-foreground">{situacao}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};


interface EcdEcfTableProps {
  empresas: EmpresaEcdEcf[];
  tipo: 'ecd' | 'ecf';
  onEmpresaClick: (empresa: EmpresaEcdEcf) => void;
  savedDataMap: Record<string, Partial<EmpresaEcdEcf>>;
  onToggleStatus: (empresaId: string, tipo: 'ecd' | 'ecf') => void;
}

const EcdEcfTable: React.FC<EcdEcfTableProps> = ({ empresas, tipo, onEmpresaClick, savedDataMap, onToggleStatus }) => {
  const { filters, setFilter, matchesFilter, matchesSelectFilter } = useColumnFilters(['empresa', 'status', 'data'] as const);
  
  const getEmpresaData = (empresa: EmpresaEcdEcf) => {
    const saved = savedDataMap[empresa.id];
    return saved ? { ...empresa, ...saved } : empresa;
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[300px]">Empresas</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[80px] text-center">Detalhes</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[120px]">Status</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[80px] text-center">Situação</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[120px] text-center">Data</TableHead>
          </TableRow>
          <TableRow className="border-b border-border bg-muted/20">
            <TableHead className="py-1 px-2"><ColumnFilterInput value={filters.empresa} onChange={(v) => setFilter('empresa', v)} placeholder="Buscar empresa..." /></TableHead>
            <TableHead className="py-1 px-2" />
            <TableHead className="py-1 px-2">
              <ColumnFilterInput 
                type="select" 
                value={filters.status} 
                onChange={(v) => setFilter('status', v)} 
                placeholder="Todos"
                options={[
                  { value: 'enviado', label: 'ENVIADO' },
                  { value: 'nao_enviado', label: 'NÃO ENVIADO' },
                ]}
              />
            </TableHead>
            <TableHead className="py-1 px-2" />
            <TableHead className="py-1 px-2"><ColumnFilterInput value={filters.data} onChange={(v) => setFilter('data', v)} placeholder="Buscar data..." /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empresas.filter((empresa) => {
            const data = getEmpresaData(empresa);
            const status = tipo === 'ecd' ? data.statusEcd : data.statusEcf;
            const dateVal = tipo === 'ecd' ? data.dataEcd : data.dataEcf;
            return matchesFilter(data.empresa, 'empresa') &&
              matchesSelectFilter(status, 'status') &&
              matchesFilter(dateVal, 'data');
          }).map((empresa) => {
            const empresaData = getEmpresaData(empresa);
            const status = tipo === 'ecd' ? empresaData.statusEcd : empresaData.statusEcf;
            const data = tipo === 'ecd' ? empresaData.dataEcd : empresaData.dataEcf;
            const situacao = tipo === 'ecd' ? empresaData.situacaoEcd : empresaData.situacaoEcf;
            
            return (
              <TableRow 
                key={empresa.id} 
                className="border-b border-border hover:bg-muted/20"
              >
                <TableCell 
                  className="py-2 text-sm font-medium text-primary hover:underline cursor-pointer"
                  onClick={() => onEmpresaClick(empresa)}
                >
                  {empresaData.empresa}
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
                          <span className="text-xs text-muted-foreground">Regime Atual:</span>
                          <RegimeBadge regime={empresaData.regimeAtual} />
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Regime Ano Anterior:</span>
                          <RegimeBadge regime={empresaData.regimeAnoAnterior} />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => onToggleStatus(empresa.id, tipo)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    title="Clique para alternar status"
                  >
                    <StatusBadge status={status} />
                  </button>
                </TableCell>
                <TableCell className="py-2 text-center" onClick={(e) => e.stopPropagation()}>
                  <SituacaoPopover situacao={situacao || ''} />
                </TableCell>
                <TableCell className="py-2 text-sm text-center">
                  {data ? formatDate(data) : <span className="text-muted-foreground">-</span>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};


const EcdEcf: React.FC = () => {
  const [empresas, setEmpresas] = useState<EmpresaEcdEcf[]>(empresasEcdEcf);
  const [savedDataMap, setSavedDataMap] = useState<Record<string, Partial<EmpresaEcdEcf>>>({});
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaEcdEcf | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ecd' | 'ecf'>('ecd');
  const [filter, setFilter] = useState<'all' | 'enviados'>('all');
  
  // Edit state
  const [editState, setEditState] = useState<Partial<EmpresaEcdEcf>>({});

  const handleEmpresaClick = (empresa: EmpresaEcdEcf) => {
    const saved = savedDataMap[empresa.id];
    const mergedData = saved ? { ...empresa, ...saved } : empresa;
    setSelectedEmpresa(empresa);
    setEditState(mergedData);
    setSheetOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedEmpresa) return;
    
    setSavedDataMap(prev => ({
      ...prev,
      [selectedEmpresa.id]: editState,
    }));
    
    toast.success('Alterações salvas com sucesso!');
    setSheetOpen(false);
  };

  const handleToggleStatus = (empresaId: string, tipo: 'ecd' | 'ecf') => {
    const empresa = empresas.find(e => e.id === empresaId);
    if (!empresa) return;
    
    const saved = savedDataMap[empresaId] || {};
    const currentStatus = tipo === 'ecd' 
      ? (saved.statusEcd || empresa.statusEcd)
      : (saved.statusEcf || empresa.statusEcf);
    
    const newStatus: StatusEnvio = currentStatus === 'enviado' ? 'nao_enviado' : 'enviado';
    
    setSavedDataMap(prev => ({
      ...prev,
      [empresaId]: {
        ...prev[empresaId],
        ...(tipo === 'ecd' ? { statusEcd: newStatus } : { statusEcf: newStatus }),
      },
    }));
    
    toast.success(`Status alterado para ${newStatus === 'enviado' ? 'Enviado' : 'Não Enviado'}`);
  };


  // Count stats
  const ecdEnviados = empresas.filter(e => {
    const saved = savedDataMap[e.id];
    return (saved?.statusEcd || e.statusEcd) === 'enviado';
  }).length;
  
  const ecfEnviados = empresas.filter(e => {
    const saved = savedDataMap[e.id];
    return (saved?.statusEcf || e.statusEcf) === 'enviado';
  }).length;

  // Filter empresas based on active filter and tab
  const getFilteredEmpresas = () => {
    if (filter === 'all') return empresas;
    
    return empresas.filter(e => {
      const saved = savedDataMap[e.id];
      if (activeTab === 'ecd') {
        return (saved?.statusEcd || e.statusEcd) === 'enviado';
      } else {
        return (saved?.statusEcf || e.statusEcf) === 'enviado';
      }
    });
  };

  const filteredEmpresas = getFilteredEmpresas();

  const handleCardClick = (tipo: 'ecd' | 'ecf', filterType: 'enviados' | 'all') => {
    setActiveTab(tipo);
    setFilter(filterType);
  };

  return (
    <div className="min-h-screen">
      <TopBar title="ECD e ECF" subtitle="Contábil" />
      <PageDescription description="Controle de Escrituração Contábil Digital (ECD) e Escrituração Contábil Fiscal (ECF). Acompanhe prazos, validações e status de entrega de obrigações acessórias referente ao exercício 2025, com base no ano-calendário 2024." />
      
      <div className="p-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="flex flex-wrap justify-center items-start gap-8 mb-8">
          <div className={`border rounded-sm transition-all ${activeTab === 'ecd' ? 'border-primary shadow-sm' : 'border-border'}`}>
            <Table className="w-auto">
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-bold text-foreground uppercase text-sm py-3 px-6 whitespace-nowrap">ECD ENVIADOS</TableHead>
                  <TableHead className="font-bold text-foreground uppercase text-sm py-3 px-6 whitespace-nowrap">TOTAL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-border last:border-b-0">
                  <TableCell 
                    className={`py-3 px-6 text-lg font-bold whitespace-nowrap text-center cursor-pointer hover:bg-muted/50 transition-colors ${activeTab === 'ecd' && filter === 'enviados' ? 'bg-green-50 text-green-700' : 'text-green-600'}`}
                    onClick={() => handleCardClick('ecd', 'enviados')}
                    title="Clique para ver apenas ECD enviados"
                  >
                    {ecdEnviados}
                  </TableCell>
                  <TableCell 
                    className={`py-3 px-6 text-lg font-medium whitespace-nowrap text-center cursor-pointer hover:bg-muted/50 transition-colors ${activeTab === 'ecd' && filter === 'all' ? 'bg-muted' : ''}`}
                    onClick={() => handleCardClick('ecd', 'all')}
                    title="Clique para ver todas as empresas (ECD)"
                  >
                    {empresas.length}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className={`border rounded-sm transition-all ${activeTab === 'ecf' ? 'border-primary shadow-sm' : 'border-border'}`}>
            <Table className="w-auto">
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-bold text-foreground uppercase text-sm py-3 px-6 whitespace-nowrap">ECF ENVIADOS</TableHead>
                  <TableHead className="font-bold text-foreground uppercase text-sm py-3 px-6 whitespace-nowrap">TOTAL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-border last:border-b-0">
                  <TableCell 
                    className={`py-3 px-6 text-lg font-bold whitespace-nowrap text-center cursor-pointer hover:bg-muted/50 transition-colors ${activeTab === 'ecf' && filter === 'enviados' ? 'bg-green-50 text-green-700' : 'text-green-600'}`}
                    onClick={() => handleCardClick('ecf', 'enviados')}
                    title="Clique para ver apenas ECF enviados"
                  >
                    {ecfEnviados}
                  </TableCell>
                  <TableCell 
                    className={`py-3 px-6 text-lg font-medium whitespace-nowrap text-center cursor-pointer hover:bg-muted/50 transition-colors ${activeTab === 'ecf' && filter === 'all' ? 'bg-muted' : ''}`}
                    onClick={() => handleCardClick('ecf', 'all')}
                    title="Clique para ver todas as empresas (ECF)"
                  >
                    {empresas.length}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Filter indicator */}
        {filter === 'enviados' && (
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="gap-2">
              Exibindo apenas {activeTab.toUpperCase()} enviados
              <button 
                onClick={() => setFilter('all')} 
                className="ml-1 hover:text-primary"
                title="Limpar filtro"
              >
                ✕
              </button>
            </Badge>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'ecd' | 'ecf')} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
              <TabsTrigger 
                value="ecd" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                ECD (ESCRITURAÇÃO CONTÁBIL DIGITAL)
              </TabsTrigger>
              <TabsTrigger 
                value="ecf" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm"
              >
                <Calculator className="h-4 w-4 mr-2" />
                ECF (ESCRITURAÇÃO CONTÁBIL FISCAL)
              </TabsTrigger>
            </TabsList>
            <AddEntityDialog 
              title="Adicionar Empresa"
              buttonLabel="Adicionar Empresa"
              fields={[
                { name: 'empresa', label: 'Nome da Empresa', type: 'text', placeholder: 'Digite o nome da empresa...', required: true },
                { name: 'regime', label: 'Regime Tributário', type: 'select', placeholder: 'Selecione...', options: [
                  { value: 'lucro_real', label: 'Lucro Real' },
                  { value: 'lucro_presumido', label: 'Lucro Presumido' },
                  { value: 'terceiro_setor', label: 'Terceiro Setor' }
                ]}
              ]}
              onAdd={(data) => {
                const newEmpresa: EmpresaEcdEcf = {
                  id: `ecd-${Date.now()}`,
                  empresa: data.empresa,
                  regimeAtual: (data.regime as RegimeEcdEcf) || '',
                  regimeAnoAnterior: '',
                  statusEcd: 'nao_enviado',
                  dataEcd: '',
                  situacaoEcd: '',
                  statusEcf: 'nao_enviado',
                  dataEcf: '',
                  situacaoEcf: '',
                };
                setEmpresas(prev => [newEmpresa, ...prev]);
                toast.success('Empresa adicionada com sucesso!');
              }}
              trigger={
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Empresa
                </Button>
              }
            />
          </div>
          
          <TabsContent value="ecd" className="mt-0">
            <div className="data-card p-0 overflow-hidden">
              <EcdEcfTable 
                empresas={filteredEmpresas} 
                tipo="ecd" 
                onEmpresaClick={handleEmpresaClick}
                savedDataMap={savedDataMap}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="ecf" className="mt-0">
            <div className="data-card p-0 overflow-hidden">
              <EcdEcfTable 
                empresas={filteredEmpresas} 
                tipo="ecf" 
                onEmpresaClick={handleEmpresaClick}
                savedDataMap={savedDataMap}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Side Panel for editing */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-[55%] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              {editState.empresa}
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Regime Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Regime Tributário
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Regime Atual</Label>
                  <Select 
                    value={editState.regimeAtual || ''} 
                    onValueChange={(v) => setEditState(prev => ({ ...prev, regimeAtual: v as RegimeEcdEcf }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lucro_real">
                        <span className="text-green-600">Lucro Real</span>
                      </SelectItem>
                      <SelectItem value="lucro_presumido">
                        <span className="text-yellow-600">Lucro Presumido</span>
                      </SelectItem>
                      <SelectItem value="terceiro_setor">
                        <span className="text-purple-600">Terceiro Setor</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Regime Ano Anterior</Label>
                  <Select 
                    value={editState.regimeAnoAnterior || ''} 
                    onValueChange={(v) => setEditState(prev => ({ ...prev, regimeAnoAnterior: v as RegimeEcdEcf }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lucro_real">
                        <span className="text-green-600">Lucro Real</span>
                      </SelectItem>
                      <SelectItem value="lucro_presumido">
                        <span className="text-yellow-600">Lucro Presumido</span>
                      </SelectItem>
                      <SelectItem value="terceiro_setor">
                        <span className="text-purple-600">Terceiro Setor</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* ECD Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                ECD - Escrituração Contábil Digital
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={editState.statusEcd || 'nao_enviado'} 
                    onValueChange={(v) => setEditState(prev => ({ ...prev, statusEcd: v as StatusEnvio }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enviado">
                        <span className="text-green-600">Enviado</span>
                      </SelectItem>
                      <SelectItem value="nao_enviado">
                        <span className="text-orange-600">Não Enviado</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Data de Envio</Label>
                  <Input 
                    value={editState.dataEcd || ''} 
                    onChange={(e) => setEditState(prev => ({ ...prev, dataEcd: e.target.value }))}
                    placeholder="Ex: 30 de junho de 2025"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Situação / Observação</Label>
                <Input 
                  value={editState.situacaoEcd || ''} 
                  onChange={(e) => setEditState(prev => ({ ...prev, situacaoEcd: e.target.value }))}
                  placeholder="Ex: SM/ NO FINANCEIRO"
                />
              </div>
            </div>

            <Separator />

            {/* ECF Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                ECF - Escrituração Contábil Fiscal
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={editState.statusEcf || 'nao_enviado'} 
                    onValueChange={(v) => setEditState(prev => ({ ...prev, statusEcf: v as StatusEnvio }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enviado">
                        <span className="text-green-600">Enviado</span>
                      </SelectItem>
                      <SelectItem value="nao_enviado">
                        <span className="text-orange-600">Não Enviado</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Data de Envio</Label>
                  <Input 
                    value={editState.dataEcf || ''} 
                    onChange={(e) => setEditState(prev => ({ ...prev, dataEcf: e.target.value }))}
                    placeholder="Ex: 31 de julho de 2025"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Situação / Observação</Label>
                <Input 
                  value={editState.situacaoEcf || ''} 
                  onChange={(e) => setEditState(prev => ({ ...prev, situacaoEcf: e.target.value }))}
                  placeholder="Ex: AGUARDANDO ECD"
                />
              </div>
            </div>

            <Separator />

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveChanges}>
                Salvar Alterações
              </Button>
            </div>
            
            {/* Remove Button */}
            <DeleteConfirmDialog
              entityName={selectedEmpresa?.empresa || ''}
              onConfirm={() => {
                if (!selectedEmpresa) return;
                setEmpresas(prev => prev.filter(e => e.id !== selectedEmpresa.id));
                setSavedDataMap(prev => {
                  const newMap = { ...prev };
                  delete newMap[selectedEmpresa.id];
                  return newMap;
                });
                toast.success('Empresa removida com sucesso!');
                setSheetOpen(false);
              }}
              trigger={
                <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive gap-2 mt-4">
                  <Trash2 className="h-4 w-4" />
                  Remover Empresa
                </Button>
              }
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EcdEcf;
