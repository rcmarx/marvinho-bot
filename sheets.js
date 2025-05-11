// sheets.js
const fs = require('fs');
const { google } = require('googleapis');

const CREDENTIALS_PATH = './credenciais.json';

// Autoriza e devolve o client do Sheets
async function autorizarGoogleSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

// Adiciona um item: calcula próximo ID e insere em A (ID) e B (valor)
async function adicionarItem(spreadsheetId, aba, valor) {
  const sheets = await autorizarGoogleSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${aba}!A:A`,
  });
  const linhas = res.data.values || [];
  const nextId = linhas.length; // header é linha1, então próxima ID = linhas.length
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${aba}!A:B`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[nextId, valor]] },
  });
}

// Lista itens numerados, sem o “- ” e ignorando o cabeçalho
async function consultarItens(spreadsheetId, aba) {
  const sheets = await autorizarGoogleSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${aba}!A:B`,
  });
  const linhas = res.data.values || [];
  if (linhas.length <= 1) {
    return `📭 A sua "${aba}" está vazia.`;
  }
  // remove header e formata: "ID. item"
  const corpo = linhas
    .slice(1)
    .map(row => `${row[0]}. ${row[1]}`)
    .join('\n');
  return `📋 Itens na "${aba}":\n${corpo}`;
}

// Marca (risca) por texto ou por ID, aplicando ~~strikethrough~~ no valor
async function marcarItem(spreadsheetId, aba, termo) {
  const sheets = await autorizarGoogleSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${aba}!A:B`,
  });
  const linhas = res.data.values || [];
  let found = false;

  for (let i = 1; i < linhas.length; i++) {
    const id = String(linhas[i][0]);
    const texto = linhas[i][1];
    if (termo === id || texto.toLowerCase() === termo.toLowerCase()) {
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
  return `✅ Item marcado como concluído em "${aba}": ${termo}`;
}

// Remove por texto ou por ID, preserva cabeçalho
async function removerItem(spreadsheetId, aba, termo) {
  const sheets = await autorizarGoogleSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${aba}!A:B`,
  });
  const linhas = res.data.values || [];
  // filtra: mantém header (idx===0) ou linhas que NÃO correspondam a termo (texto ou ID)
  const novas = linhas.filter((row, idx) => {
    if (idx === 0) return true;
    const id = String(row[0]);
    const texto = row[1];
    return !(termo === id || texto.toLowerCase() === termo.toLowerCase());
  });

  if (novas.length === linhas.length) {
    return `❌ O item "${termo}" não foi encontrado na "${aba}".`;
  }

  // limpa abaixo do header
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${aba}!A2:B`,
  });

  // reescreve as linhas que sobraram (sem header)
  if (novas.length > 1) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${aba}!A2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: novas.slice(1) },
    });
  }

  return `✅ Item removido da "${aba}": ${termo}`;
}

// Limpa tudo abaixo da linha 1, preserva o cabeçalho
async function limparAba(spreadsheetId, aba) {
  const sheets = await autorizarGoogleSheets();
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${aba}!A2:B`,
  });
  return `🧹 A "${aba}" foi limpa com sucesso.`;
}

module.exports = {
  adicionarItem,
  consultarItens,
  marcarItem,
  removerItem,
  limparAba,
};
