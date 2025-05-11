// commands/wishlist.js
const { adicionarItem, consultarItens, removerItem } = require('../sheets');

async function handle(texto, usuario) {
  const planilhaId = usuario.planilhaId;

  // Adicionar
  if (/^wishlist\s+/.test(texto)) {
    const itens = texto
      .replace(/^wishlist\s+/, '')
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);
    for (const item of itens) {
      await adicionarItem(planilhaId, 'wishlist', item);
    }
    const lista = await consultarItens(planilhaId, 'wishlist');
    return `🎁 Itens adicionados à wishlist:\n- ${itens.join(
      '\n- '
    )}\n\n${lista}`;
  }

  // Listar
  if (texto === 'wishlist') {
    return await consultarItens(planilhaId, 'wishlist');
  }

  // Remover
  if (/^unwish\s+/.test(texto)) {
    const itens = texto
      .replace(/^unwish\s+/, '')
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);
    const resultados = [];
    for (const item of itens) {
      const msg = await removerItem(planilhaId, 'wishlist', item);
      resultados.push(
        `- ${item}: ${msg.includes('✅') ? 'removido' : 'não encontrado'}`
      );
    }
    const lista = await consultarItens(planilhaId, 'wishlist');
    return ['🗑️ Resultado (wishlist):', ...resultados, '', lista].join('\n');
  }

  return null;
}

module.exports = { handle };
