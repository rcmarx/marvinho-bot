// gui/adicionarUsuario.js
const { google } = require('googleapis');
const path       = require('path');

// IDs das planilhas
const USUARIOS_SHEET_ID = '18wuQE-7giGpyEAKkwco5wK7b6AmyOb3GOvkNYegZ87w';
const TEMPLATE_SHEET_ID = '1U4YHbXxMl4Fy2azL-WaTwMXgDCK9jjx7hI1xdqUdg2s';

// Atenção: usamos `keyFilename`, nunca `keyFile`
const CREDENTIALS_PATH = path.resolve(__dirname, 'credenciais.json');
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive'
];

/**
 * Adiciona um novo usuário na planilha de controle e faz a cópia do template.
 * @param {{ nome: string, numero: string }} param0
 * @returns {Promise<{ id: number, nome: string, numero: string, planilhaId: string }>}
 */
async function adicionarUsuario({ nome, numero }) {
  // 1) autentica Sheets e Drive
  const auth       = new google.auth.GoogleAuth({
    keyFilename: CREDENTIALS_PATH,
    scopes: SCOPES
  });
  const clientAuth = await auth.getClient();
  const sheets     = google.sheets({ version: 'v4', auth: clientAuth });
  const drive      = google.drive({ version: 'v3', auth: clientAuth });

  // 2) descobre o nome da aba (geralmente "Sheet1")
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: USUARIOS_SHEET_ID,
    fields: 'sheets(properties(title))'
  });
  const aba = meta.data.sheets[0].properties.title;

  // 3) lê coluna A pra descobrir quantas linhas já existem (incluindo o cabeçalho)
  const colA   = await sheets.spreadsheets.values.get({
    spreadsheetId: USUARIOS_SHEET_ID,
    range: `${aba}!A:A`
  });
  const linhas = colA.data.values || [];
  // linhas.length = 1 (só cabeçalho) → nextId = 1
  // linhas.length = 6 (cabeçalho + 5 usuários) → nextId = 6
  const nextId = linhas.length;

  // 4) insere [ID, nome, número, ''] ao final
  await sheets.spreadsheets.values.append({
    spreadsheetId: USUARIOS_SHEET_ID,
    range: `${aba}!A:D`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[ nextId, nome, numero, '' ]] }
  });

  // 5) copia a planilha-template
  const copyRes    = await drive.files.copy({
    fileId: TEMPLATE_SHEET_ID,
    requestBody: { name: `${nextId}-Marvinho Bot-${nome}` }
  });
  const newSheetId = copyRes.data.id;

  // 6) atualiza a coluna D na **mesma linha** que acabou de inserir
  //    (linha = nextId + 1, porque a linha 1 é o cabeçalho)
  await sheets.spreadsheets.values.update({
    spreadsheetId: USUARIOS_SHEET_ID,
    range: `${aba}!D${nextId + 1}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[ newSheetId ]] }
  });

  console.log(`✅ Usuário ${nome} (ID ${nextId}) criado → sheet ${newSheetId}`);
  return { id: nextId, nome, numero, planilhaId: newSheetId };
}

module.exports = { adicionarUsuario };
