export type StatusTerceiroSetor = 'Com movimento' | 'Sem movimento' | 'Declaração S/M' | '';

export interface AtividadeTerceiroSetor {
  id: string;
  nome: string;
  concluida: boolean;
}

export interface EntidadeTerceiroSetor {
  id: string;
  codigo: string;
  empresa: string;
  atividades: AtividadeTerceiroSetor[];
  anotacao: string;
  status: StatusTerceiroSetor;
  modeloInform: string;
  acessos: string;
  cnpj: string;
  dataRotina: string;
}

export const entidadesTerceiroSetor: EntidadeTerceiroSetor[] = [];

export const entidadesSaiu: EntidadeTerceiroSetor[] = [];
