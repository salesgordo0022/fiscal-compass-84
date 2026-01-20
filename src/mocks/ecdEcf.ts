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

export const empresasEcdEcf: EmpresaEcdEcf[] = [];
