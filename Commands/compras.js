// Arquivo: commands/compras.js
const { adicionarItem, consultarItens, marcarItem, limparAba } = require('../sheets');

async function handle(texto, usuario) {
  const planilhaId = usuario.planilhaId;

  // 1) Adicionar itens e retornar lista completa
  if (texto.startsWith('comprar ')) {
    const itens = texto
      .replace('comprar ', '')
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);

    // Adiciona cada item
    for (const item of itens) {
      await adicionarItem(planilhaId, 'lista', item);
    }

    // Recupera e retorna a lista completa já atualizada
    const lista = await consultarItens(planilhaId, 'lista');
    return `🛒 Itens adicionados:\n- ${itens.join('\n- ')}\n\n${lista}`;
  }

  // 2) Marcar itens como comprados sem remover (mantém histórico)
  if (texto.startsWith('comprei ')) {
    const itens = texto
      .replace('comprei ', '')
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);

    const resultados = [];
    for (const item of itens) {
      const msg = await marcarItem(planilhaId, 'lista', item);
      resultados.push(`- ${item}: ${msg.includes('✅') ? 'marcado' : 'não encontrado'}`);
    }

    // Retorna a lista completa com itens riscados
    const lista = await consultarItens(planilhaId, 'lista');
    return ['🧹 Itens marcados como comprados:', ...resultados, '', lista].join('\n');
  }

  // Consultar lista de compras
  if (texto === 'lista de compras') {
    return await consultarItens(planilhaId, 'lista');
  }

  // Limpar lista de compras
  if (texto === 'limpar lista') {
    return await limparAba(planilhaId, 'lista');
  }

  return null;
}

module.exports = { handle };

/*
  Explicação da alteração:
  - O bloco de 'comprar' agora adiciona itens e, em seguida, chama consultarItens() para retornar a lista completa.
  - Mantém o mesmo formato de resposta, mas agora o usuário vê imediatamente todos os itens, incluindo os adicionados.
*/
