const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

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
}

function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    width: 480,
    height: 480,
    resizable: false,
    fullscreenable: false,
    minimizable: false,
    closable: true,
    title: "About MarkThisDown",
    // webPreferences: {
    //   preload: path.join(__dirname, "preload.js"),
    // },
  });
  aboutWindow.setMenuBarVisibility(false);
  aboutWindow.setAutoHideMenuBar(true);
  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
}

/*
# confirm an action:
  - dialog.showMessageBox({options})
# check anything before quitting the app:
  - app.before-quit
*/

/* # Create New File:
- A temporary in-memory object is created:
  - `filename = "untitled.md"`
  - `filePath = null`
  - `isSaved = false`
  - `content = ""`
- Ask whether frontmatter is needed:
  - Yes: enable frontmatter editor, pre-fill with `---\n\n---`
  - No: hide frontmatter editor, show button to enable it later
- Navigate to the editor screen immediately
- Show a visual indicator: "Unsaved file" or similar
*/

/* # First Time Save / Save As:
- Update internal editor state:
  - Set `filePath`, `filename`, `isSaved = true`
*/

/* # Save Modified File:
- If file is already saved (`isSaved = true`):
- If file is still unsaved:
  - Redirect to First Time Save flow
*/

/* # Exit / App Close:
- On `app.before-quit`, check:
  - If any open file has unsaved changes (`isDirty`)
    - Show dialog: "You have unsaved changes. Save before exiting?"
    - Options: Save / Discard / Cancel
  - If user cancels: cancel quit
- Consider auto-saving `untitled.md` content to memory or localStorage (optional)
  - Only restore if app crashed or exited unexpectedly
*/

// Checks if recent-files.json exists in userData directory, 
// If accesssync doesn't throw, then recent-files.json is filtered of any files that don't exist anymore
// Else create it and write an empty array into it
// Return the file path of recent-file.json
function getRecentFilesPath() {
  const recentFilesJSONPath = path.join(app.getPath("userData"), "recent-files.json");
  try {
    fs.accessSync(recentFilesJSONPath, fs.constants.F_OK);
    filterExistingRecentFiles(recentFilesJSONPath);
  } catch {
    fs.writeFileSync(recentFilesJSONPath, "[]");
  }
  return recentFilesJSONPath;
}

// Reads and parses the file into an array then filters the array of any files that don't exist anymore
// If the array needed to be modified then write the file with the new array
// Either way, return the recent-file.json filepath
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

// Checks for duplicate entries and caps the list at 10 items
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

function readAndParseFile(filepath) {
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
}

function writeAndStringifyFile(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data));
}

function parseFileForEditors(filepath) {
  const contents = fs.readFileSync(filepath, "utf8");
  let frontmatter = null;
  let body = contents;
  const regex = /^---\r?\n[\s\S]*?\r?\n---/;
  const match = contents.match(regex);
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

// MENU BAR
const menu = [];
if (isMac) {
  menu.push({
    label: app.name,
    submenu: [{ label: "About", click: createAboutWindow }],
  });
}
menu.push({ role: "fileMenu" });
if (!isMac) {
  menu.push({
    label: "Help",
    submenu: [{ label: "About", click: createAboutWindow }],
  });
}
if (isDev) {
  menu.push({
    label: "Developer",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { type: "separator" },
      { role: "toggledevtools" },
    ],
  });
}

// STARTING THE APP
app.whenReady().then(() => {
  createMainWindow();

  // Sets up the menu bar
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // Opens a window if none are open (mac)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quits the app when all windows are closed (win and linux)
app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
