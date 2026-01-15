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

export const tarefasHolding: TarefaHolding[] = [
  {
    id: '1',
    empresa: 'HOLDING PATRIMONIAL ALPHA',
    cnpj: '12.345.678/0001-90',
    cnpjColor: 'text-blue-600',
    enquadramento: 'presumido_comercio',
    status: 'a_fazer',
    descricao: 'Verificar estrutura societária',
    dataCriacao: '10 de janeiro de 2026',
  },
  {
    id: '2',
    empresa: 'BETA PARTICIPAÇÕES LTDA',
    cnpj: '23.456.789/0001-01',
    cnpjColor: 'text-green-600',
    enquadramento: 'presumido_servico',
    status: 'em_andamento',
    descricao: 'Integralização de capital em andamento',
    dataCriacao: '08 de janeiro de 2026',
  },
  {
    id: '3',
    empresa: 'GAMMA GESTÃO PATRIMONIAL',
    cnpj: '34.567.890/0001-12',
    cnpjColor: 'text-purple-600',
    enquadramento: 'presumido_comercio_servico',
    status: 'em_revisao',
    descricao: 'Documentação de governança em revisão',
    dataCriacao: '05 de janeiro de 2026',
  },
  {
    id: '4',
    empresa: 'DELTA INVESTIMENTOS SA',
    cnpj: '45.678.901/0001-23',
    cnpjColor: 'text-orange-600',
    enquadramento: 'presumido_comercio',
    status: 'concluida',
    descricao: 'Estrutura societária finalizada',
    dataCriacao: '02 de janeiro de 2026',
  },
  {
    id: '5',
    empresa: 'EPSILON HOLDINGS',
    cnpj: '56.789.012/0001-34',
    cnpjColor: 'text-teal-600',
    enquadramento: 'presumido_servico',
    status: 'cancelada',
    descricao: 'Projeto cancelado por decisão do cliente',
    dataCriacao: '28 de dezembro de 2025',
  },
  {
    id: '6',
    empresa: 'ZETA PARTICIPAÇÕES',
    cnpj: '67.890.123/0001-45',
    cnpjColor: 'text-rose-600',
    enquadramento: 'presumido_comercio_servico',
    status: 'a_fazer',
    descricao: 'Aguardando documentos iniciais',
    dataCriacao: '12 de janeiro de 2026',
  },
  {
    id: '7',
    empresa: 'ETA GESTÃO EMPRESARIAL',
    cnpj: '78.901.234/0001-56',
    cnpjColor: 'text-cyan-600',
    enquadramento: 'presumido_comercio',
    status: 'em_andamento',
    descricao: 'Análise de participações societárias',
    dataCriacao: '09 de janeiro de 2026',
  },
  {
    id: '8',
    empresa: 'THETA PATRIMONIAL',
    cnpj: '89.012.345/0001-67',
    cnpjColor: 'text-amber-600',
    enquadramento: 'presumido_servico',
    status: 'em_revisao',
    descricao: 'Revisão de contratos de holding',
    dataCriacao: '07 de janeiro de 2026',
  },
];

// CNPJ color options for the color picker
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
