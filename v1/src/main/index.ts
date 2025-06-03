import { app, shell, BrowserWindow, ipcMain, dialog, screen } from "electron";
import fs from "node:fs";
import path from "node:path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

type RecentFile = { filename: string; filepath: string };

type ParsedFileType = {
  filepath: string;
  filename: string;
  frontmatter: string | null;
  body: string;
};

//* Electron-Vite Boilerplate
function createWindow(): void {
  const { height } = screen.getPrimaryDisplay().workAreaSize;
  const size = height;
  const mainWindow = new BrowserWindow({
    width: size,
    height: size,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.webContents.openDevTools();
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

// This method will be called when Electron has finished initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and require them here.

//* Recent Files File Handling Functions
function getRecentFilesPath(): string {
  const recentFilesJSONPath = path.join(app.getPath("userData"), "recent-files.json");
  try {
    fs.accessSync(recentFilesJSONPath, fs.constants.F_OK);
    filterRecentFiles(recentFilesJSONPath);
  } catch {
    fs.writeFileSync(recentFilesJSONPath, "[]");
  }
  return recentFilesJSONPath;
}

function filterRecentFiles(recentFilesJSONPath: string): string {
  const fileContents = JSON.parse(fs.readFileSync(recentFilesJSONPath, "utf8"));
  let modified = false;
  const filteredFilesList: RecentFile[] = fileContents.filter((item: RecentFile) => {
    try {
      fs.accessSync(item.filepath, fs.constants.F_OK);
      return true;
    } catch {
      modified = true;
      return false;
    }
  });
  if (modified) {
    fs.writeFileSync(recentFilesJSONPath, JSON.stringify(filteredFilesList));
  }
  return recentFilesJSONPath;
}

function updateRecentFilesList(recentFilesPath: string, addedFilePath: string): void {
  const fileContents = JSON.parse(fs.readFileSync(recentFilesPath, "utf8"));
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
  fs.writeFileSync(recentFilesPath, JSON.stringify(fileContents));
}

//* Parsing functions
function parseFileForEditors(filepath: string): ParsedFileType {
  const contents = fs.readFileSync(filepath, "utf8");
  let frontmatter: string | null = null;
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

//* IPC File Handlers
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

ipcMain.handle("get-recent-files", () => {
  try {
    return JSON.parse(fs.readFileSync(getRecentFilesPath(), "utf8"));
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
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

ipcMain.handle("show-file-in-folder", (_, filepath: string) => {
  return shell.showItemInFolder(filepath);
});
