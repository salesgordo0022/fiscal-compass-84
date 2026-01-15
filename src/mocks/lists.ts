export interface ListItem {
  id: string;
  name: string;
  cnpj?: string;
  observation?: string;
}

export interface CategoryList {
  id: string;
  title: string;
  description: string;
  items: ListItem[];
}

export const categorizedLists: CategoryList[] = [
  {
    id: '1',
    title: 'Empresas que não enviaram despesas',
    description: 'Lista de empresas com pendência de envio de despesas do mês atual',
    items: [
      { id: '1', name: 'Empresa Alpha Ltda', cnpj: '12.345.678/0001-90', observation: 'Último envio: Janeiro/2024' },
      { id: '2', name: 'Beta Comércio S.A.', cnpj: '23.456.789/0001-01', observation: 'Sem envio há 2 meses' },
      { id: '3', name: 'Gamma Serviços ME', cnpj: '34.567.890/0001-12', observation: 'Aguardando documentação' },
      { id: '4', name: 'Delta Indústria Ltda', cnpj: '45.678.901/0001-23' },
    ],
  },
  {
    id: '2',
    title: 'Empresas com pendências fiscais',
    description: 'Empresas com obrigações acessórias em atraso ou pendentes',
    items: [
      { id: '1', name: 'Omega Trading Ltda', cnpj: '56.789.012/0001-34', observation: 'DCTF em atraso' },
      { id: '2', name: 'Sigma Importações', cnpj: '67.890.123/0001-45', observation: 'EFD-Contribuições pendente' },
      { id: '3', name: 'Theta Exportadora', cnpj: '78.901.234/0001-56', observation: 'SPED Fiscal - retificação' },
    ],
  },
  {
    id: '3',
    title: 'Empresas do Simples Nacional',
    description: 'Clientes enquadrados no regime Simples Nacional',
    items: [
      { id: '1', name: 'Padaria Pão Quente ME', cnpj: '89.012.345/0001-67' },
      { id: '2', name: 'Salão Beleza Total ME', cnpj: '90.123.456/0001-78' },
      { id: '3', name: 'Oficina Mecânica Central EPP', cnpj: '01.234.567/0001-89' },
      { id: '4', name: 'Loja de Roupas Fashion ME', cnpj: '12.345.678/0001-90' },
      { id: '5', name: 'Restaurante Sabor Caseiro EPP', cnpj: '23.456.789/0001-01' },
    ],
  },
  {
    id: '4',
    title: 'Verificações de Holding',
    description: 'Holdings patrimoniais com verificações pendentes',
    items: [
      { id: '1', name: 'Holding Família Silva', cnpj: '34.567.890/0001-12', observation: 'Revisão societária anual' },
      { id: '2', name: 'Patrimonial Oliveira', cnpj: '45.678.901/0001-23', observation: 'Integralização de capital' },
    ],
  },
  {
    id: '5',
    title: 'Terceiro Setor - Prestação de Contas',
    description: 'Entidades do terceiro setor com prestação de contas em aberto',
    items: [
      { id: '1', name: 'ONG Esperança Viva', cnpj: '56.789.012/0001-34', observation: 'Relatório anual 2023' },
      { id: '2', name: 'Instituto Educacional Futuro', cnpj: '67.890.123/0001-45', observation: 'Certificação CEBAS' },
      { id: '3', name: 'Associação Beneficente Luz', cnpj: '78.901.234/0001-56', observation: 'Demonstrações financeiras' },
    ],
  },
];
