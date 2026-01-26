import React, { useState } from 'react';
import { Plus, Grid3X3, SquarePen, Trash2, ListChecks, MessageSquare, Eye, Copy, Check, UserMinus } from 'lucide-react';
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
import { pessoasFisicasCarneLeao, type PessoaFisicaCarneLeao } from '@/mocks/carneLeao';
import { toast } from 'sonner';

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

// Login Badge Component
const LoginBadge: React.FC<{ tipo: string }> = ({ tipo }) => {
  if (!tipo) return <span className="text-sm text-muted-foreground">-</span>;

  const colors: Record<string, string> = {
    'Certificado': 'bg-emerald-100 text-emerald-700',
    'Procuração': 'bg-orange-100 text-orange-700',
    'Conta Gov.': 'bg-sky-100 text-sky-700',
  };

  return (
    <Badge className={`${colors[tipo] || 'bg-gray-100 text-gray-700'} hover:opacity-90 border-0 font-normal text-xs`}>
      {tipo}
    </Badge>
  );
};

// Copiable field component
const CopiableField: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!value) return <span className="text-sm text-muted-foreground">-</span>;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{value}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
      </Button>
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

interface PessoaSavedData {
  checklistItems: ChecklistItem[];
  anotacoes: Anotacao[];
  tipoLogin: string;
  senhaGov: string;
  cpf: string;
}

interface PessoaEditState {
  checklistItems: ChecklistItem[];
  novoChecklistItem: string;
  anotacoes: Anotacao[];
  novaAnotacao: string;
  editingAnotacaoId: string | null;
  editingAnotacaoTexto: string;
  tipoLogin: string;
  senhaGov: string;
  cpf: string;
}

interface PessoasFisicasTableProps {
  pessoas: PessoaFisicaCarneLeao[];
  onPessoaClick: (pessoa: PessoaFisicaCarneLeao) => void;
  savedDataMap: Record<string, PessoaSavedData>;
  onRemove?: (pessoaId: string) => void;
}

