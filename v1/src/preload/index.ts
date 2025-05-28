import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("fileAPI", {
      saveFileDialog: (filepath, content) =>
        ipcRenderer.invoke("save-file-dialog", filepath, content),
      saveFile: (filepath, content) => ipcRenderer.invoke("save-file", filepath, content),
      openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
      getRecentFiles: () => ipcRenderer.invoke("get-recent-files"),
      openRecentFile: (filepath) => ipcRenderer.invoke("open-recent-file", filepath),
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
