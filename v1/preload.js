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
  saveFileDialog: () => ipcRenderer.invoke("save-file-dialog"),
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
});
