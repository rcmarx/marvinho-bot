// sheets.js
const { google } = require('googleapis');
const path       = require('path');

const CREDENTIALS_PATH = path.resolve(__dirname, 'credenciais.json');

// Autorização
async function autorizarGoogleSheets() {
  const auth = new google.auth.GoogleAuth({
  keyFilename: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

// Adiciona item (ID automático + valor)
async function adicionarItem(spreadsheetId, aba, valor) {
  const sheets = await autorizarGoogleSheets();
  const res    = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${aba}!A:A`,
  });
  const linhas = res.data.values || [];
  const nextId = linhas.length;
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${aba}!A:B`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[nextId, valor]] },
  });
}

// Lista itens numerados sem bullet, ignorando cabeçalho
async function consultarItens(spreadsheetId, aba) {
  const sheets = await autorizarGoogleSheets();
  const res    = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${aba}!A:B`,
  });
  const linhas = res.data.values || [];
  if (linhas.length <= 1) {
    return `📭 A sua "${aba}" está vazia.`;
  }
  const corpo = linhas
    .slice(1)
    .map(row => `${row[0]}. ${row[1]}`)
    .join('\n');
  return `📋 Itens na "${aba}":\n${corpo}`;
}

// Marca (~~riscado~~) por ID ou texto
async function marcarItem(spreadsheetId, aba, termo) {
  const sheets = await autorizarGoogleSheets();
  const res    = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${aba}!A:B`,
  });
  const linhas = res.data.values || [];
  let found = false;
  for (let i = 1; i < linhas.length; i++) {
    const [id, texto] = linhas[i];
    if (String(id) === termo || texto.toLowerCase() === termo.toLowerCase()) {
      const marcado = `~~${texto}~~`;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${aba}!B${i + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[marcado]] },
      });
      found = true;
      break;
    }
  }
  if (!found) {
    return `❌ O item "${termo}" não foi encontrado na "${aba}".`;
  }
  return `✅ Item marcado em "${aba}": ${termo}`;
}

// Remove por ID ou texto, preserva cabeçalho
async function removerItem(spreadsheetId, aba, termo) {
  const sheets = await autorizarGoogleSheets();
  const res    = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${aba}!A:B`,
  });
  const linhas = res.data.values || [];
  const novas  = linhas.filter((row, idx) => {
    if (idx === 0) return true;
    return !(String(row[0]) === termo || row[1].toLowerCase() === termo.toLowerCase());
  });
  if (novas.length === linhas.length) {
    return `❌ O item "${termo}" não foi encontrado na "${aba}".`;
  }
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${aba}!A2:B`
  });
  if (novas.length > 1) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${aba}!A2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: novas.slice(1) }
    });
  }
  return `✅ Item removido de "${aba}": ${termo}`;
}

// Limpa tudo abaixo do cabeçalho (linha1)
async function limparAba(spreadsheetId, aba) {
  const sheets = await autorizarGoogleSheets();
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${aba}!A2:B`
  });
  return `🧹 A aba "${aba}" foi limpa com sucesso.`;
}

module.exports = {
  adicionarItem,
  consultarItens,
  marcarItem,
  removerItem,
  limparAba,
};
