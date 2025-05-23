// utils/users.js
const { google } = require('googleapis');
const path = require('path');

// IDs e credenciais
const USUARIOS_SHEET_ID = '18wuQE-7giGpyEAKkwco5wK7b6AmyOb3GOvkNYegZ87w';
const CREDENTIALS_PATH  = path.resolve(__dirname, '../credenciais.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

let cacheUsuarios = null;

async function authorizeSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

async function loadUsuarios() {
  if (cacheUsuarios) return cacheUsuarios;

  const sheets = await authorizeSheets();
  // Descobre o nome da primeira aba
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: USUARIOS_SHEET_ID,
    fields: 'sheets(properties(title))',
  });
  const aba = meta.data.sheets[0].properties.title;

  // Lê colunas B (Nome), C (Número), D (planilhaId) a partir da linha 2
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: USUARIOS_SHEET_ID,
    range: `${aba}!B2:D`,
  });
  const rows = res.data.values || [];

  // Monta objeto { nome, numero, planilhaId }
  cacheUsuarios = rows.map(([nome, numero, planilhaId]) => ({
    nome,
    numero,
    planilhaId,
  }));
  return cacheUsuarios;
}

/**
 * Busca um usuário pelo número completo (ex: '5511999999999@c.us').
 */
async function getUsuario(numero) {
  const usuarios = await loadUsuarios();
  return usuarios.find(u => u.numero === numero);
}

module.exports = { getUsuario };
