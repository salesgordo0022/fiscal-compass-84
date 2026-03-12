import React, { useState, useRef } from 'react';
import { ColumnFilterInput, useColumnFilters } from '@/components/ui/column-filter';
import TopBar from '@/components/layout/TopBar';
import PageDescription from '@/components/layout/PageDescription';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, MessageSquare, SquarePen, Trash2, Copy, X, Plus, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import AddEntityDialog from '@/components/dialogs/AddEntityDialog';
import DeleteConfirmDialog from '@/components/dialogs/DeleteConfirmDialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { entidadesTerceiroSetor, entidadesSaiu, EntidadeTerceiroSetor, StatusTerceiroSetor, AtividadeTerceiroSetor } from '@/mocks/terceiroSetor';
import { toast } from 'sonner';

// Status Badge Component
const StatusBadge: React.FC<{ status: StatusTerceiroSetor }> = ({ status }) => {
  if (!status) return <span className="text-muted-foreground">-</span>;
  
  const getStatusStyle = () => {
    switch (status) {
      case 'Com movimento':
        return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
      case 'Sem movimento':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'Declaração S/M':
        return 'bg-amber-500/20 text-amber-700 border-amber-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusStyle()} text-xs font-medium whitespace-nowrap`}>
      {status}
    </Badge>
  );
};

// Progress Bar with colors based on percentage and popover
const ProgressBar: React.FC<{ atividades: AtividadeTerceiroSetor[] }> = ({ atividades }) => {
  const concluidas = atividades.filter(a => a.concluida).length;
  const total = atividades.length;
  const porcentagem = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  const getProgressColor = () => {
    if (porcentagem === 100) return 'bg-emerald-500';
    if (porcentagem > 0) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <Progress 
        value={porcentagem} 
        className="h-2 flex-1" 
        indicatorClassName={getProgressColor()}
      />
      <Popover>
        <PopoverTrigger asChild>
          <button className="text-xs text-muted-foreground w-8 hover:text-primary cursor-pointer">
            {porcentagem}%
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Atividades</h4>
            <div className="space-y-2">
              {atividades.map((atividade) => (
                <div key={atividade.id} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${atividade.concluida ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <span className={`text-sm ${atividade.concluida ? 'line-through text-muted-foreground' : ''}`}>
                    {atividade.nome}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t text-xs text-muted-foreground">
              {concluidas} de {total} concluídas
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const TerceiroSetor: React.FC = () => {
  const [entidades, setEntidades] = useState<EntidadeTerceiroSetor[]>(entidadesTerceiroSetor);
  const [entidadesSaiuState, setEntidadesSaiuState] = useState<EntidadeTerceiroSetor[]>(entidadesSaiu);
  const entidadesFilters = useColumnFilters(['codigo', 'empresa', 'status', 'dataRotina'] as const);
  const saiuFilters = useColumnFilters(['codigo', 'empresa', 'status', 'dataRotina'] as const);
  const [selectedEntidade, setSelectedEntidade] = useState<EntidadeTerceiroSetor | null>(null);
  const [selectedTabType, setSelectedTabType] = useState<'entidades' | 'saiu'>('entidades');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'com-movimento' | 'sem-movimento' | 'declaracao'>('all');
  const [editingCode, setEditingCode] = useState(false);
  const [tempCode, setTempCode] = useState('');
  const [newAnotacao, setNewAnotacao] = useState('');
  const [anotacoes, setAnotacoes] = useState<string[]>([]);
  const [editingAnotacaoIndex, setEditingAnotacaoIndex] = useState<number | null>(null);
  const [editingAnotacaoText, setEditingAnotacaoText] = useState('');
  const [atividades, setAtividades] = useState<AtividadeTerceiroSetor[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState('entidades');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    codigo: '',
    empresa: '',
    status: '' as StatusTerceiroSetor,
    modeloInform: '',
    acessos: '',
    cnpj: '',
    dataRotina: '',
  });

  // Importar planilha
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

        if (jsonData.length === 0) {
          toast.error('Planilha vazia ou formato inválido');
          setIsImporting(false);
          return;
        }

        const firstRow = jsonData[0];
        const columnHeaders = Object.keys(firstRow);
        console.log('Colunas detectadas:', columnHeaders);

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

        const empresaCol = findCol(firstRow, ['empresa', 'apelido', 'razão social', 'razao social', 'nome fantasia', 'denominação', 'denominacao', 'nome', 'entidade']);
        const cnpjCol = findCol(firstRow, ['numero', 'número', 'cnpj', 'cpf/cnpj', 'cnpj/cpf', 'cnpjcpf/cei', 'cnpjcpf', 'cpf']);
        const codCol = findCol(firstRow, ['cod', 'código', 'codigo', '#', 'id', 'seq']);

        if (!empresaCol) {
          toast.error(`Coluna de nome não encontrada. Colunas: ${columnHeaders.join(', ')}`);
          setIsImporting(false);
          return;
        }

        console.log('Mapeamento:', { empresaCol, cnpjCol, codCol });

        const newList: EntidadeTerceiroSetor[] = [];
        jsonData.forEach((row) => {
          const empresaNome = String(row[empresaCol] || '').trim();
          if (!empresaNome) return;

          const cnpj = cnpjCol ? String(row[cnpjCol] || '').trim() : '';
          const cod = codCol ? String(row[codCol] || '').trim() : '';

          newList.push({
            id: `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            codigo: cod,
            empresa: empresaNome,
            atividades: [
              { id: '1', nome: 'Lançamentos', concluida: false },
              { id: '2', nome: 'Conciliação', concluida: false },
              { id: '3', nome: 'Conferência', concluida: false },
              { id: '4', nome: 'Fechamento', concluida: false },
            ],
            anotacao: '',
            status: 'Com movimento',
            modeloInform: '',
            acessos: '',
            cnpj,
            dataRotina: '',
          });
        });

        if (activeTab === 'entidades') {
          setEntidades(newList);
        } else {
          setEntidadesSaiuState(newList);
        }

        toast.success(`${newList.length} entidade(s) importada(s)`);
      } catch (error) {
        console.error('Erro ao importar:', error);
        toast.error('Erro ao importar planilha.');
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Stats - Combining both tabs
  const allEntidades = [...entidades, ...entidadesSaiuState];
  const totalEntidades = allEntidades.length;
  const comMovimento = allEntidades.filter(e => e.status === 'Com movimento').length;
  const semMovimento = allEntidades.filter(e => e.status === 'Sem movimento').length;
  const declaracaoSM = allEntidades.filter(e => e.status === 'Declaração S/M').length;

  // Filter entities
  const getFilteredEntidades = () => {
    switch (filter) {
      case 'com-movimento':
        return entidades.filter(e => e.status === 'Com movimento');
      case 'sem-movimento':
        return entidades.filter(e => e.status === 'Sem movimento');
      case 'declaracao':
        return entidades.filter(e => e.status === 'Declaração S/M');
      default:
        return entidades;
    }
  };

  const filteredEntidades = getFilteredEntidades().filter((e) =>
    entidadesFilters.matchesFilter(e.codigo, 'codigo') &&
    entidadesFilters.matchesFilter(e.empresa, 'empresa') &&
    entidadesFilters.matchesSelectFilter(e.status, 'status') &&
    entidadesFilters.matchesFilter(e.dataRotina, 'dataRotina')
  );

  const filteredSaiu = entidadesSaiuState.filter((e) =>
    saiuFilters.matchesFilter(e.codigo, 'codigo') &&
    saiuFilters.matchesFilter(e.empresa, 'empresa') &&
    saiuFilters.matchesSelectFilter(e.status, 'status') &&
    saiuFilters.matchesFilter(e.dataRotina, 'dataRotina')
  );

  const handleOpenSheet = (entidade: EntidadeTerceiroSetor, tabType: 'entidades' | 'saiu') => {
    setSelectedEntidade(entidade);
    setSelectedTabType(tabType);
    setFormData({
      codigo: entidade.codigo,
      empresa: entidade.empresa,
      status: entidade.status,
      modeloInform: entidade.modeloInform,
      acessos: entidade.acessos,
      cnpj: entidade.cnpj,
      dataRotina: entidade.dataRotina,
    });
    setTempCode(entidade.codigo);
    setAnotacoes(entidade.anotacao ? [entidade.anotacao] : []);
    setAtividades([...entidade.atividades]);
    setNewAnotacao('');
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    if (!selectedEntidade) return;

    const allAnotacoes = [...anotacoes];
    if (newAnotacao.trim()) {
      allAnotacoes.push(newAnotacao.trim());
    }

    const updatedEntidade = { 
      ...selectedEntidade, 
      ...formData,
      codigo: tempCode,
      atividades: [...atividades],
      anotacao: allAnotacoes.join(' | ')
    };

    if (selectedTabType === 'entidades') {
      setEntidades(prev => prev.map(e => 
        e.id === selectedEntidade.id ? updatedEntidade : e
      ));
    } else {
      setEntidadesSaiuState(prev => prev.map(e => 
        e.id === selectedEntidade.id ? updatedEntidade : e
      ));
    }
    
    toast.success('Alterações salvas com sucesso!');
    setIsSheetOpen(false);
  };

  const handleToggleAtividade = (atividadeId: string) => {
    setAtividades(prev => prev.map(a => 
      a.id === atividadeId ? { ...a, concluida: !a.concluida } : a
    ));
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const handleDeleteAnotacao = (index: number) => {
    setAnotacoes(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditAnotacao = (index: number) => {
    setEditingAnotacaoIndex(index);
    setEditingAnotacaoText(anotacoes[index]);
  };

  const handleSaveAnotacaoEdit = () => {
    if (editingAnotacaoIndex !== null) {
      setAnotacoes(prev => prev.map((a, i) => i === editingAnotacaoIndex ? editingAnotacaoText : a));
      setEditingAnotacaoIndex(null);
      setEditingAnotacaoText('');
    }
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Terceiro Setor" subtitle="Contábil" />
      <PageDescription description="Gestão contábil especializada para entidades do Terceiro Setor. Controle de ONGs, associações, fundações, igrejas e sindicatos." />
      
      <div className="p-6 animate-fade-in space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            className={`data-card text-center cursor-pointer transition-all hover:scale-[1.02] ${filter === 'all' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setFilter('all')}
          >
            <p className="text-3xl font-bold">{totalEntidades}</p>
            <p className="text-sm text-muted-foreground mt-1">Total de Entidades</p>
          </div>
          <div 
            className={`data-card text-center cursor-pointer transition-all hover:scale-[1.02] ${filter === 'com-movimento' ? 'ring-2 ring-emerald-500' : ''}`}
            onClick={() => setFilter('com-movimento')}
          >
            <p className="text-3xl font-bold text-emerald-600">{comMovimento}</p>
            <p className="text-sm text-muted-foreground mt-1">Com Movimento</p>
          </div>
          <div 
            className={`data-card text-center cursor-pointer transition-all hover:scale-[1.02] ${filter === 'sem-movimento' ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => setFilter('sem-movimento')}
          >
            <p className="text-3xl font-bold text-red-600">{semMovimento}</p>
            <p className="text-sm text-muted-foreground mt-1">Sem Movimento</p>
          </div>
          <div 
            className={`data-card text-center cursor-pointer transition-all hover:scale-[1.02] ${filter === 'declaracao' ? 'ring-2 ring-amber-500' : ''}`}
            onClick={() => setFilter('declaracao')}
          >
            <p className="text-3xl font-bold text-amber-600">{declaracaoSM}</p>
            <p className="text-sm text-muted-foreground mt-1">Declaração S/M</p>
          </div>
        </div>

        {/* Filter Badge */}
        {filter !== 'all' && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-2">
              Exibindo: {filter === 'com-movimento' ? 'Com Movimento' : filter === 'sem-movimento' ? 'Sem Movimento' : 'Declaração S/M'}
              <button onClick={() => setFilter('all')} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="entidades" className="data-[state=active]:bg-background">
                ENTIDADES DO TERCEIRO SETOR
              </TabsTrigger>
              <TabsTrigger value="saiu" className="data-[state=active]:bg-background">
                SAIU
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
                title="Adicionar Entidade"
                buttonLabel="Adicionar Entidade"
                fields={[
                  { name: 'empresa', label: 'Nome da Entidade', type: 'text', placeholder: 'Digite o nome da entidade...', required: true }
                ]}
                onAdd={(data) => {
                  const newEntidade: EntidadeTerceiroSetor = {
                    id: `ts-${Date.now()}`,
                    codigo: '',
                    empresa: data.empresa,
                    atividades: [
                      { id: '1', nome: 'Lançamentos', concluida: false },
                      { id: '2', nome: 'Conciliação', concluida: false },
                      { id: '3', nome: 'Conferência', concluida: false },
                      { id: '4', nome: 'Fechamento', concluida: false },
                    ],
                    anotacao: '',
                    status: 'Com movimento',
                    modeloInform: '',
                    acessos: '',
                    cnpj: '',
                    dataRotina: new Date().toISOString().split('T')[0],
                  };
                  if (activeTab === 'entidades') {
                    setEntidades(prev => [newEntidade, ...prev]);
                  } else {
                    setEntidadesSaiuState(prev => [newEntidade, ...prev]);
                  }
                  toast.success('Entidade adicionada com sucesso!');
                }}
                trigger={
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Entidade
                  </Button>
                }
              />
            </div>
          </div>

          <TabsContent value="entidades" className="mt-4">
            <div className="data-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-medium text-muted-foreground w-[60px]">COD.</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground min-w-[300px]">Empresas</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[140px]">Progresso</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[80px] text-center">Anotação</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[120px]">Status</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[80px] text-center">Detalhes</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[120px] text-center">Rotinas</TableHead>
                  </TableRow>
                  <TableRow className="bg-muted/10 hover:bg-muted/10">
                    <TableHead className="py-1 px-2"><ColumnFilterInput value={entidadesFilters.filters.codigo} onChange={(v) => entidadesFilters.setFilter('codigo', v)} placeholder="Buscar cod..." /></TableHead>
                    <TableHead className="py-1 px-2"><ColumnFilterInput value={entidadesFilters.filters.empresa} onChange={(v) => entidadesFilters.setFilter('empresa', v)} placeholder="Buscar empresa..." /></TableHead>
                    <TableHead className="py-1 px-2" />
                    <TableHead className="py-1 px-2" />
                    <TableHead className="py-1 px-2">
                      <ColumnFilterInput 
                        type="select" 
                        value={entidadesFilters.filters.status} 
                        onChange={(v) => entidadesFilters.setFilter('status', v)} 
                        placeholder="Todos"
                        options={[
                          { value: 'Com movimento', label: 'Com movimento' },
                          { value: 'Sem movimento', label: 'Sem movimento' },
                          { value: 'Declaração S/M', label: 'Declaração S/M' },
                        ]}
                      />
                    </TableHead>
                    <TableHead className="py-1 px-2" />
                    <TableHead className="py-1 px-2"><ColumnFilterInput value={entidadesFilters.filters.dataRotina} onChange={(v) => entidadesFilters.setFilter('dataRotina', v)} placeholder="Buscar data..." /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntidades.map((entidade) => (
                    <TableRow key={entidade.id} className="hover:bg-muted/50">
                      <TableCell className="py-2 text-sm font-medium">
                        {entidade.codigo || '-'}
                      </TableCell>
                      <TableCell 
                        className="py-2 text-sm cursor-pointer hover:text-primary hover:underline"
                        onClick={() => handleOpenSheet(entidade, 'entidades')}
                      >
                        {entidade.empresa}
                      </TableCell>
                      <TableCell className="py-2">
                        <ProgressBar atividades={entidade.atividades} />
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        {entidade.anotacao ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="p-1 hover:bg-muted rounded">
                                <MessageSquare className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Anotação</h4>
                                <p className="text-sm text-muted-foreground">{entidade.anotacao}</p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        <StatusBadge status={entidade.status} />
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        {(entidade.cnpj || entidade.modeloInform || entidade.acessos) ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="p-1 hover:bg-muted rounded">
                                <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-3">
                                <h4 className="font-medium text-sm">Detalhes</h4>
                                {entidade.cnpj && (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs text-muted-foreground">CNPJ</p>
                                      <p className="text-sm font-medium font-mono">{entidade.cnpj}</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7"
                                      onClick={() => handleCopy(entidade.cnpj, 'CNPJ')}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                                {entidade.acessos && (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Acessos (E-mail)</p>
                                      <p className="text-sm font-medium">{entidade.acessos}</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7"
                                      onClick={() => handleCopy(entidade.acessos, 'Acesso')}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                                {entidade.modeloInform && (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Modelo de Informações</p>
                                      <p className="text-sm font-medium">{entidade.modeloInform}</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7"
                                      onClick={() => handleCopy(entidade.modeloInform, 'Informação')}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="py-2 text-sm text-center">
                        {entidade.dataRotina || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="saiu" className="mt-4">
            <div className="data-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-medium text-muted-foreground w-[60px]">COD.</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground min-w-[300px]">Empresas</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[140px]">Progresso</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[80px] text-center">Anotação</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[120px]">Status</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[80px] text-center">Detalhes</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[120px] text-center">Rotinas</TableHead>
                  </TableRow>
                  <TableRow className="bg-muted/10 hover:bg-muted/10">
                    <TableHead className="py-1 px-2"><ColumnFilterInput value={saiuFilters.filters.codigo} onChange={(v) => saiuFilters.setFilter('codigo', v)} placeholder="Buscar cod..." /></TableHead>
                    <TableHead className="py-1 px-2"><ColumnFilterInput value={saiuFilters.filters.empresa} onChange={(v) => saiuFilters.setFilter('empresa', v)} placeholder="Buscar empresa..." /></TableHead>
                    <TableHead className="py-1 px-2" />
                    <TableHead className="py-1 px-2" />
                    <TableHead className="py-1 px-2">
                      <ColumnFilterInput 
                        type="select" 
                        value={saiuFilters.filters.status} 
                        onChange={(v) => saiuFilters.setFilter('status', v)} 
                        placeholder="Todos"
                        options={[
                          { value: 'Com movimento', label: 'Com movimento' },
                          { value: 'Sem movimento', label: 'Sem movimento' },
                          { value: 'Declaração S/M', label: 'Declaração S/M' },
                        ]}
                      />
                    </TableHead>
                    <TableHead className="py-1 px-2" />
                    <TableHead className="py-1 px-2"><ColumnFilterInput value={saiuFilters.filters.dataRotina} onChange={(v) => saiuFilters.setFilter('dataRotina', v)} placeholder="Buscar data..." /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSaiu.map((entidade) => (
                    <TableRow key={entidade.id} className="hover:bg-muted/50">
                      <TableCell className="py-2 text-sm font-medium">
                        {entidade.codigo || '-'}
                      </TableCell>
                      <TableCell 
                        className="py-2 text-sm cursor-pointer hover:text-primary hover:underline"
                        onClick={() => handleOpenSheet(entidade, 'saiu')}
                      >
                        {entidade.empresa}
                      </TableCell>
                      <TableCell className="py-2">
                        <ProgressBar atividades={entidade.atividades} />
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        {entidade.anotacao ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="p-1 hover:bg-muted rounded">
                                <MessageSquare className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Anotação</h4>
                                <p className="text-sm text-muted-foreground">{entidade.anotacao}</p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        <StatusBadge status={entidade.status} />
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        {(entidade.cnpj || entidade.modeloInform || entidade.acessos) ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="p-1 hover:bg-muted rounded">
                                <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-3">
                                <h4 className="font-medium text-sm">Detalhes</h4>
                                {entidade.cnpj && (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs text-muted-foreground">CNPJ</p>
                                      <p className="text-sm font-medium font-mono">{entidade.cnpj}</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7"
                                      onClick={() => handleCopy(entidade.cnpj, 'CNPJ')}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                                {entidade.acessos && (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Acessos (E-mail)</p>
                                      <p className="text-sm font-medium">{entidade.acessos}</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7"
                                      onClick={() => handleCopy(entidade.acessos, 'Acesso')}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                                {entidade.modeloInform && (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Modelo de Informações</p>
                                      <p className="text-sm font-medium">{entidade.modeloInform}</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7"
                                      onClick={() => handleCopy(entidade.modeloInform, 'Informação')}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="py-2 text-sm text-center">
                        {entidade.dataRotina || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Side Panel */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-[55%] overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center gap-3">
              {editingCode ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">COD:</span>
                  <Input
                    value={tempCode}
                    onChange={(e) => setTempCode(e.target.value)}
                    className="w-20 h-7 text-sm"
                    onBlur={() => setEditingCode(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingCode(false)}
                    autoFocus
                  />
                </div>
              ) : (
                <button 
                  className="flex items-center gap-2 hover:text-primary"
                  onClick={() => setEditingCode(true)}
                >
                  <SquarePen className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">COD: {tempCode || '-'}</span>
                </button>
              )}
            </div>
            <SheetTitle className="text-left">{selectedEntidade?.empresa}</SheetTitle>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* Checklist de Atividades */}
            <div className="space-y-3">
              <Label>Atividades de Lançamento</Label>
              <div className="space-y-2">
                {atividades.map((atividade) => (
                  <div 
                    key={atividade.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <Checkbox 
                      checked={atividade.concluida}
                      onCheckedChange={() => handleToggleAtividade(atividade.id)}
                    />
                    <span className={`text-sm ${atividade.concluida ? 'line-through text-muted-foreground' : ''}`}>
                      {atividade.nome}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CNPJ with copy */}
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={formData.cnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                  placeholder="00.000.000/0000-00"
                  className="font-mono"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleCopy(formData.cnpj, 'CNPJ')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: StatusTerceiroSetor) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Com movimento">
                    <span className="text-emerald-600">Com movimento</span>
                  </SelectItem>
                  <SelectItem value="Sem movimento">
                    <span className="text-red-600">Sem movimento</span>
                  </SelectItem>
                  <SelectItem value="Declaração S/M">
                    <span className="text-amber-600">Declaração S/M</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Modelo de Informações */}
            <div className="space-y-2">
              <Label>Modelo de Informações</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={formData.modeloInform}
                  onChange={(e) => setFormData(prev => ({ ...prev, modeloInform: e.target.value }))}
                  placeholder="Ex: ONBALANCE: usuario123"
                />
                {formData.modeloInform && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleCopy(formData.modeloInform, 'Informação')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Acessos */}
            <div className="space-y-2">
              <Label>Acessos (E-mail/Login)</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={formData.acessos}
                  onChange={(e) => setFormData(prev => ({ ...prev, acessos: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
                {formData.acessos && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleCopy(formData.acessos, 'Acesso')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Data de Rotina */}
            <div className="space-y-2">
              <Label>Data de Rotina</Label>
              <Input
                value={formData.dataRotina}
                onChange={(e) => setFormData(prev => ({ ...prev, dataRotina: e.target.value }))}
                placeholder="dd/mm/aaaa"
              />
            </div>

            {/* Anotações */}
            <div className="space-y-3">
              <Label>Anotações</Label>
              
              {anotacoes.length > 0 && (
                <div className="space-y-2">
                  {anotacoes.map((anotacao, index) => (
                    <div key={index} className="group flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                      {editingAnotacaoIndex === index ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={editingAnotacaoText}
                            onChange={(e) => setEditingAnotacaoText(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <Button size="sm" onClick={handleSaveAnotacaoEdit}>Salvar</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingAnotacaoIndex(null)}>Cancelar</Button>
                        </div>
                      ) : (
                        <>
                          <p className="flex-1 text-sm">{anotacao}</p>
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                            <button 
                              className="p-1 hover:bg-muted rounded"
                              onClick={() => handleEditAnotacao(index)}
                            >
                              <SquarePen className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                            <button 
                              className="p-1 hover:bg-destructive/10 rounded"
                              onClick={() => handleDeleteAnotacao(index)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Textarea
                value={newAnotacao}
                onChange={(e) => setNewAnotacao(e.target.value)}
                placeholder="Digite uma nova anotação..."
                className="min-h-[80px]"
              />
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t space-y-3">
              <Button onClick={handleSave} className="w-full">
                Salvar Alterações
              </Button>
              <DeleteConfirmDialog
                entityName={selectedEntidade?.empresa || ''}
                onConfirm={() => {
                  if (!selectedEntidade) return;
                  if (selectedTabType === 'entidades') {
                    setEntidades(prev => prev.filter(e => e.id !== selectedEntidade.id));
                  } else {
                    setEntidadesSaiuState(prev => prev.filter(e => e.id !== selectedEntidade.id));
                  }
                  toast.success('Entidade removida com sucesso!');
                  setIsSheetOpen(false);
                }}
                trigger={
                  <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive gap-2">
                    <Trash2 className="h-4 w-4" />
                    Remover Entidade
                  </Button>
                }
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TerceiroSetor;
