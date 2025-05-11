// setupSheets.js
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const CREDENTIALS_PATH = './credenciais.json';
const USERS_PATH       = './users.json';
const ABAS             = ['lista', 'wishlist', 'financeiro', 'to-do'];

async function autorizar() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth: await auth.getClient() });
}

(async () => {
  const sheets = await autorizar();
  const raw   = fs.readFileSync(path.resolve(__dirname, USERS_PATH), 'utf-8');
  const users = JSON.parse(raw);

  for (const u of users) {
    for (const aba of ABAS) {
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: u.planilhaId,
          range:         `${aba}!A1:B1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [['ID', `item ${aba}`]]
          }
        });
        console.log(`✅ Cabeçalho criado em ${u.nome} → aba "${aba}"`);
      } catch (e) {
        console.error(`❌ Erro no ${u.nome} aba "${aba}":`, e.message);
      }
    }
  }
})();
