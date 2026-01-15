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
  dataRotina: string; // dd/MM/yyyy format
}

const defaultAtividades: AtividadeTerceiroSetor[] = [
  { id: '1', nome: 'Lançar Documentos', concluida: false },
  { id: '2', nome: 'Digitalizar', concluida: false },
  { id: '3', nome: 'Conferir Lançamentos', concluida: false },
];

export const entidadesTerceiroSetor: EntidadeTerceiroSetor[] = [
  { id: '1', codigo: '474', empresa: '1ª IGREJA CRISTA EVANGELICA GRAJAU MA', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: true }, { id: '3', nome: 'Conferir Lançamentos', concluida: true }], anotacao: '', status: 'Com movimento', modeloInform: 'ONBALANCE: @1ice1911#', acessos: 'tiaggoalves@gmail.com', cnpj: '23.437.015/0001-17', dataRotina: '15/01/2025' },
  { id: '2', codigo: '', empresa: 'ACADEMIA GRAJAUENSE DE LETRAS E ARTES', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONOSCO', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '14.229.040/0001-14', dataRotina: '' },
  { id: '3', codigo: '', empresa: 'AMAGRAJAU AMIGOS ASSOCIADOS DE GRAJAU', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '56.266.592/0001-42', dataRotina: '' },
  { id: '4', codigo: '521', empresa: 'ASSEMBLEIA DE DEUS EM CRISTO JESUS – MINISTÉRIO COLÉGIO DOS APÓSTOLOS', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: true }, { id: '3', nome: 'Conferir Lançamentos', concluida: false }], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '', dataRotina: '20/12/2024' },
  { id: '5', codigo: '', empresa: 'ASSOC. DO DESENV. CRISTAO DO MENOR CARENTE DE GRAJAU', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '12.158.010/0001-39', dataRotina: '' },
  { id: '6', codigo: '', empresa: 'ASSOC. DOS PROD. RURAIS DA LOCALIDADE DE BELEM', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '05.484.033/0001-78', dataRotina: '' },
  { id: '7', codigo: '', empresa: 'ASSOC. DOS PRODUTORES MENINO JESUS DO TANQUE', atividades: [...defaultAtividades], anotacao: '', status: 'Declaração S/M', modeloInform: '', acessos: '', cnpj: '04.175.257/0001-35', dataRotina: '10/01/2025' },
  { id: '8', codigo: '', empresa: 'ASSOC. EVANGELICA GUNNAR VINGRE', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONOSCO', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '09.443.426/0001-94', dataRotina: '' },
  { id: '9', codigo: '', empresa: 'ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS (APAE) DE GRAJAU - MA', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '24.292.071/0001-73', dataRotina: '' },
  { id: '10', codigo: '', empresa: 'ASSOCIAÇÃO DOS LEOES DE GRAJAÚ', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONOSCO', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '11.589.276/0001-39', dataRotina: '' },
  { id: '11', codigo: '495', empresa: 'COLONIA DE PESCADORES DE GRAJAU DO MARANHAO', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: false }, { id: '3', nome: 'Conferir Lançamentos', concluida: false }], anotacao: '', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '05.483.260/0001-89', dataRotina: '' },
  { id: '12', codigo: '', empresa: 'COLONIA DE PESCADORES Z-202 DE FORMOSA DA SERRA NEGRA-MA', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONOSCO', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '24.292.071/0001-73', dataRotina: '' },
  { id: '13', codigo: '', empresa: 'ESCOLA EBENEZER CRIANCA FELIZ', atividades: [...defaultAtividades], anotacao: '', status: 'Declaração S/M', modeloInform: '', acessos: '', cnpj: '11.095.679/0001-66', dataRotina: '05/01/2025' },
  { id: '14', codigo: '153', empresa: 'IGREJA ASSEMBLEIA DE DEUS - MINISTERIO FONTE DE VIDA', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: true }, { id: '3', nome: 'Conferir Lançamentos', concluida: true }], anotacao: 'FALTANDO MESES 08-09/24', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '44.657.409/0001-50', dataRotina: '14/01/2025' },
  { id: '15', codigo: '353', empresa: 'IGREJA ASSEMBLEIA DE DEUS MINISTERIO YESHUA KADOSH', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: true }, { id: '3', nome: 'Conferir Lançamentos', concluida: true }], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '55.179.239/0001-62', dataRotina: '12/01/2025' },
  { id: '16', codigo: '459', empresa: 'IGREJA DE CRISTO MINISTERIO APOSTOLICO NOVA TERRA (MANT)', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: true }, { id: '3', nome: 'Conferir Lançamentos', concluida: true }], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '61.602.924/0001-52', dataRotina: '10/01/2025' },
  { id: '17', codigo: '237', empresa: 'IGREJA PENT. EVANGELHO DO REINO MINIST. DE INTERC.', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: true }, { id: '3', nome: 'Conferir Lançamentos', concluida: true }], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '12.119.345/0001-48', dataRotina: '08/01/2025' },
  { id: '18', codigo: '', empresa: 'IGREJA PENTECOSTAL NOVA VIDA', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '32.213.881/0001-15', dataRotina: '' },
  { id: '19', codigo: '', empresa: 'IGREJA PENTECOSTAL TABERNACULO DE ORAÇÃO - IPTO', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '26.176.136/0001-40', dataRotina: '' },
  { id: '20', codigo: '173', empresa: 'IGREJA VIDA DE GRAJAU', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: true }, { id: '3', nome: 'Conferir Lançamentos', concluida: true }], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '45.894.034/0001-05', dataRotina: '13/01/2025' },
  { id: '21', codigo: '456', empresa: 'INSTITUTO MAIS DE DEUS MENOS DE MIM - IMAD', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: true }, { id: '3', nome: 'Conferir Lançamentos', concluida: true }], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '26.991.942/0001-72', dataRotina: '11/01/2025' },
  { id: '22', codigo: '', empresa: 'LOJA MACONICA E FRATERNIDADE GRAJAUENSE N17', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONOSCO', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '63.533.426/0001-20', dataRotina: '' },
  { id: '23', codigo: '265', empresa: 'SINDIC. RURAL DE GRAJAÚ', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: true }, { id: '3', nome: 'Conferir Lançamentos', concluida: false }], anotacao: '', status: 'Declaração S/M', modeloInform: '', acessos: '', cnpj: '06.132.740/0001-68', dataRotina: '09/01/2025' },
  { id: '24', codigo: '', empresa: 'SINDIC. DOS TRAB. EM ESTAB. DE ENSINO EM GRAJAU - SINTEGRA', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONOSCO', status: '', modeloInform: '', acessos: '', cnpj: '03.604.800/0001-00', dataRotina: '' },
  { id: '25', codigo: '25', empresa: 'SINDIC. DOS TRAB. R. AGRICULTORES E AGRICULTORAS FAMILIARES DE GRAJAU', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: true }, { id: '3', nome: 'Conferir Lançamentos', concluida: true }], anotacao: '', status: 'Com movimento', modeloInform: 'ONBALANCE: Elinaura2023', acessos: 'sttrdegrajau@hotmail.com', cnpj: '05.778.279/0001-52', dataRotina: '14/01/2025' },
  { id: '26', codigo: '161', empresa: 'SINDIC. DOS TRABALHAD RURAIS AGRICULTORES FAMILIARES DE ARAME', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: true }, { id: '3', nome: 'Conferir Lançamentos', concluida: true }], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '12.149.407/0001-64', dataRotina: '07/01/2025' },
  { id: '27', codigo: '', empresa: 'SINDICATO DOS AGENTES COMUNITARIOS DE SAUDE DE GRAJAU', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONOSCO', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '10.212.609/0001-88', dataRotina: '' },
  { id: '28', codigo: '', empresa: 'SOMASA SOCIEDADE DE MACONS E SAMARITANAS DE GRAJAU', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONOSCO', status: '', modeloInform: '', acessos: '', cnpj: '00.476.742/0001-98', dataRotina: '' },
  { id: '29', codigo: '365', empresa: 'TEMPLO EVANTO DO AMANHECER DE ALTO BRASIL', atividades: [{ id: '1', nome: 'Lançar Documentos', concluida: true }, { id: '2', nome: 'Digitalizar', concluida: false }, { id: '3', nome: 'Conferir Lançamentos', concluida: false }], anotacao: '', status: 'Declaração S/M', modeloInform: '', acessos: '', cnpj: '56.634.221/0001-76', dataRotina: '06/01/2025' },
];

// Dados para a aba "SAIU" - entidades que saíram
export const entidadesSaiu: EntidadeTerceiroSetor[] = [
  { id: 's1', codigo: '', empresa: 'ASSOCIACAO COMUNITARIA INDIGENA I', atividades: [...defaultAtividades], anotacao: 'OK', status: 'Declaração S/M', modeloInform: '', acessos: '', cnpj: '', dataRotina: '' },
  { id: 's2', codigo: '391', empresa: 'ASSOCIAÇÃO MULHERES EMPREENDEDORAS', atividades: [...defaultAtividades], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '', dataRotina: '' },
  { id: 's3', codigo: '521', empresa: 'ASSEMBLEIA DE DEUS EM CRISTO JESUS', atividades: [...defaultAtividades], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '', dataRotina: '31/10/2025' },
  { id: 's4', codigo: '495', empresa: 'COLONIA DE PESCADORES DE GRAJAU D', atividades: [...defaultAtividades], anotacao: '', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '05.483.260/0001-89', dataRotina: '' },
  { id: 's5', codigo: '459', empresa: 'IGREJA DE CRISTO MINISTERIO APOSTOL', atividades: [...defaultAtividades], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '61.602.924/0001-52', dataRotina: '31/10/2025' },
  { id: 's6', codigo: '365', empresa: 'TEMPLO EVANTO DO AMANHECER DE AL', atividades: [...defaultAtividades], anotacao: '', status: 'Declaração S/M', modeloInform: '', acessos: '', cnpj: '56.634.221/0001-76', dataRotina: '' },
  { id: 's7', codigo: '353', empresa: 'IGREJA ASSEMBLEIA DE DEUS MINISTERI', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '55.179.239/0001-62', dataRotina: '30/11/2025' },
  { id: 's8', codigo: '', empresa: 'COLONIA DE PESCADORES Z-202 DE FOR', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONC', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '24.292.071/0001-73', dataRotina: '' },
  { id: 's9', codigo: '', empresa: 'AMAGRAJAU AMIGOS ASSOCIADOS DE G', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '56.266.592/0001-42', dataRotina: '' },
  { id: 's10', codigo: '', empresa: 'ASSOCIAÇÃO DE PAIS E AMIGOS DOS EX', atividades: [...defaultAtividades], anotacao: '', status: 'Declaração S/M', modeloInform: '', acessos: '', cnpj: '24.292.071/0001-73', dataRotina: '' },
  { id: 's11', codigo: '173', empresa: 'IGREJA VIDA DE GRAJAU', atividades: [...defaultAtividades], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '45.894.034/0001-05', dataRotina: '31/08/2025' },
  { id: 's12', codigo: '153', empresa: 'IGREJA ASSEMBLEIA DE DEUS - MINISTER', atividades: [...defaultAtividades], anotacao: 'FALTANDO MESES G', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '44.657.409/0001-50', dataRotina: '28/02/2025' },
  { id: 's13', codigo: '', empresa: 'LOJA MACONICA E FRATERNIDADE GRAJ', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONC', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '63.533.426/0001-20', dataRotina: '' },
  { id: 's14', codigo: '', empresa: 'SOMASA SOCIEDADE DE MACONS E SAM', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONC', status: '', modeloInform: '', acessos: '', cnpj: '00.476.742/0001-98', dataRotina: '' },
  { id: 's15', codigo: '456', empresa: 'INSTITUTO MAIS DE DEUS MENOS DE MI', atividades: [...defaultAtividades], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '26.991.942/0001-72', dataRotina: '31/10/2025' },
  { id: 's16', codigo: '', empresa: 'ESCOLA EBENEZER CRIANCA FELIZ', atividades: [...defaultAtividades], anotacao: '', status: 'Declaração S/M', modeloInform: '', acessos: '', cnpj: '11.095.679/0001-66', dataRotina: '' },
  { id: 's17', codigo: '237', empresa: 'IGREJA PENT. EVANGELHO DO REINO MII', atividades: [...defaultAtividades], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '12.119.345/0001-48', dataRotina: '30/09/2025' },
  { id: 's18', codigo: '474', empresa: '1ª IGREJA CRISTA EVANGELICA GRAJAU I', atividades: [...defaultAtividades], anotacao: '', status: 'Com movimento', modeloInform: 'ONBALANCE: @1Ice1911#', acessos: 'tiaggcalves@gmail.com', cnpj: '23.437.015/0001-17', dataRotina: '30/11/2025' },
  { id: 's19', codigo: '', empresa: 'IGREJA PENTECOSTAL TABERNACULO DE', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '26.176.136/0001-40', dataRotina: '' },
  { id: 's20', codigo: '', empresa: 'IGREJA PENTECOSTAL NOVA VIDA', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '32.213.881/0001-15', dataRotina: '' },
  { id: 's21', codigo: '25', empresa: 'SINDIC. DOS TRAB. R. AGRICULTORES E A', atividades: [...defaultAtividades], anotacao: '', status: 'Com movimento', modeloInform: 'ONBALANCE: Elinaura2023', acessos: 'strdegrajau@hotmail.com', cnpj: '05.778.279/0001-52', dataRotina: '31/10/2025' },
  { id: 's22', codigo: '', empresa: 'SINDIC. DOS TRAB. EM ESTAB. DE ENSINI', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONC', status: '', modeloInform: '', acessos: '', cnpj: '03.604.800/0001-00', dataRotina: '' },
  { id: 's23', codigo: '161', empresa: 'SINDIC. DOS TRABALHAD RURAIS AGRIC', atividades: [...defaultAtividades], anotacao: '', status: 'Com movimento', modeloInform: '', acessos: '', cnpj: '12.149.407/0001-64', dataRotina: '30/11/2025' },
  { id: 's24', codigo: '265', empresa: 'SINDIC. RURAL DE GRAJAÚ', atividades: [...defaultAtividades], anotacao: '', status: 'Declaração S/M', modeloInform: '', acessos: '', cnpj: '06.132.740/0001-68', dataRotina: '31/12/2023' },
  { id: 's25', codigo: '', empresa: 'SINDICATO DOS AGENTES COMUNITARIO', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONC', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '10.212.609/0001-88', dataRotina: '' },
  { id: 's26', codigo: '', empresa: 'ASSOC. DOS PROD. RURAIS DA LOCALIDA', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '05.484.033/0001-78', dataRotina: '' },
  { id: 's27', codigo: '', empresa: 'ASSOC. DOS PRODUTORES MENINO JESL', atividades: [...defaultAtividades], anotacao: '', status: 'Declaração S/M', modeloInform: '', acessos: '', cnpj: '04.175.257/0001-35', dataRotina: '' },
  { id: 's28', codigo: '', empresa: 'ASSOC. DO DESENV. CRISTAO DO MENOI', atividades: [...defaultAtividades], anotacao: '', status: '', modeloInform: '', acessos: '', cnpj: '12.158.010/0001-39', dataRotina: '' },
  { id: 's29', codigo: '365', empresa: 'ASSOC. EVANGELICA GUNNAR VINGRE', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONC', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '09.443.426/0001-94', dataRotina: '' },
  { id: 's30', codigo: '', empresa: 'ASSOCIAÇÃO DOS LEOES DE GRAJAÚ', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONC', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '11.589.058/0001-39', dataRotina: '' },
  { id: 's31', codigo: '', empresa: 'ACADEMIA GRAJAUENSE DE LETRAS E AR', atividades: [...defaultAtividades], anotacao: 'N. ESTÁ MAIS CONC', status: 'Sem movimento', modeloInform: '', acessos: '', cnpj: '14.229.040/0001-14', dataRotina: '' },
];
