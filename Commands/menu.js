// commands/menu.js
function handle() {
  return [
    '🤖 *Menu do Marvinho*',
    'Gerencie suas tarefas do dia a dia com comandos simples e diretos.',
    '',
    '──────────────────────────',
    '',
    '🛒 *Lista de Compras*',
    '  • comprar _item_        → adiciona “item” à lista de compras',
    '  • lista de compras      → exibe itens atuais (já numerados)',
    '  • comprei _ID_          → risca o item pela ID',
    '  • limpar lista          → remove todos os itens (mantém cabeçalho)',
    '',
    '🎁 *Wishlist*',
    '  • wishlist _item_       → adiciona “item” à sua wishlist',
    '  • wishlist              → exibe itens atuais numerados',
    '  • unwish _ID_           → remove/riscas pela ID',
    '',
    '💸 *Gastos*',
    '  • gasto _descrição_     → registra um gasto (ex: mercado 45,00)',
    '  • gastos                → exibe gastos atuais numerados',
    '  • remover gasto _ID_    → remove/riscas pela ID',
    '  • limpar gastos         → zera todos os gastos (mantém cabeçalho)',
    '',
    '📝 *To-Do*',
    '  • todo _tarefa_         → adiciona uma tarefa à sua lista de To-Do',
    '  • to-do                 → exibe tarefas atuais numeradas',
    '  • done _ID_             → risca a tarefa pela ID',
    '  • limpar to-do          → zera todas as tarefas (mantém cabeçalho)',
    '',
    '🚫 *Obs:* não é possível limpar a wishlist 😉',
    '',
    '──────────────────────────',
    'Para ver o menu avançado com exemplos e detalhes, digite *menu avançado*'
  ].join('\n');
}

module.exports = { handle };
