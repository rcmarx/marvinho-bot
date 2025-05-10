const wppconnect = require('@wppconnect-team/wppconnect');
const fs = require('fs');
const path = require('path');
const { adicionarItem, consultarItens, removerItem, limparAba } = require('./sheets');

// Carrega usuários com nome e planilhaId
let usuarios = [];

try {
  const rawData = fs.readFileSync(path.resolve(__dirname, 'users.json'), 'utf-8');
  usuarios = JSON.parse(rawData);
} catch (erro) {
  console.error('❌ Erro ao carregar users.json. Verifique o formato do arquivo.');
  console.error(erro.message);
}

function getUsuario(numero) {
  return usuarios.find(u => u.numero === numero);
}

wppconnect.create({
  session: 'marvinho',
  headless: true,
  qrTimeout: 0,
  debug: false
}).then(client => {
  console.log('🤖 Bot conectado e pronto para receber mensagens!');

  client.onMessage(async (message) => {
    const texto = message.body.trim().toLowerCase();
    const usuario = getUsuario(message.from);

    if (!usuario) {
      console.log(`Mensagem ignorada de ${message.from}`);
      return;
    }

    const resposta = await tratarMensagem(texto, usuario);

    if (resposta) {
      await client.sendText(message.from, resposta);
    }
  });
}).catch(error => {
  console.error('Erro ao iniciar o bot:', error);
});

async function tratarMensagem(texto, usuario) {
  const planilhaId = usuario.planilhaId;

  if (texto === 'menu') {
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


  if (texto === 'oi') {
    return `Olá, ${usuario.nome}! Eu sou o Marvinho. Como posso te ajudar hoje?\nSe tiver dúvida, digite *menu* que eu te mostro as opções 😉`;
  }

  if (texto.startsWith('comprar ')) {
    const itens = texto.replace('comprar ', '').split('\n').map(i => i.trim()).filter(Boolean);
    for (const item of itens) {
      await adicionarItem(planilhaId, 'lista', item);
    }
    return `🛒 ${itens.length} item(ns) adicionados à lista de compras:\n- ${itens.join('\n- ')}`;
  }

  if (texto.startsWith('wishlist ')) {
    const itens = texto.replace('wishlist ', '').split('\n').map(i => i.trim()).filter(Boolean);
    for (const item of itens) {
      await adicionarItem(planilhaId, 'wishlist', item);
    }
    return `🎁 Adicionado(s) à wishlist:\n- ${itens.join('\n- ')}`;
  }

  if (texto.startsWith('gasto ')) {
    const itens = texto.replace('gasto ', '').split('\n').map(i => i.trim()).filter(Boolean);
    for (const item of itens) {
      await adicionarItem(planilhaId, 'financeiro', item);
    }
    return `💸 Gasto(s) registrado(s):\n- ${itens.join('\n- ')}`;
  }

  if (texto === 'lista de compras') {
    return await consultarItens(planilhaId, 'lista');
  }

  if (texto === 'wishlist') {
    return await consultarItens(planilhaId, 'wishlist');
  }

  if (texto === 'gastos') {
    return await consultarItens(planilhaId, 'financeiro');
  }

  if (texto.startsWith('comprei ')) {
    const itens = texto.replace('comprei ', '').split('\n').map(i => i.trim()).filter(Boolean);
    const resultados = [];
    for (const item of itens) {
      const resultado = await removerItem(planilhaId, 'lista', item);
      resultados.push(`- ${item}: ${resultado.includes('✅') ? 'removido' : 'não encontrado'}`);
    }
    return `🧹 Itens riscados da sua lista de compras:\n${resultados.join('\n')}`;
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

  if (texto.startsWith('remover gasto ')) {
    const itens = texto.replace('remover gasto ', '').split('\n').map(i => i.trim()).filter(Boolean);
    const resultados = [];
    for (const item of itens) {
      const resultado = await removerItem(planilhaId, 'financeiro', item);
      resultados.push(`- ${item}: ${resultado.includes('✅') ? 'removido' : 'não encontrado'}`);
    }
    return `💸 Itens riscados do seu controle de gastos:\n${resultados.join('\n')}`;
  }

  if (texto === 'limpar lista') {
    return await limparAba(planilhaId, 'lista');
  }

  if (texto === 'limpar gastos') {
    return await limparAba(planilhaId, 'financeiro');
  }

  return [
    '🤖 Hmmmm talvez você tenha tentado um comando que eu não tenha entendido.',
    'Para saber o que você pode fazer, digite *menu*'
  ].join('\n');
}
