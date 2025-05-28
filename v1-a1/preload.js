const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("fileAPI", {
  saveFileDialog: (filepath, content) => ipcRenderer.invoke("save-file-dialog", filepath, content),
  saveFile: (filepath, content) => ipcRenderer.invoke("save-file", filepath, content),
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  getRecentFiles: () => ipcRenderer.invoke("get-recent-files"),
  openRecentFile: (filepath) => ipcRenderer.invoke("open-recent-file", filepath),
});
