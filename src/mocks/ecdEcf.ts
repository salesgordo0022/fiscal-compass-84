export type StatusEnvio = 'enviado' | 'nao_enviado';
export type RegimeEcdEcf = 'lucro_real' | 'lucro_presumido' | 'terceiro_setor' | '';

export interface EmpresaEcdEcf {
  id: string;
  empresa: string;
  regimeAtual: RegimeEcdEcf;
  regimeAnoAnterior: RegimeEcdEcf;
  statusEcd: StatusEnvio;
  dataEcd: string;
  situacaoEcd: string;
  statusEcf: StatusEnvio;
  dataEcf: string;
  situacaoEcf: string;
}

export const statusEnvioConfig: Record<StatusEnvio, { label: string; bg: string; text: string }> = {
  enviado: { label: 'ENVIADO', bg: 'bg-green-100', text: 'text-green-700' },
  nao_enviado: { label: 'NÃO ENVIADO', bg: 'bg-orange-100', text: 'text-orange-700' },
};

export const regimeConfig: Record<RegimeEcdEcf, { label: string; bg: string; text: string }> = {
  lucro_real: { label: 'LUCRO REAL', bg: 'bg-green-100', text: 'text-green-700' },
  lucro_presumido: { label: 'LUCRO PRESUMIDO', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  terceiro_setor: { label: 'TERCEIRO SETOR', bg: 'bg-purple-100', text: 'text-purple-700' },
  '': { label: '-', bg: '', text: 'text-muted-foreground' },
};

export const empresasEcdEcf: EmpresaEcdEcf[] = [
  {
    id: '1',
    empresa: 'JOSE ENILDO DE SOUZA - INDUSTRIA',
    regimeAtual: 'lucro_real',
    regimeAnoAnterior: '',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: 'SAIU',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '2',
    empresa: 'A FONTES DE SOUSA LTDA',
    regimeAtual: 'lucro_real',
    regimeAnoAnterior: '',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '3',
    empresa: 'ADRIANA COSTA NASCIMENTO',
    regimeAtual: 'lucro_real',
    regimeAnoAnterior: '',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '4',
    empresa: 'GESSO NORDESTE LTDA',
    regimeAtual: 'lucro_real',
    regimeAnoAnterior: '',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '5',
    empresa: 'J F DA SILVA MACEDO',
    regimeAtual: 'lucro_presumido',
    regimeAnoAnterior: 'lucro_real',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '6',
    empresa: 'J DE A DE SOUSA',
    regimeAtual: 'lucro_real',
    regimeAnoAnterior: '',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '7',
    empresa: 'L B GOMES RAMOS',
    regimeAtual: 'lucro_real',
    regimeAnoAnterior: '',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '8',
    empresa: 'M A A A LIMA',
    regimeAtual: 'lucro_real',
    regimeAnoAnterior: '',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '9',
    empresa: 'SOUZA & GONÇALVES MATERIAIS DE CONSTRUCOES LTDA',
    regimeAtual: 'lucro_real',
    regimeAnoAnterior: '',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '10',
    empresa: 'TRUCKAUTO',
    regimeAtual: 'lucro_real',
    regimeAnoAnterior: '',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '11',
    empresa: 'TORRS & REIS LTDA',
    regimeAtual: 'lucro_presumido',
    regimeAnoAnterior: 'lucro_real',
    statusEcd: 'nao_enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '12',
    empresa: 'V L V RAMOS',
    regimeAtual: 'lucro_real',
    regimeAnoAnterior: '',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
  {
    id: '13',
    empresa: 'W. M SILVA',
    regimeAtual: 'lucro_real',
    regimeAnoAnterior: '',
    statusEcd: 'enviado',
    dataEcd: '31 de dezembro de 2024',
    situacaoEcd: '',
    statusEcf: 'nao_enviado',
    dataEcf: '',
    situacaoEcf: '',
  },
];
