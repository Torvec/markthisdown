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
FILE HANDLING REQUIREMENTS:
# Recent Files Feature
- Need a recent-files.json file that will be saved in userData
- Anytime the user opens a file or saves a new one the recent-file.json will be updated
- recent-files.json Will only track the last 10 to 15 or so files opened/edited/created
- Need to check if recent-files.json exists
  - If not, create it with an empty array []
  - If it does, read it, pass the output to the renderer via preload, renderer will parse the json and loop through all of the contents to render a button for each file that can be clicked to open the file and hae it's contents rendered in the editor (dashboard screen --> editor screen)
  - If the recent-files.json is empty just output a string saying no files used recently or something along those lines
# New File Feature

# Open File Feature

# Save File Feature

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
