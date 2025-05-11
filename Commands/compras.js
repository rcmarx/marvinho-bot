// commands/compras.js
const {
  adicionarItem,
  consultarItens,
  marcarItem,
  limparAba,
} = require('../sheets');

async function handle(texto, usuario) {
  const planilhaId = usuario.planilhaId;

  // Adicionar (gatilho: comprar)
  if (/^comprar\s+/.test(texto)) {
    const itens = texto
      .replace(/^comprar\s+/, '')
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);
    for (const item of itens) {
      await adicionarItem(planilhaId, 'lista', item);
    }
    const lista = await consultarItens(planilhaId, 'lista');
    return `🛒 Itens adicionados à lista de compras:\n- ${itens.join(
      '\n- '
    )}\n\n${lista}`;
  }

  // Listar
  if (texto === 'lista de compras') {
    return await consultarItens(planilhaId, 'lista');
  }

  // Marcar como comprado (gatilho: comprei)
  if (/^comprei\s+/.test(texto)) {
    const itens = texto
      .replace(/^comprei\s+/, '')
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);
    const resultados = [];
    for (const item of itens) {
      const msg = await marcarItem(planilhaId, 'lista', item);
      resultados.push(
        `- ${item}: ${
          msg.includes('✅') ? 'marcado como comprado' : 'não encontrado'
        }`
      );
    }
    const lista = await consultarItens(planilhaId, 'lista');
    return ['🧹 Itens marcados como comprados:', ...resultados, '', lista].join(
      '\n'
    );
  }

  // Limpar
  if (texto === 'limpar lista') {
    return await limparAba(planilhaId, 'lista');
  }

  return null;
}

module.exports = { handle };
