const fs = require('fs');
const { google } = require('googleapis');

const CREDENTIALS_PATH = './credenciais.json';

async function autorizarGoogleSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

async function adicionarItem(spreadsheetId, aba, valor) {
  const sheets = await autorizarGoogleSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${aba}!A:A`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[valor]] }
  });
}

async function consultarItens(spreadsheetId, aba) {
  const sheets = await autorizarGoogleSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${aba}!A:B`
  });
  const linhas = res.data.values || [];
  if (!linhas.length) return `📭 A aba "${aba}" está vazia.`;
  const lista = linhas
    .map(row => row[1] === 'TRUE' ? `- ~${row[0]}~` : `- ${row[0]}`)
    .join('\n');
  return `📋 Itens em "${aba}":\n${lista}`;
}

async function marcarItem(spreadsheetId, aba, termo) {
  const sheets = await autorizarGoogleSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${aba}!A:A`
  });
  const linhas = res.data.values || [];
  const promises = [];
  let found = false;
  linhas.forEach((row, idx) => {
    if (row[0].toLowerCase() === termo.toLowerCase()) {
      found = true;
      promises.push(
        sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${aba}!B${idx+1}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [['TRUE']] }
        })
      );
    }
  });
  if (!found) return `❌ Não encontrei "${termo}" em "${aba}".`;
  await Promise.all(promises);
  return `✅ "${termo}" marcado como comprado em "${aba}".`;
}

async function removerItem(spreadsheetId, aba, termo) {
  const sheets = await autorizarGoogleSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${aba}!A:A`
  });
  const linhas = res.data.values || [];
  const novaLista = linhas.filter(row => row[0].toLowerCase() !== termo.toLowerCase());
  if (linhas.length === novaLista.length) return `❌ O item "${termo}" não foi encontrado em "${aba}".`;
  await sheets.spreadsheets.values.clear({ spreadsheetId, range: `${aba}!A:B` });
  if (novaLista.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${aba}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: novaLista }
    });
  }
  return `✅ Item removido de "${aba}": ${termo}`;
}

async function limparAba(spreadsheetId, aba) {
  const sheets = await autorizarGoogleSheets();
  await sheets.spreadsheets.values.clear({ spreadsheetId, range: `${aba}!A:B` });
  return `🧹 A aba "${aba}" foi limpa com sucesso.`;
}

module.exports = {
  adicionarItem,
  consultarItens,
  marcarItem,
  removerItem,
  limparAba
};
