const fs = require('fs');
const path = require('path');

let usuarios = [];
try {
  const rawData = fs.readFileSync(path.resolve(__dirname, '../users.json'), 'utf-8');
  usuarios = JSON.parse(rawData);
} catch (erro) {
  console.error('❌ Erro ao carregar users.json. Verifique o formato do arquivo.');
  console.error(erro.message);
}

function getUsuario(numero) {
  return usuarios.find(u => u.numero === numero);
}

module.exports = { getUsuario };