// commands/menu.js
function handle() {
  return [
    '🤖 *Menu do Marvinho*',
    'Comigo você pode gerenciar suas tarefas do dia a dia com comandos simples e diretos.',
    '',
    '───por exemplo:───',
    '',
    '🛒 *Lista de Compras*',
    '  • comprar _item_        → adiciona “item” à lista de compras (ex: comprar arroz)',
    '  • lista de compras      → exibe itens atuais (já numerados)',
    '  • comprei _ID_ (ou item)         → risca o item pela ID ou pelo nome do item (ex: comprei arroz OU comprei #do item)',
    '  • limpar lista          → remove todos os itens da lista',
    '',
    '🎁 *Wishlist*',
    '  • wishlist _item_       → adiciona “item” à sua wishlist',
    '  • wishlist              → exibe todos os itens da sua wishlist',
    '  • unwish _ID_ (ou item)           → remove item pelo nome ou ID',
    '',
    '💸 *Gastos*',
    '  • gasto _descrição_     → registra um gasto (ex: mercado 45,00)',
    '  • gastos                → exibe gastos atuais',
    '  • remover gasto _ID_ (ou item)    → riscas gasto na lista pela ID ou item',
    '  • limpar gastos         → zera todos os gastos (mantém cabeçalho)',
    '',
    '📝 *To-Do*',
    '  • todo _tarefa_         → adiciona uma tarefa à sua lista de To-Do',
    '  • todo                 → exibe lista de tarefas',
    '  • done _ID_             → risca a tarefa pela ID ou nome',
    '  • limpar to-do          → zera todas as tarefas da lista!',
    '',
    '🚫 *Obs:* não é possível limpar a wishlist 😉',
    '',
    '──────────────────────────',
    'Para ver o menu avançado com exemplos e detalhes, digite *menu avançado*'
  ].join('\n');
}

module.exports = { handle };
