// commands/index.js
const menu         = require('./menu');
const menuAvancado = require('./menuAvancado');
const compras      = require('./compras');
const wishlist     = require('./wishlist');
const financeiro   = require('./financeiro');
const todo         = require('./todo');

const SAUDACOES = [
  'oi', 'oie', 'oii', 'oies',
  'olá', 'ola',
  'hello', 'hi', 'hey'
];

async function handle(texto, usuario) {
  // 0. Saudação — qualquer uma das variações
  if (SAUDACOES.includes(texto)) {
    return `Olá, ${usuario.nome}! Eu sou o Marvinho. Como posso te ajudar hoje?\nSe tiver dúvida, digite *menu* para ver as opções.`;
  }

  // 1. Menu Avançado
  if (texto === 'menu avançado' || texto === 'menu avancado') {
    return menuAvancado.handle();
  }

  // 2. Menu Simples
  if (texto === 'menu') {
    return menu.handle();
  }

  // 3. Compras
  const respCompras = await compras.handle(texto, usuario);
  if (respCompras) return respCompras;

  // 4. Wishlist
  const respWish = await wishlist.handle(texto, usuario);
  if (respWish) return respWish;

  // 5. Financeiro
  const respFin = await financeiro.handle(texto, usuario);
  if (respFin) return respFin;

  // 6. To-Do
  const respTodo = await todo.handle(texto, usuario);
  if (respTodo) return respTodo;

  // 7. Fallback
  return [
    '🤖 Hmmmm, acho que você tentou um comando que eu não entendi.',
    'Para saber o que pode fazer, digite *menu*.'
  ].join('\n');
}

module.exports = { handle };
