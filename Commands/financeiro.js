// commands/financeiro.js
const {
  adicionarItem,
  consultarItens,
  removerItem,
  limparAba
} = require('../sheets');

async function handle(texto, usuario) {
  const planilhaId = usuario.planilhaId;

  // 1) Adicionar gasto(s) (gatilho: gasto)
  if (/^gasto\s+/.test(texto)) {
    const itens = texto
      .replace(/^gasto\s+/, '')
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);

    for (const item of itens) {
      await adicionarItem(planilhaId, 'financeiro', item);
    }

    const lista = await consultarItens(planilhaId, 'financeiro');
    return `💸 Gasto(s) registrado(s):\n- ${itens.join('\n- ')}\n\n${lista}`;
  }

  // 2) Listar todos os gastos
  if (texto === 'gastos') {
    return await consultarItens(planilhaId, 'financeiro');
  }

  // 3) Remover gasto(s) (gatilho: remover gasto)
  if (/^remover gasto\s+/.test(texto)) {
    const itens = texto
      .replace(/^remover gasto\s+/, '')
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);

    const resultados = [];
    for (const item of itens) {
      const resultado = await removerItem(planilhaId, 'financeiro', item);
      resultados.push(
        `- ${item}: ${resultado.includes('✅') ? 'removido' : 'não encontrado'}`
      );
    }

    const lista = await consultarItens(planilhaId, 'financeiro');
    return [`💸 Resultado da remoção:`, ...resultados, ``, lista].join('\n');
  }

  // 4) Limpar todos os gastos
  if (texto === 'limpar gastos') {
    return await limparAba(planilhaId, 'financeiro');
  }

  return null;
}

module.exports = { handle };
