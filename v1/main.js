const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";
const recentFiles = "./recent-files.json";

function createMainWindow() {
  const mainWin = new BrowserWindow({
    width: 1280,
    height: 1280,
    title: "MarkThisDown",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWin.loadFile("index.html");

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

  aboutWindow.loadFile(path.join(__dirname, "about.html"));
}

/*
# check if a file exists: 
  - fs.existsSync(filepath) OR fs.promises.access(filepath, fs.constants.F_OK)
# check the extension:
  - path.extname(filepath) === ".md"
# check metadata of the file (last modified, is a file, size, etc.):
  - stats = fs.promises.stat(filepath) -> stats.isFile(), stats.mtime
# open a file: 
  - dialog.showOpenDialogSync({options}) OR dialog.showOpenDialog({options})
# save a new file/sava as: 
  - dialog.showSaveDialogSync({options}) OR dialog.showSaveDialog({options})
# read a file: 
  - fs.readFileSync(filepath, {encoding}) OR fs.promises.readFile(filepath, {encoding})
# write a file/save changes to an existing file: 
  - fs.writeFileSync(filepath, data) OR fs.promises.writeFile(filepath, data)
# get the file name:
  - path.basename
# get the full filepath:
  - dialog.showOpenDialog and dialog.showSaveDialog both return the full file path when used, 
  however the showOpenDialog saves it in an array and since i only intend to allow one file being open at a time then it will be located at position 0
# normalize the filepath:
  - path.resolve(filepath) -> use when adding a file to recent files list, when checking if a file exists in recent files list, when using showOpenDialog()
# where the user data is:
  - app.getPath("userData") -> where the recent file list will be created/saved
# confirm an action:
  - dialog.showMessageBox({options})
*/

/*
App states
# Startup:
  - Looks for recent-files.json in "userData"
    - Does not exist: create it with an empty array []
    - Exists: read it, verify files still exist, send contents to renderer via preload
# Create New File:
  - Filename is untitled.md by default
  - Select whether it has frontmatter or not
    - Yes: Enable front matter editor and add --- and --- to front matter editor
    - No: Front matter editor disabled and a frontmatter editor button will show in it's place
  - Go to editor screen immediately
    - Some kind of indicator that the file needs to be saved and named

# First Time Save/Save As:

# Save Modified File:

# Open Existing File:

# Exit
*/

async function recentFilesExists() {
  try {
    const recentFilesPath = path.join(
      app.getPath("userData"),
      "recent-files.json"
    );
    await fs.promises.access(recentFilesPath, fs.constants.F_OK);
    console.log("It exists!");
  } catch {
    console.log("Does not exist :/");
  }
}

ipcMain.handle("save-file-dialog", () => {
  const newFilePath = dialog.showSaveDialogSync({
    title: "Save Markdown File",
    filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
  });
  if (!newFilePath) {
    console.log("New File not created");
    return;
  }
  const fileName = path.basename(newFilePath);
  fs.writeFileSync(newFilePath, "");
  const fileContents = fs.readFileSync(newFilePath, {
    encoding: "utf8",
  });
  const frontmatter = "---\n\n---\n";
  return {
    name: fileName,
    frontmatter: frontmatter,
    body: fileContents,
  };
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
  const fileName = path.basename(openedFile[0]);
  const fileContents = fs.readFileSync(openedFile[0], {
    encoding: "utf8",
  });
  let frontmatter = null;
  let body = fileContents;
  // Matches anything that starts with '---\n or \r' and ends with '---\n or \r' and everything in between
  const regex = /^---\r?\n[\s\S]*?\r?\n---/;
  const match = fileContents.match(regex);
  if (match) {
    // match() return an array
    frontmatter = match[0];
    // Extract everything after frontmatter and trim any leading whitespace
    body = fileContents.slice(frontmatter.length).trimStart();
  }
  return {
    name: fileName,
    frontmatter: frontmatter,
    body: body,
  };
});

ipcMain.handle("get-recent-files", async () => {
  try {
    // const recentFilesPath = path.join(app.getPath("userData"), recentFiles);
    const readRecentFiles = await fs.promises.readFile(recentFiles, {
      encoding: "utf-8",
    });
    return readRecentFiles;
  } catch (err) {
    console.error(err.message);
  }
});

ipcMain.handle("set-recent-files", () => {});

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
  recentFilesExists();
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
