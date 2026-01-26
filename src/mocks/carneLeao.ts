export interface PessoaFisicaCarneLeao {
  id: string;
  pessoaFisica: string;
  documentos: boolean;
  lancarDocumentos: boolean;
  digitalizar: boolean;
  carneLancadoPercent: number;
  anotacao: string;
  dataFechamento: string;
  tipoLogin: 'Certificado' | 'Procuração' | 'Conta Gov.' | '';
  senhaGov: string;
  cpf: string;
}

export const pessoasFisicasCarneLeao: PessoaFisicaCarneLeao[] = [
  {
    id: '1',
    pessoaFisica: 'ARI DE JESUS RODRIGUES NEVES',
    documentos: true,
    lancarDocumentos: true,
    digitalizar: true,
    carneLancadoPercent: 100,
    anotacao: '',
    dataFechamento: '31 de dezembro de 2025',
    tipoLogin: 'Certificado',
    senhaGov: '',
    cpf: '',
  },
  {
    id: '2',
    pessoaFisica: 'LUCIANO COSTA NACIMENTO',
    documentos: true,
    lancarDocumentos: true,
    digitalizar: false,
    carneLancadoPercent: 67,
    anotacao: '',
    dataFechamento: '30 de novembro de 2025',
    tipoLogin: 'Certificado',
    senhaGov: '',
    cpf: '',
  },
  {
    id: '3',
    pessoaFisica: 'FELICIANO ASSUNCAO FALCAO JUNIOR',
    documentos: true,
    lancarDocumentos: true,
    digitalizar: false,
    carneLancadoPercent: 67,
    anotacao: '',
    dataFechamento: '30 de novembro de 2025',
    tipoLogin: 'Procuração',
    senhaGov: 'Jr312801#',
    cpf: '692.675.703-82',
  },
  {
    id: '4',
    pessoaFisica: 'RAYANNE DE SOUSA FALCAO BARROS',
    documentos: false,
    lancarDocumentos: false,
    digitalizar: false,
    carneLancadoPercent: 0,
    anotacao: 'ATENDENDO COMO PJ',
    dataFechamento: '',
    tipoLogin: 'Procuração',
    senhaGov: '62859798306',
    cpf: '',
  },
  {
    id: '5',
    pessoaFisica: 'LEANDRO JOSE SANTOS ARAUJO',
    documentos: false,
    lancarDocumentos: false,
    digitalizar: false,
    carneLancadoPercent: 0,
    anotacao: 'ATENDENDO COMO PJ',
    dataFechamento: '',
    tipoLogin: 'Conta Gov.',
    senhaGov: 'Lladov01622#',
    cpf: '',
  },
];
