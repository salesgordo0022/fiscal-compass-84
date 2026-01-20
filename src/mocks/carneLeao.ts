export interface PessoaFisicaCarneLeao {
  id: string;
  pessoaFisica: string;
  lancarDocumentos: boolean;
  digitalizar: boolean;
  carneLancado: boolean;
  anotacao: string;
  dataFechamento: string;
  tipoLogin: 'Certificado' | 'Procuração' | 'Conta Gov.' | '';
  senhaGov: string;
  cpf: string;
}

export const pessoasFisicasCarneLeao: PessoaFisicaCarneLeao[] = [];
