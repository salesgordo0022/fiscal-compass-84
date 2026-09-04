import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import TopBar from '@/components/layout/TopBar';
import PageDescription from '@/components/layout/PageDescription';
import { Plus, Upload, SquarePen, Trash2, ListChecks, Check, MessageSquare, Eye, Search, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddEntityDialog from '@/components/dialogs/AddEntityDialog';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { type EmpresaPlanilha } from '@/mocks/planilhaGeral';
import { 
  type EmpresaSavedData, 
  type EmpresaEditState,
  type Anotacao,
  type ChecklistItem,
  emptyLalurState,
  parseLalurValue,
  formatLalurValue,
  EmpresasTable,
  formatDate
} from './PlanilhaGeral';

const SimplesNacional: React.FC = () => {
  const [empresasSimplesNacionalList, setEmpresasSimplesNacionalList] = useState<EmpresaPlanilha[]>([]);
  const [savedDataMap, setSavedDataMap] = useState<Record<string, EmpresaSavedData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaPlanilha | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    regime: 'Simples nacional',
    situacao: '',
    mensalidades: '',
    regimeAnoAnterior: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: dbEmpresas, error: empresasError } = await supabase
          .from('planilha_geral_empresas' as any)
          .select('*')
          .eq('tab', 'simples-nacional');

        if (!empresasError && dbEmpresas) {
          const list: EmpresaPlanilha[] = dbEmpresas.map((emp: any) => ({
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
            regime: emp.regime || 'Simples nacional',
            situacao: emp.situacao || '',
            mensalidades: emp.mensalidades || '',
            regimeAnoAnterior: emp.regime_ano_anterior || '',
            responsavel: emp.responsavel || '',
          }));
          setEmpresasSimplesNacionalList(list);
        }

        const { data: dbSavedData, error: savedError } = await supabase
          .from('planilha_geral_saved_data' as any)
          .select('*');

        if (!savedError && dbSavedData) {
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
            };
          });
          setSavedDataMap(map);
        }
        setDbInitialized(true);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEmpresaClick = (empresa: EmpresaPlanilha) => {
    setSelectedEmpresa(empresa);
    const saved = savedDataMap[empresa.id];
    
    if (saved) {
      setEditState({
        codigo: saved.codigo,
        cnpj: saved.cnpj,
        editandoCodigo: false,
        checklistItems: saved.checklistItems,
        novoChecklistItem: '',
        anotacoes: saved.anotacoes,
        novaAnotacao: '',
        editingAnotacaoId: null,
        editingAnotacaoTexto: '',
        trimestre: saved.trimestre,
        lalur: saved.lalur,
        contDigital: saved.contDigital,
        regime: saved.regime || 'Simples nacional',
        situacao: saved.situacao,
        mensalidades: saved.mensalidades,
        regimeAnoAnterior: saved.regimeAnoAnterior,
      });
    } else {
      const defaultChecklist = [
        { id: '1', texto: 'Solicitação', concluido: empresa.solicitacao },
        { id: '2', texto: 'Despesas', concluido: empresa.despesas },
        { id: '3', texto: 'Mister/Cont. dig', concluido: empresa.misterContDig },
        { id: '4', texto: 'Conferir extratos', concluido: empresa.conferirExtratos },
        { id: '5', texto: 'Conciliação impostos', concluido: empresa.conciliacaoImpostos },
      ];
      const existingAnotacoes = empresa.anotacao ? [{ id: '1', texto: empresa.anotacao, data: new Date().toLocaleDateString('pt-BR') }] : [];
      
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
        regime: empresa.regime || 'Simples nacional',
        situacao: empresa.situacao,
        mensalidades: empresa.mensalidades,
        regimeAnoAnterior: empresa.regimeAnoAnterior,
      });
    }
    setSheetOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedEmpresa) return;
    
    let anotacoesFinais = editState.anotacoes;
    if (editState.novaAnotacao.trim()) {
      const newAnotacao: Anotacao = {
        id: Date.now().toString(),
        texto: editState.novaAnotacao,
        data: new Date().toLocaleDateString('pt-BR'),
      };
      anotacoesFinais = [...editState.anotacoes, newAnotacao];
    }
    
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
    };

    setSavedDataMap(prev => ({ ...prev, [selectedEmpresa.id]: newSavedData }));

    await supabase.from('planilha_geral_saved_data' as any).upsert({
      empresa_id: selectedEmpresa.id,
      codigo: newSavedData.codigo,
      cnpj: newSavedData.cnpj,
      checklist_items: newSavedData.checklistItems,
      anotacoes: newSavedData.anotacoes,
      trimestre: newSavedData.trimestre,
      lalur: newSavedData.lalur,
      cont_digital: newSavedData.contDigital,
      regime: newSavedData.regime,
      situacao: newSavedData.situacao,
      mensalidades: newSavedData.mensalidades,
      regime_ano_anterior: newSavedData.regimeAnoAnterior,
    });

    setSheetOpen(false);
    toast.success('Alterações salvas com sucesso!');
  };

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
          toast.error('Planilha vazia');
          setIsImporting(false);
          return;
        }

        await supabase.from('planilha_geral_empresas' as any).delete().eq('tab', 'simples-nacional');

        const importedList: EmpresaPlanilha[] = jsonData.map((row, index) => {
          const keys = Object.keys(row);
          const empresaCol = keys.find(k => k.toLowerCase().includes('empresa') || k.toLowerCase().includes('nome'));
          const cnpjCol = keys.find(k => k.toLowerCase().includes('cnpj'));
          const codCol = keys.find(k => k.toLowerCase().includes('cod'));

          return {
            id: `sn-import-${Date.now()}-${index}`,
            cod: codCol ? String(row[codCol]) : '',
            cnpj: cnpjCol ? String(row[cnpjCol]) : '',
            empresa: empresaCol ? String(row[empresaCol]) : 'Sem Nome',
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
            regime: 'Simples nacional',
            situacao: '',
            mensalidades: '',
            regimeAnoAnterior: '',
          };
        });

        for (const emp of importedList) {
          await supabase.from('planilha_geral_empresas' as any).insert({
            id: emp.id,
            cod: emp.cod,
            cnpj: emp.cnpj,
            empresa: emp.empresa,
            regime: emp.regime,
            tab: 'simples-nacional'
          });
        }

        setEmpresasSimplesNacionalList(importedList);
        toast.success(`${importedList.length} empresas importadas.`);
      } catch (err) {
        toast.error('Erro na importação.');
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleAddEmpresa = async (data: Record<string, string>) => {
    const newEmpresa: EmpresaPlanilha = {
      id: `sn-new-${Date.now()}`,
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
      regime: 'Simples nacional',
      situacao: '',
      mensalidades: '',
      regimeAnoAnterior: '',
    };

    await supabase.from('planilha_geral_empresas' as any).insert({
      id: newEmpresa.id,
      cod: newEmpresa.cod,
      empresa: newEmpresa.empresa,
      regime: newEmpresa.regime,
      tab: 'simples-nacional'
    });

    setEmpresasSimplesNacionalList(prev => [...prev, newEmpresa]);
    toast.success('Empresa adicionada!');
  };

  const calculateEditProgress = (): number => {
    if (editState.checklistItems.length === 0) return 0;
    const completed = editState.checklistItems.filter(item => item.concluido).length;
    return (completed / editState.checklistItems.length) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="SIMPLES NACIONAL" subtitle="CONTÁBIL" />
      <PageDescription description="Controle de empresas enquadradas no Simples Nacional. Gerencie situação fiscal, obrigações e progresso das tarefas." />
      
      <div className="px-6 pb-6 pt-4">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
           <h3 className="text-lg font-bold flex items-center gap-2">
             <Grid3X3 className="h-5 w-5 text-primary" />
             EMPRESAS SIMPLES NACIONAL
           </h3>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
                {isImporting ? 'Carregando...' : <><Upload className="h-4 w-4 mr-2" /> Importar Planilha</>}
              </Button>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImportFile} />
              <AddEntityDialog
                title="Adicionar Empresa"
                buttonLabel="Adicionar Empresa"
                fields={[
                  { name: 'empresa', label: 'Nome da Empresa', type: 'text', placeholder: 'Nome da empresa', required: true },
                  { name: 'cod', label: 'Código', type: 'text', placeholder: 'Ex: 123' },
                ]}
                onAdd={handleAddEmpresa}
              />
            </div>
        </div>

        <div className="border border-border rounded-sm overflow-hidden bg-card">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando empresas...</div>
          ) : (
            <EmpresasTable 
              empresas={empresasSimplesNacionalList} 
              onEmpresaClick={handleEmpresaClick} 
              savedDataMap={savedDataMap} 
            />
          )}
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:w-[55%] sm:max-w-[800px] overflow-y-auto">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-lg font-bold">{selectedEmpresa?.empresa}</SheetTitle>
            <div className="flex items-center gap-4 mt-2">
               <div className="flex items-center gap-1">
                 <Label className="text-sm text-muted-foreground">COD:</Label>
                 <span className="text-sm font-medium">{editState.codigo || '-'}</span>
               </div>
               <div className="flex items-center gap-1">
                 <Label className="text-sm text-muted-foreground">CNPJ:</Label>
                 <Input 
                   value={editState.cnpj}
                   onChange={(e) => setEditState(prev => ({ ...prev, cnpj: e.target.value }))}
                   className="h-8 w-44 text-sm font-mono"
                 />
               </div>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)] pt-6">
            <div className="space-y-6 pb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <Label className="text-sm font-medium">Checklist de Tarefas</Label>
                    <div className="space-y-2">
                       {editState.checklistItems.map(item => (
                         <div key={item.id} className="flex items-center gap-2">
                           <input 
                             type="checkbox" 
                             checked={item.concluido} 
                             onChange={() => {
                               setEditState(prev => ({
                                 ...prev,
                                 checklistItems: prev.checklistItems.map(i => i.id === item.id ? {...i, concluido: !i.concluido} : i)
                               }))
                             }}
                             className="h-4 w-4"
                           />
                           <span className="text-sm">{item.texto}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <Label className="text-sm font-medium">Situação e Mensalidades</Label>
                    <div className="space-y-3">
                       <div className="space-y-1">
                         <span className="text-xs text-muted-foreground">Situação:</span>
                         <Input value={editState.situacao} onChange={e => setEditState(prev => ({...prev, situacao: e.target.value}))} />
                       </div>
                       <div className="space-y-1">
                         <span className="text-xs text-muted-foreground">Mensalidades:</span>
                         <Input value={editState.mensalidades} onChange={e => setEditState(prev => ({...prev, mensalidades: e.target.value}))} />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Anotações</Label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                   {editState.anotacoes.map(anot => (
                     <div key={anot.id} className="p-3 bg-muted/50 rounded-md">
                        <p className="text-sm">{anot.texto}</p>
                        <p className="text-xs text-muted-foreground mt-1">{anot.data}</p>
                     </div>
                   ))}
                </div>
                <Textarea 
                  placeholder="Digite uma nova anotação..."
                  value={editState.novaAnotacao}
                  onChange={e => setEditState(prev => ({...prev, novaAnotacao: e.target.value}))}
                  className="min-h-[80px]"
                />
              </div>

              <Button className="w-full" onClick={handleSaveChanges}>Salvar Alterações</Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SimplesNacional;


