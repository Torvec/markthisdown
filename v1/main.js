const { app, BrowserWindow, Menu } = require("electron");
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

app.whenReady().then(() => {
  createMainWindow();

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
