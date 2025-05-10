const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect.create({
  session: 'my-session',
  headless: false,
  qrTimeout: 0,
  devtools: true,
  debug: true
}).then(client => {
  console.log('Cliente criado com sucesso!');

  const numeroDestino = '5519993025622@c.us'; // adicione o @c.us

  const mensagem = 'Olá, esta é uma mensagem do bot!';

  console.log(`Enviando mensagem para ${numeroDestino}...`);

  client.sendText(numeroDestino, mensagem)
    .then(response => {
      console.log('✅ Mensagem enviada com sucesso:', response);
    })
    .catch(error => {
      console.error('❌ Erro ao enviar mensagem:', error);
    });
}).catch(error => {
  console.error('❌ Erro ao criar cliente:', error);
});
