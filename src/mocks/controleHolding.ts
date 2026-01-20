export type StatusTarefa = 'a_fazer' | 'em_andamento' | 'em_revisao' | 'concluida' | 'cancelada';

export const statusColors: Record<StatusTarefa, { bg: string; text: string; label: string }> = {
  'a_fazer': { bg: 'bg-slate-100', text: 'text-slate-700', label: 'A fazer' },
  'em_andamento': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Em andamento' },
  'em_revisao': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Em revisão' },
  'concluida': { bg: 'bg-green-100', text: 'text-green-700', label: 'Concluída' },
  'cancelada': { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelada' },
};

export const enquadramentoOptions = [
  { value: 'presumido_comercio', label: 'Presumido c/ Comércio', color: 'text-purple-600' },
  { value: 'presumido_servico', label: 'Presumido c/ Serviço', color: 'text-indigo-600' },
  { value: 'presumido_comercio_servico', label: 'Presumido c/ Comércio e Serviço', color: 'text-violet-600' },
];

export interface TarefaHolding {
  id: string;
  empresa: string;
  cnpj: string;
  cnpjColor: string;
  enquadramento: string;
  status: StatusTarefa;
  descricao: string;
  dataCriacao: string;
}

export const tarefasHolding: TarefaHolding[] = [];

export const cnpjColorOptions = [
  { value: 'text-blue-600', label: 'Azul', bgPreview: 'bg-blue-600' },
  { value: 'text-green-600', label: 'Verde', bgPreview: 'bg-green-600' },
  { value: 'text-purple-600', label: 'Roxo', bgPreview: 'bg-purple-600' },
  { value: 'text-orange-600', label: 'Laranja', bgPreview: 'bg-orange-600' },
  { value: 'text-teal-600', label: 'Teal', bgPreview: 'bg-teal-600' },
  { value: 'text-rose-600', label: 'Rosa', bgPreview: 'bg-rose-600' },
  { value: 'text-cyan-600', label: 'Ciano', bgPreview: 'bg-cyan-600' },
  { value: 'text-amber-600', label: 'Âmbar', bgPreview: 'bg-amber-600' },
  { value: 'text-slate-600', label: 'Cinza', bgPreview: 'bg-slate-600' },
];
