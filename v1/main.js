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

ipcMain.handle("save-file-dialog", async () => {
  const newFilePath = dialog.showSaveDialogSync({
    title: "Save Markdown File",
    filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
  });
  if (!newFilePath) {
    console.log("New File not created");
    return;
  }
  const fileName = path.basename(newFilePath);
  await fs.promises.writeFile(newFilePath, "");
  const fileContents = await fs.promises.readFile(newFilePath, {
    encoding: "utf8",
  });
  const file = {
    name: fileName,
    content: fileContents,
  };
  return file;
});

ipcMain.handle("open-file-dialog", async () => {
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
  const fileContents = await fs.promises.readFile(openedFile[0], {
    encoding: "utf8",
  });
  const file = {
    name: fileName,
    content: fileContents,
  };
  return file;
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
