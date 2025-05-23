// setupSheets.js
const { google } = require('googleapis');
const path = require('path');

// IDs das planilhas
const CREDENTIALS_PATH  = path.resolve(__dirname, 'credenciais.json');
const USUARIOS_SHEET_ID = '18wuQE-7giGpyEAKkwco5wK7b6AmyOb3GOvkNYegZ87w';
const ABAS              = ['lista', 'wishlist', 'financeiro', 'to-do'];

async function authorizeSheets() {
  const auth = new google.auth.GoogleAuth({
  keyFilename: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

async function loadUsuarios() {
  const sheets = await authorizeSheets();
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: USUARIOS_SHEET_ID,
    fields: 'sheets(properties(title))'
  });
  const aba = meta.data.sheets[0].properties.title;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: USUARIOS_SHEET_ID,
    range: `${aba}!B2:D`
  });
  return (res.data.values || []).map(([nome, numero, planilhaId]) => ({
    nome,
    planilhaId: planilhaId.trim()
  }));
}

(async () => {
  const sheets   = await authorizeSheets();
  const usuarios = await loadUsuarios();

  for (const { nome, planilhaId } of usuarios) {
    for (const aba of ABAS) {
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: planilhaId,
          range:         `${aba}!A1:B1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [['ID', `item ${aba}`]]
          }
        });
        console.log(`✅ Cabeçalho ajustado para ${nome} → aba "${aba}"`);
      } catch (err) {
        console.error(`❌ Erro em ${nome} [aba: ${aba}]:`, err.message);
      }
    }
  }
  console.log('✨ setupSheets concluído.');
})();
