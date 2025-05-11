// commands/todo.js
const {
  adicionarItem,
  consultarItens,
  marcarItem,
  limparAba
} = require('../sheets');

async function handle(texto, usuario) {
  const planilhaId = usuario.planilhaId;

  // 1) Adicionar tarefas (gatilhos: todo ou to-do)
  if (/^(todo|to-do)\s+/.test(texto)) {
    const tarefas = texto
      .replace(/^(todo|to-do)\s+/, '')
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    for (const t of tarefas) {
      await adicionarItem(planilhaId, 'to-do', t);
    }

    const lista = await consultarItens(planilhaId, 'to-do');
    return `📝 Tarefas adicionadas:\n- ${tarefas.join('\n- ')}\n\n${lista}`;
  }

  // 2) Listar tarefas (gatilhos: todo, to-do, lista de todo)
  if (/^(todo|to-do|lista de to-?do)$/.test(texto)) {
    return await consultarItens(planilhaId, 'to-do');
  }

  // 3) Marcar tarefas como concluídas (riscar) usando 'done'
  if (texto.startsWith('done ')) {
    const tarefas = texto
      .replace('done ', '')
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    const resultados = [];
    for (const t of tarefas) {
      const msg = await marcarItem(planilhaId, 'to-do', t);
      resultados.push(`- ${t}: ${msg.includes('✅') ? 'marcado como concluído' : 'não encontrado'}`);
    }

    const lista = await consultarItens(planilhaId, 'to-do');
    return ['✅ Itens marcados como concluídos:', ...resultados, '', lista].join('\n');
  }

  // 4) Limpar todas as tarefas (gatilhos: limpar to-do, limpar todo)
  if (texto === 'limpar to-do' || texto === 'limpar todo') {
    return await limparAba(planilhaId, 'to-do');
  }

  return null;
}

module.exports = { handle };
