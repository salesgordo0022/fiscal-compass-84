export interface AliquotaItem {
  tributo: string;
  codigo: string;
  aliquota: string;
}

export const lucroRealAliquotas: AliquotaItem[] = [
  { tributo: 'PIS', codigo: '', aliquota: '' },
  { tributo: 'COFINS', codigo: '', aliquota: '' },
  { tributo: 'CSLL', codigo: '', aliquota: '' },
  { tributo: 'IRPJ', codigo: '', aliquota: '' },
];

export const lucroPresumidoAliquotas: AliquotaItem[] = [
  { tributo: 'PIS', codigo: '', aliquota: '' },
  { tributo: 'COFINS', codigo: '', aliquota: '' },
  { tributo: 'IRPJ', codigo: '', aliquota: '' },
];

export interface EmpresaPlanilha {
  id: string;
  cod: string;
  empresa: string;
  solicitacao: boolean;
  despesas: boolean;
  misterContDig: boolean;
  conferirExtratos: boolean;
  conciliacaoImpostos: boolean;
  anotacao: string;
  dataFechamento: string;
  trimestre: string;
  lalur: string;
  contDigital: string;
  regime: string;
  situacao: string;
  mensalidades: string;
  regimeAnoAnterior: string;
}

export const empresasLucroReal: EmpresaPlanilha[] = [];

export const empresasLucroPresumido: EmpresaPlanilha[] = [];

export const empresasSemMovimento: EmpresaPlanilha[] = [];
