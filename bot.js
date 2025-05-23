const wppconnect    = require('@wppconnect-team/wppconnect');
const puppeteer     = require('puppeteer');
const commands      = require('./commands');
const { getUsuario } = require('./utils/users');

(async () => {
  try {
    const client = await wppconnect.create({
      session: 'marvinho',
      headless: true,
      qrTimeout: 0,
      debug: false,
      puppeteerOptions: {
        executablePath: puppeteer.executablePath(),
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ],
      },
    });

    console.log('🤖 Bot conectado e pronto para receber mensagens!');

    client.onMessage(async (message) => {
      const texto   = message.body.trim().toLowerCase();
      const usuario = await getUsuario(message.from);

      // se não for usuário cadastrado, ignora completamente
      if (!usuario) {
        return;
      }

      try {
        const resposta = await commands.handle(texto, usuario);
        if (resposta) {
          await client.sendText(message.from, resposta);
        }
      } catch (err) {
        console.error('Erro ao processar comando:', err);
        // opcional: notifica o usuário cadastrado de erro interno
        await client.sendText(
          message.from,
          '❌ Ocorreu um erro interno. Tente novamente mais tarde.'
        );
      }
    });

  } catch (error) {
    console.error('❌ Falha ao iniciar o bot:', error);
    process.exit(1);
  }
})();
