const wppconnect = require('@wppconnect-team/wppconnect');
const fs = require('fs');
const path = require('path');
const commands = require('./commands');
const { getUsuario } = require('./utils/users');
// Importa o puppeteer completo (não só o core)
const puppeteer = require('puppeteer');

wppconnect.create({
  session: 'marvinho',
  headless: true,
  qrTimeout: 0,
  debug: false,
  puppeteerOptions: {
    // Usa o executável de Chromium que o pacote puppeteer baixou
    executablePath: puppeteer.executablePath(),
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ],
  }
})
.then(client => {
  console.log('🤖 Bot conectado e pronto para receber mensagens!');

  client.onMessage(async (message) => {
    const texto = message.body.trim().toLowerCase();
    const usuario = getUsuario(message.from);

    if (!usuario) {
      console.log(`Mensagem ignorada de ${message.from}`);
      return;
    }

    const resposta = await commands.handle(texto, usuario);
    if (resposta) {
      await client.sendText(message.from, resposta);
    }
  });
})
.catch(error => {
  console.error('Erro ao iniciar o bot:', error);
});
