// gui/render.js
const nomeIn = document.getElementById('nome');
const numIn  = document.getElementById('numero');
const btn    = document.getElementById('btn');
const status = document.getElementById('status');

btn.addEventListener('click', async () => {
  const nomeRaw   = nomeIn.value.trim();
  let   numeroRaw = numIn.value.replace(/\D/g, ''); // só dígitos

  if (!nomeRaw || numeroRaw.length < 10) {
    return alert('Preencha um nome e um telefone válido (somente dígitos).');
  }

  // adiciona sufixo @c.us
  if (!numeroRaw.endsWith('@c.us')) {
    numeroRaw += '@c.us';
  }

  btn.disabled    = true;
  btn.textContent = 'Enviando…';
  status.textContent = '';

  try {
    const res = await window.api.addUser({ nome: nomeRaw, numero: numeroRaw });
    if (res.success) {
      status.textContent = '✅ Usuário criado! ID: ' + res.id;
      nomeIn.value = '';
      numIn.value  = '';
      nomeIn.focus();
    } else {
      status.textContent = '❌ Erro: ' + res.message;
    }
  } catch (err) {
    console.error(err);
    status.textContent = '❌ Erro inesperado.';
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Adicionar';
  }
});
