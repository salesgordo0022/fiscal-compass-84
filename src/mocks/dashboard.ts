import { empresasLucroReal, empresasLucroPresumido } from './planilhaGeral';
import { pessoasFisicasCarneLeao } from './carneLeao';
import { entidadesTerceiroSetor } from './terceiroSetor';
import { empresasEcdEcf } from './ecdEcf';

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface BarChartData {
  category: string;
  finished: number;
  inProgress: number;
  waiting: number;
  notStarted: number;
  cancelled: number;
}

// Calcular estatísticas reais baseadas nos dados
const calcularEstatisticas = () => {
  const totalLucroReal = empresasLucroReal.length;
  const totalLucroPresumido = empresasLucroPresumido.length;
  const totalTerceiroSetor = entidadesTerceiroSetor.length;
  const totalCarneLeao = pessoasFisicasCarneLeao.length;
  const totalEcdEcf = empresasEcdEcf.length;
  
  // Calcular finalizados baseado em checkboxes preenchidos (Lucro Real)
  const lucroRealFinalizados = empresasLucroReal.filter(e => 
    e.solicitacao && e.despesas && e.misterContDig
  ).length;
  
  // Calcular em andamento (pelo menos um checkbox marcado mas não todos)
  const lucroRealEmAndamento = empresasLucroReal.filter(e => 
    (e.solicitacao || e.despesas || e.misterContDig) && 
    !(e.solicitacao && e.despesas && e.misterContDig)
  ).length;
  
  // ECD/ECF - enviados
  const ecdEnviados = empresasEcdEcf.filter(e => e.statusEcd === 'enviado').length;
  const ecfEnviados = empresasEcdEcf.filter(e => e.statusEcf === 'enviado').length;
  
  // Terceiro Setor - com movimento
  const terceiroSetorAtivos = entidadesTerceiroSetor.filter(e => 
    e.status === 'Com movimento'
  ).length;
  
  // Carnê Leão - concluídos
  const carneLeaoCompletos = pessoasFisicasCarneLeao.filter(e => 
    e.carneLancadoPercent === 100
  ).length;
  
  return {
    totalClientes: totalLucroReal + totalLucroPresumido + totalTerceiroSetor,
    clientesAtivos: totalLucroReal + totalLucroPresumido + terceiroSetorAtivos,
    totalAtividades: totalLucroReal + totalLucroPresumido + totalTerceiroSetor + totalCarneLeao,
    finalizados: lucroRealFinalizados + ecdEnviados + carneLeaoCompletos,
    emAndamento: lucroRealEmAndamento + (totalEcdEcf - ecdEnviados),
    pendentes: totalLucroPresumido,
    
    // Para gráfico de barras
    contabil: {
      finished: lucroRealFinalizados,
      inProgress: lucroRealEmAndamento,
      waiting: totalLucroPresumido,
      notStarted: empresasLucroReal.filter(e => !e.solicitacao && !e.despesas).length,
    },
    fiscal: {
      finished: ecdEnviados,
      inProgress: totalEcdEcf - ecdEnviados,
      waiting: 0,
      notStarted: empresasEcdEcf.filter(e => e.statusEcd === 'nao_enviado' && e.statusEcf === 'nao_enviado').length,
    },
    terceiroSetor: {
      finished: terceiroSetorAtivos,
      inProgress: entidadesTerceiroSetor.filter(e => e.status === 'Declaração S/M').length,
      waiting: entidadesTerceiroSetor.filter(e => e.status === 'Sem movimento').length,
      notStarted: entidadesTerceiroSetor.filter(e => !e.status).length,
    },
    pessoaFisica: {
      finished: carneLeaoCompletos,
      inProgress: pessoasFisicasCarneLeao.filter(e => e.carneLancadoPercent > 0 && e.carneLancadoPercent < 100).length,
      waiting: 0,
      notStarted: pessoasFisicasCarneLeao.filter(e => e.carneLancadoPercent === 0).length,
    },
  };
};

const stats = calcularEstatisticas();

// Calcular percentuais para o gráfico de rosca
const totalParaGrafico = stats.finalizados + stats.emAndamento + (stats.totalAtividades - stats.finalizados - stats.emAndamento);
const percentFinalizados = totalParaGrafico > 0 ? Math.round((stats.finalizados / totalParaGrafico) * 100) : 0;
const percentEmAndamento = totalParaGrafico > 0 ? Math.round((stats.emAndamento / totalParaGrafico) * 100) : 0;
const percentNaoComecou = 100 - percentFinalizados - percentEmAndamento;

export const donutChartData: ChartData[] = [
  { name: 'Finalizado', value: percentFinalizados, color: 'hsl(142, 50%, 45%)' },
  { name: 'Em andamento', value: percentEmAndamento, color: 'hsl(199, 70%, 50%)' },
  { name: 'Não começou', value: percentNaoComecou, color: 'hsl(0, 0%, 65%)' },
];

export const barChartData: BarChartData[] = [
  {
    category: 'Contábil',
    finished: stats.contabil.finished,
    inProgress: stats.contabil.inProgress,
    waiting: stats.contabil.waiting,
    notStarted: stats.contabil.notStarted,
    cancelled: 0,
  },
  {
    category: 'Fiscal',
    finished: stats.fiscal.finished,
    inProgress: stats.fiscal.inProgress,
    waiting: stats.fiscal.waiting,
    notStarted: stats.fiscal.notStarted,
    cancelled: 0,
  },
  {
    category: 'Terceiro Setor',
    finished: stats.terceiroSetor.finished,
    inProgress: stats.terceiroSetor.inProgress,
    waiting: stats.terceiroSetor.waiting,
    notStarted: stats.terceiroSetor.notStarted,
    cancelled: 0,
  },
  {
    category: 'Pessoa Física',
    finished: stats.pessoaFisica.finished,
    inProgress: stats.pessoaFisica.inProgress,
    waiting: stats.pessoaFisica.waiting,
    notStarted: stats.pessoaFisica.notStarted,
    cancelled: 0,
  },
];

export const summaryStats = {
  totalActivities: stats.totalAtividades,
  finished: stats.finalizados,
  inProgress: stats.emAndamento,
  pending: stats.pendentes,
  totalClients: stats.totalClientes,
  activeClients: stats.clientesAtivos,
};
