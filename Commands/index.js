const menu = require('./menu');
const compras = require('./compras');
const wishlist = require('./wishlist');
const financeiro = require('./financeiro');

async function handle(texto, usuario) {
  // Saudação
  if (texto === 'oi') {
    return `Olá, ${usuario.nome}! Eu sou o Marvinho. Como posso te ajudar hoje?\nSe tiver dúvida, digite *menu* para ver as opções.`;
  }
  
  // Menu
  if (texto === 'menu') return menu.handle();

  // Compras
  const respCompras = await compras.handle(texto, usuario);
  if (respCompras) return respCompras;

  // Wishlist
  const respWishlist = await wishlist.handle(texto, usuario);
  if (respWishlist) return respWishlist;

  // Financeiro
  const respFin = await financeiro.handle(texto, usuario);
  if (respFin) return respFin;
  
  // Comando não reconhecido
  return null;
}

module.exports = { handle };
