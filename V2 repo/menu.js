function handle() {
  return [
    '🤖 *Menu do Marvinho*',
    'Gerencie suas tarefas do dia a dia com comandos simples e diretos.',
    '',
    '──────────────────────────',
    '',
    '🛒 *Lista de Compras*',
    'Adicione, visualize ou remova itens da sua lista de compras com facilidade.',
    '• _comprar arroz_ → adiciona “arroz” à lista de compras',
    '• _lista de compras_ → exibe os itens atuais da lista',
    '• _comprei arroz_ → remove “arroz” da lista, marcando como comprado',
    '• _limpar lista_ → limpa todos os itens da lista de compras',
    '',
    '🎁 *Wishlist*',
    'Anote os desejos do coração — de presentes a sonhos de consumo.',
    '• _wishlist guitarra_ → adiciona “guitarra” à sua wishlist',
    '• _unwish guitarra_ → remove “guitarra” da sua wishlist',
    '',
    '💸 *Gastos*',
    'Registre e acompanhe seus gastos rapidamente.',
    '• _gasto mercado 45,00_ → registra um gasto de R$45,00 com “mercado”',
    '• _gastos_ → exibe todos os gastos registrados até agora',
    '• _remover gasto mercado 45,00_ → remove esse gasto específico da lista',
    '• _limpar gastos_ → zera toda a lista de gastos',
    '',
    '🚫 *Obs:* não é possível limpar a wishlist 😉',
    '',
    '──────────────────────────',
    'Digite o comando desejado para começar!'
  ].join('\n');
}

module.exports = { handle };