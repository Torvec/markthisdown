const { contextBridge, ipcRenderer } = require("electron");

// ! This does not work like how i thought it would, will come back to it later
// contextBridge.exposeInMainWorld("aboutInfo", {
//   electron: () => process.versions.electron,
//   chrome: () => process.versions.chrome,
//   node: () => process.versions.node,
//   v8: () => process.versions.v8,
//   osType: () => os.type(),
//   osArch: () => os.arch(),
//   osRelease: () => os.release(),
// });

contextBridge.exposeInMainWorld("fileAPI", {
  saveFileDialog: (filepath, content) => ipcRenderer.invoke("save-file-dialog", filepath, content),
  saveFile: (filepath, content) => ipcRenderer.invoke("save-file", filepath, content),
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  getRecentFiles: () => ipcRenderer.invoke("get-recent-files"),
  openRecentFile: (filepath) => ipcRenderer.invoke("open-recent-file", filepath),
});