const PessoasFisicasTable: React.FC<PessoasFisicasTableProps> = ({ pessoas, onPessoaClick, savedDataMap, onRemove }) => {
  const getPessoaData = (pessoa: PessoaFisicaCarneLeao) => {
    const saved = savedDataMap[pessoa.id];
    if (saved) {
      return {
        tipoLogin: saved.tipoLogin,
        senhaGov: saved.senhaGov,
        cpf: saved.cpf,
        anotacoes: saved.anotacoes,
        checklistItems: saved.checklistItems,
      };
    }
    return {
      tipoLogin: pessoa.tipoLogin,
      senhaGov: pessoa.senhaGov,
      cpf: pessoa.cpf,
      anotacoes: pessoa.anotacao ? [{ id: '1', texto: pessoa.anotacao, data: new Date().toLocaleDateString('pt-BR') }] : [],
      checklistItems: [
        { id: '1', texto: 'Documentos', concluido: pessoa.documentos },
        { id: '2', texto: 'Lançar Documentos', concluido: pessoa.lancarDocumentos },
        { id: '3', texto: 'Digitalizar', concluido: pessoa.digitalizar },
      ],
    };
  };

  const calculateSavedProgress = (pessoa: PessoaFisicaCarneLeao) => {
    const data = getPessoaData(pessoa);
    if (data.checklistItems.length === 0) return 0;
    const completed = data.checklistItems.filter(item => item.concluido).length;
    return (completed / data.checklistItems.length) * 100;
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[250px]">Pessoa Física</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[140px]">Progresso</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[80px] text-center">Detalhes</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[80px] text-center">Anotações</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground min-w-[120px] text-center">Data do fechamento</TableHead>
            {onRemove && <TableHead className="text-xs font-medium text-muted-foreground min-w-[60px] text-center">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pessoas.map((pessoa) => {
            const pessoaData = getPessoaData(pessoa);
            const savedProgress = calculateSavedProgress(pessoa);
            const progressColorClass = savedProgress >= 80 ? 'bg-green-500' : savedProgress >= 40 ? 'bg-yellow-500' : 'bg-red-500';
            
            return (
              <TableRow 
                key={pessoa.id} 
                className="border-b border-border hover:bg-muted/20 cursor-pointer"
                onClick={() => onPessoaClick(pessoa)}
              >
                <TableCell className="py-2 text-sm font-medium text-primary hover:underline">
                  {pessoa.pessoaFisica}
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
                          {pessoaData.checklistItems.map((item, index) => (
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
                          <span className="text-xs text-muted-foreground">Login:</span>
                          <LoginBadge tipo={pessoaData.tipoLogin} />
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Senha Gov:</span>
                          <CopiableField value={pessoaData.senhaGov} label="Senha" />
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">CPF:</span>
                          <CopiableField value={pessoaData.cpf} label="CPF" />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="py-2 text-center" onClick={(e) => e.stopPropagation()}>
                  {pessoaData.anotacoes.length > 0 ? (
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
                            {pessoaData.anotacoes.map(a => a.texto).join(' | ')}
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="py-2 text-sm text-center">{formatDate(pessoa.dataFechamento)}</TableCell>
                {onRemove && (
                  <TableCell className="py-2 text-center" onClick={(e) => e.stopPropagation()}>
                    <DeleteConfirmDialog
                      entityName={pessoa.pessoaFisica}
                      onConfirm={() => onRemove(pessoa.id)}
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

const CarneLeao: React.FC = () => {
  const [activeTab, setActiveTab] = useState('carne-leao-basicas');
  const [pessoasList, setPessoasList] = useState<PessoaFisicaCarneLeao[]>(pessoasFisicasCarneLeao);
  const [selectedPessoa, setSelectedPessoa] = useState<PessoaFisicaCarneLeao | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [savedDataMap, setSavedDataMap] = useState<Record<string, PessoaSavedData>>({});

  const [editState, setEditState] = useState<PessoaEditState>({
    checklistItems: [],
    novoChecklistItem: '',
    anotacoes: [],
    novaAnotacao: '',
    editingAnotacaoId: null,
    editingAnotacaoTexto: '',
    tipoLogin: '',
    senhaGov: '',
    cpf: '',
  });

  const handleAddPessoa = (data: Record<string, string>) => {
    const newPessoa: PessoaFisicaCarneLeao = {
      id: `new-${Date.now()}`,
      pessoaFisica: data.pessoaFisica,
      documentos: false,
      lancarDocumentos: false,
      digitalizar: false,
      carneLancadoPercent: 0,
      anotacao: '',
      dataFechamento: '',
      tipoLogin: (data.tipoLogin as 'Certificado' | 'Procuração' | 'Conta Gov.' | '') || '',
      senhaGov: '',
      cpf: data.cpf || '',
    };
    setPessoasList(prev => [...prev, newPessoa]);
  };

  const handleRemovePessoa = (pessoaId: string) => {
    setPessoasList(prev => prev.filter(p => p.id !== pessoaId));
    setSavedDataMap(prev => {
      const newMap = { ...prev };
      delete newMap[pessoaId];
      return newMap;
    });
  };

  const handlePessoaClick = (pessoa: PessoaFisicaCarneLeao) => {
    setSelectedPessoa(pessoa);
    
    const savedData = savedDataMap[pessoa.id];
    
    if (savedData) {
      setEditState({
        checklistItems: savedData.checklistItems,
        novoChecklistItem: '',
        anotacoes: savedData.anotacoes,
        novaAnotacao: '',
        editingAnotacaoId: null,
        editingAnotacaoTexto: '',
        tipoLogin: savedData.tipoLogin,
        senhaGov: savedData.senhaGov,
        cpf: savedData.cpf,
      });
    } else {
      const existingAnotacoes: Anotacao[] = pessoa.anotacao 
        ? [{ id: '1', texto: pessoa.anotacao, data: new Date().toLocaleDateString('pt-BR') }]
        : [];
      
      const defaultChecklist: ChecklistItem[] = [
        { id: '1', texto: 'Documentos', concluido: pessoa.documentos },
        { id: '2', texto: 'Lançar Documentos', concluido: pessoa.lancarDocumentos },
        { id: '3', texto: 'Digitalizar', concluido: pessoa.digitalizar },
      ];
      
      setEditState({
        checklistItems: defaultChecklist,
        novoChecklistItem: '',
        anotacoes: existingAnotacoes,
        novaAnotacao: '',
        editingAnotacaoId: null,
        editingAnotacaoTexto: '',
        tipoLogin: pessoa.tipoLogin,
        senhaGov: pessoa.senhaGov,
        cpf: pessoa.cpf,
      });
    }
    setSheetOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedPessoa) return;
    
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
      [selectedPessoa.id]: {
        checklistItems: editState.checklistItems,
        anotacoes: anotacoesFinais,
        tipoLogin: editState.tipoLogin,
        senhaGov: editState.senhaGov,
        cpf: editState.cpf,
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

  const handleCopyField = (value: string, label: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success(`${label} copiado!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <TopBar title="CARNÊ LEÃO" subtitle="CONTÁBIL" />

      {/* Page Description */}
      <PageDescription description="Controle de Carnê-Leão para pessoas físicas. Acompanhe lançamentos, digitalização de documentos, credenciais de acesso e progresso das atividades." />

      {/* Tabs and Table */}
      <div className="px-6 pb-6 pt-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
              <TabsTrigger
                value="carne-leao-basicas"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-sm"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                CARNÊ LEÃO BÁSICAS
              </TabsTrigger>
            </TabsList>
            <AddEntityDialog
              title="Adicionar Pessoa Física"
              buttonLabel="Adicionar Pessoa"
              fields={[
                { name: 'pessoaFisica', label: 'Nome Completo', type: 'text', placeholder: 'Nome da pessoa física', required: true },
                { name: 'cpf', label: 'CPF', type: 'text', placeholder: 'XXX.XXX.XXX-XX' },
                { name: 'tipoLogin', label: 'Tipo de Login', type: 'select', options: [
                  { value: 'Certificado', label: 'Certificado' },
                  { value: 'Procuração', label: 'Procuração' },
                  { value: 'Conta Gov.', label: 'Conta Gov.' },
                ] },
              ]}
              onAdd={handleAddPessoa}
            />
          </div>

          <div className="border border-border rounded-sm overflow-hidden">
            <TabsContent value="carne-leao-basicas" className="m-0">
              <PessoasFisicasTable 
                pessoas={pessoasList} 
                onPessoaClick={handlePessoaClick} 
                savedDataMap={savedDataMap}
                onRemove={handleRemovePessoa}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Side Panel / Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:w-[55%] sm:max-w-[800px] overflow-y-auto">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-lg font-bold">
              {selectedPessoa?.pessoaFisica}
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="py-6 space-y-6 pr-4">
              {/* Detalhes de Acesso */}
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Tipo de Login</Label>
                  <Select 
                    value={editState.tipoLogin || 'empty'} 
                    onValueChange={(value) => setEditState(prev => ({ ...prev, tipoLogin: value === 'empty' ? '' : value }))}
                  >
                    <SelectTrigger className={`mt-1 h-8 text-sm ${
                      editState.tipoLogin === 'Certificado' ? 'text-emerald-700 font-medium' :
                      editState.tipoLogin === 'Procuração' ? 'text-orange-700 font-medium' :
                      editState.tipoLogin === 'Conta Gov.' ? 'text-sky-700 font-medium' : ''
                    }`}>
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">-</SelectItem>
                      <SelectItem value="Certificado" className="text-emerald-700 font-medium">Certificado</SelectItem>
                      <SelectItem value="Procuração" className="text-orange-700 font-medium">Procuração</SelectItem>
                      <SelectItem value="Conta Gov." className="text-sky-700 font-medium">Conta Gov.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">CPF</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input 
                      value={editState.cpf}
                      onChange={(e) => {
                        // Format CPF
                        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                        let formatted = value;
                        if (value.length > 9) {
                          formatted = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
                        } else if (value.length > 6) {
                          formatted = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
                        } else if (value.length > 3) {
                          formatted = `${value.slice(0, 3)}.${value.slice(3)}`;
                        }
                        setEditState(prev => ({ ...prev, cpf: formatted }));
                      }}
                      placeholder="000.000.000-00"
                      className="h-8 text-sm flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyField(editState.cpf, 'CPF')}
                      disabled={!editState.cpf}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 rounded-md border border-border bg-muted/10">
                  <Label className="text-xs text-muted-foreground">Senha</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input 
                      value={editState.senhaGov}
                      onChange={(e) => setEditState(prev => ({ ...prev, senhaGov: e.target.value }))}
                      placeholder="Digite a senha"
                      className="h-8 text-sm flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyField(editState.senhaGov, 'Senha')}
                      disabled={!editState.senhaGov}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Checklist */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Checklist - Atividades do Carnê</Label>
                </div>
                
                {/* Add new item input */}
                <div className="flex gap-2">
                  <Input 
                    placeholder="Adicionar nova atividade..."
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
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade adicionada</p>
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

              <Separator />
              
              {/* Save Button */}
              <Button className="w-full" onClick={handleSaveChanges}>
                Salvar Alterações
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CarneLeao;
