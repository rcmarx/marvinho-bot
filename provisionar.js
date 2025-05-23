// provisionar.js
const { google } = require('googleapis');
const path = require('path');

// IDs das suas planilhas:
const USUARIOS_SHEET_ID = '18wuQE-7giGpyEAKkwco5wK7b6AmyOb3GOvkNYegZ87w';
const TEMPLATE_SHEET_ID = '1U4YHbXxMl4Fy2azL-WaTwMXgDCK9jjx7hI1xdqUdg2s';

// Credenciais e escopos
const CREDENTIALS_PATH = path.resolve(__dirname, 'credenciais.json');
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive'
];

async function main() {
  const auth = new GoogleAuth({
  keyFilename: CREDENTIALS_PATH,
  scopes: SCOPES
})
;
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const drive  = google.drive({ version: 'v3', auth: client });

  // 1) Nome da aba na planilha de usuários
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: USUARIOS_SHEET_ID,
    fields: 'sheets(properties(title))'
  });
  const sheetName = meta.data.sheets[0].properties.title;

  // 2) Lê todas as linhas A–D (inclui cabeçalho)
  const readRes = await sheets.spreadsheets.values.get({
    spreadsheetId: USUARIOS_SHEET_ID,
    range: `${sheetName}!A:D`
  });
  const rows = readRes.data.values || [];

  // 3) Para cada linha a partir do índice 1 (linha 2), provisiona se não tiver planilhaId
  for (let i = 1; i < rows.length; i++) {
    const [idUsuario, nome, numero, planilhaId] = rows[i];
    if (!planilhaId) {
      const copyRes = await drive.files.copy({
        fileId: TEMPLATE_SHEET_ID,
        requestBody: {
          name: `${idUsuario}-Marvinho Bot-${nome}`
        }
      });
      const newSpreadsheetId = copyRes.data.id;
      console.log(`→ Planilha criada para ${nome}: ${newSpreadsheetId}`);

      // 4) Atualiza D na linha correta
      const targetRange = `${sheetName}!D${i + 1}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId: USUARIOS_SHEET_ID,
        range: targetRange,
        valueInputOption: 'RAW',
        requestBody: { values: [[ newSpreadsheetId ]] }
      });
    }
  }

  console.log('✨ Provisionamento concluído.');
}

main().catch(err => {
  console.error('❌ Erro no provisionamento:', err);
  process.exit(1);
});
