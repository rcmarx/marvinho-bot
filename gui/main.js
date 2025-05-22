// gui/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { adicionarUsuario } = require('./adicionarUsuario');

// caminho dinâmico para credenciais.json (dev ou empacotado)
function getCredsPath() {
  if (app.isPackaged) {
    // quando empacotado, extraResources cai em resources/
    return path.join(process.resourcesPath, 'credenciais.json');
  } else {
    return path.resolve(__dirname, 'credenciais.json');
  }
}

// injeta o path correto em process.env para que adicionarUsuario leia
process.env.CREDS_PATH = getCredsPath();

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 350,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.removeMenu();
  win.loadFile('index.html');

  if (!app.isPackaged) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(createWindow);

ipcMain.handle('add-user', async (_event, { nome, numero }) => {
  console.log('⏳ add-user invocado com', nome, numero);
  try {
    const result = await adicionarUsuario({ nome, numero });
    console.log('✅ adicionarUsuario result:', result);
    return { success: true, ...result };
  } catch (e) {
    console.error('❌ Erro no GUI ao adicionar usuário:', e);
    return { success: false, message: e.message };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
