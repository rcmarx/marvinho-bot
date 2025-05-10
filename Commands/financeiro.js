const { adicionarItem, consultarItens, removerItem, limparAba } = require('../sheets');

async function handle(texto, usuario) {
  const planilhaId = usuario.planilhaId;
  if (texto.startsWith('gasto ')) {
    const itens = texto.replace('gasto ', '').split('\n').map(i => i.trim()).filter(Boolean);
    for (const item of itens) {
      await adicionarItem(planilhaId, 'financeiro', item);
    }
    return `💸 Gasto(s) registrado(s):\n- ${itens.join('\n- ')}`;
  }
  if (texto === 'gastos') {
    return await consultarItens(planilhaId, 'financeiro');
  }
  if (texto.startsWith('remover gasto ')) {
    const itens = texto.replace('remover gasto ', '').split('\n').map(i => i.trim()).filter(Boolean);
    const resultados = [];
    for (const item of itens) {
      const resultado = await removerItem(planilhaId, 'financeiro', item);
      resultados.push(`- ${item}: ${resultado.includes('✅') ? 'removido' : 'não encontrado'}`);
    }
    return `💸 Itens riscados do seu controle de gastos:\n${resultados.join('\n')}`;
  }
  if (texto === 'limpar gastos') {
    return await limparAba(planilhaId, 'financeiro');
  }
  return null;
}

module.exports = { handle };