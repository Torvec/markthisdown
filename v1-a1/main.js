const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";
const recentFilesDir = "userData"
const recentFilesName = "recent-files.json"

function createMainWindow() {
  const mainWin = new BrowserWindow({
    width: 1280,
    height: 1280,
    title: "MarkThisDown",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWin.loadFile(path.join(__dirname, "./renderer/index.html"));
  if (isDev) mainWin.webContents.openDevTools();
  mainWin.setMenu(null);
}

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
}

const writeAndStringifyFile = (filepath, data) => {
  fs.writeFileSync(filepath, JSON.stringify(data));
}

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

// STARTING THE APP
app.whenReady().then(() => {
  createMainWindow();

  // Opens a window if none are open (mac)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quits the app when all windows are closed (win and linux)
app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
