const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("node:path");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 1280,
    title: "MarkThisDown",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");

  if (isDev) {
    win.webContents.openDevTools();
  }
};

// Removes the default menu bar
Menu.setApplicationMenu(null);

app.whenReady().then(() => {
//   ipcMain.handle("ping", () => "Some text from the main process");
  createWindow();
  // Opens a window if none are open (mac)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quits the app when all windows are closed (win and linux)
app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
