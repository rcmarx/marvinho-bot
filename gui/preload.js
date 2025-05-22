// gui/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  addUser: data => ipcRenderer.invoke('add-user', data)
});
