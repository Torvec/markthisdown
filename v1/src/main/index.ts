import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import fs from "node:fs";
import path from "node:path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 1280,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const recentFilesDir = "userData";
const recentFilesName = "recent-files.json";

function getRecentFilesPath() {
  const recentFilesJSONPath = path.join(app.getPath(recentFilesDir), recentFilesName);
  try {
    fs.accessSync(recentFilesJSONPath, fs.constants.F_OK);
    filterExistingRecentFiles(recentFilesJSONPath);
  } catch {
    fs.writeFileSync(recentFilesJSONPath, "[]");
  }
  return recentFilesJSONPath;
}

function filterExistingRecentFiles(recentFilesJSONPath) {
  const fileContents = readAndParseFile(recentFilesJSONPath);
  let modified = false;
  const filteredFilesList = fileContents.filter((item) => {
    try {
      fs.accessSync(item.filepath, fs.constants.F_OK);
      return true;
    } catch {
      modified = true;
      return false;
    }
  });
  if (modified) {
    writeAndStringifyFile(recentFilesJSONPath, filteredFilesList);
  }
  return recentFilesJSONPath;
}

function updateRecentFilesList(recentFilesPath, addedFilePath) {
  const fileContents = readAndParseFile(recentFilesPath);
  const addedFileName = path.basename(addedFilePath);
  const fileListItem = { filename: addedFileName, filepath: addedFilePath };
  const maxSize = 10;
  for (let i = 0; i < fileContents.length; i++) {
    if (fileContents[i].filepath === fileListItem.filepath) {
      fileContents.splice(i, 1);
      break;
    }
  }
  fileContents.unshift(fileListItem);
  if (fileContents.length > maxSize) fileContents.pop();
  writeAndStringifyFile(recentFilesPath, fileContents);
}

const readAndParseFile = (filepath) => {
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
};

const writeAndStringifyFile = (filepath, data) => {
  fs.writeFileSync(filepath, JSON.stringify(data));
};

function parseFileForEditors(filepath) {
  const contents = fs.readFileSync(filepath, "utf8");
  let frontmatter = null;
  let body = contents;
  const match = contents.match(/^---\r?\n[\s\S]*?\r?\n---/);
  if (match) {
    frontmatter = match[0];
    body = contents.slice(frontmatter.length).trimStart();
  }
  return {
    filepath,
    filename: path.basename(filepath),
    frontmatter,
    body,
  };
}

// IPC Handlers

ipcMain.handle("get-recent-files", () => {
  try {
    return readAndParseFile(getRecentFilesPath());
  } catch (err) {
    console.error(err.message);
    return "[]";
  }
});

ipcMain.handle("open-recent-file", (_, filepath) => {
  updateRecentFilesList(getRecentFilesPath(), filepath);
  return parseFileForEditors(filepath);
});

ipcMain.handle("save-file-dialog", (_, filepath, content) => {
  const newFilePath = dialog.showSaveDialogSync({
    title: "Save Markdown File",
    defaultPath: filepath,
    filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
  });
  if (!newFilePath) {
    console.log("New File not created");
    return;
  }
  fs.writeFileSync(newFilePath, content, "utf8");
  updateRecentFilesList(getRecentFilesPath(), newFilePath);
  return parseFileForEditors(newFilePath);
});

ipcMain.handle("save-file", (_, filepath, content) => {
  fs.writeFileSync(filepath, content);
  updateRecentFilesList(getRecentFilesPath(), filepath);
  return parseFileForEditors(filepath);
});

ipcMain.handle("open-file-dialog", () => {
  const openedFile = dialog.showOpenDialogSync({
    title: "Open Markdown File",
    filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
    properties: ["openFile"],
  });
  if (!openedFile) {
    console.log("No file selected");
    return;
  }
  updateRecentFilesList(getRecentFilesPath(), openedFile[0]);
  return parseFileForEditors(openedFile[0]);
});