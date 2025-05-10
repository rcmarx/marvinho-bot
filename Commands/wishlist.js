const { adicionarItem, consultarItens, removerItem } = require('../sheets');

async function handle(texto, usuario) {
  const planilhaId = usuario.planilhaId;
  if (texto.startsWith('wishlist ')) {
    const itens = texto.replace('wishlist ', '').split('\n').map(i => i.trim()).filter(Boolean);
    for (const item of itens) {
      await adicionarItem(planilhaId, 'wishlist', item);
    }
    return `🎁 Adicionado(s) à wishlist:\n- ${itens.join('\n- ')}`;
  }
  if (texto === 'wishlist') {
    return await consultarItens(planilhaId, 'wishlist');
  }
  if (texto.startsWith('unwish ')) {
    const itens = texto.replace('unwish ', '').split('\n').map(i => i.trim()).filter(Boolean);
    const resultados = [];
    for (const item of itens) {
      const resultado = await removerItem(planilhaId, 'wishlist', item);
      resultados.push(`- ${item}: ${resultado.includes('✅') ? 'removido' : 'não encontrado'}`);
    }
    return `🗑️ Itens riscados da sua wishlist:\n${resultados.join('\n')}`;
  }
  return null;
}

module.exports = { handle };