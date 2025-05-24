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
- Show `dialog.showSaveDialog()` to select location and filename
- Save content using `fs.writeFile()`
- Update internal editor state:
  - Set `filePath`, `filename`, `isSaved = true`
- Add file to top of recent-files list
  - Normalize path (`path.resolve()`)
  - Deduplicate if already present
  - Save updated recent-files.json
*/

/* # Save Modified File:
- If file is already saved (`isSaved = true`):
  - Overwrite it directly with `fs.writeFile()`
  - Update lastModified timestamp in recent-files.json
- If file is still unsaved:
  - Redirect to First Time Save flow
*/

/* # Open Existing File:
- Show `dialog.showOpenDialog()` for user to pick a file
- Read file with `fs.readFile()`
- Parse for frontmatter (`---`) and body content
  - Populate frontmatter editor and markdown editor separately
- Normalize and save file path to recent-files.json
- Navigate to editor screen
- If opened via recent-files button:
  - Skip dialog — load file immediately using its path
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

/* # Additions:
- Track and show lastOpened or lastModified in recent-files.json
- Add a "Clear Recent Files" button in Settings or Dashboard
- Handle invalid or corrupted recent-files.json gracefully
- Add “Reload Last File on Startup” setting
- Add "Reveal in Folder" or "Open in Default App" using shell.openPath
*/

/*
Checks if recent-files.json exists in userData directory, 
If accesssync doesn't throw, then recent-files.json is filtered of any files that don't exist anymore
Else create it and write an empty array into it
Return the file path of recent-file.json
*/
function recentFilesJSONExists() {
  const recentFilesJSONPath = path.join(
    app.getPath("userData"),
    "recent-files.json"
  );
  try {
    fs.accessSync(recentFilesJSONPath, fs.constants.F_OK);
    filterExistingRecentFiles(recentFilesJSONPath);
  } catch {
    fs.writeFileSync(recentFilesJSONPath, "[]");
  }
  return recentFilesJSONPath;
}

/*
Reads and parses the file into an array then filters the array of any files that don't exist anymore
If the array needed to be modified then write the file with the new array
Either way, return the recent-file.json filepath
*/
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

/*
  Checks for duplicate entries and caps the list at 10 items
*/
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
  const fileName = path.basename(filepath);
  const fileContents = fs.readFileSync(filepath, {
    encoding: "utf8",
  });
  let frontmatter = null;
  let body = fileContents;
  const regex = /^---\r?\n[\s\S]*?\r?\n---/;
  const match = fileContents.match(regex);
  if (match) {
    frontmatter = match[0];
    body = fileContents.slice(frontmatter.length).trimStart();
  }
  return {
    name: fileName,
    frontmatter: frontmatter,
    body: body,
  };
}

ipcMain.handle("get-recent-files", () => {
  try {
    return readAndParseFile(recentFilesJSONExists());
  } catch (err) {
    console.error(err.message);
    return "[]";
  }
});

ipcMain.handle("open-recent-file", (_, filepath) => {
  updateRecentFilesList(recentFilesJSONExists(), filepath);
  return parseFileForEditors(filepath);
});

ipcMain.handle("save-file-dialog", () => {
  const newFilePath = dialog.showSaveDialogSync({
    title: "Save Markdown File",
    filters: [{ name: "Markdown Files", extensions: ["md", "markdown"] }],
  });
  if (!newFilePath) {
    console.log("New File not created");
    return;
  }
  updateRecentFilesList(recentFilesJSONExists(), newFilePath);
  fs.writeFileSync(newFilePath, "");
  const fileName = path.basename(newFilePath);
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

/*
match() return an array
Extract everything after frontmatter and trim any leading whitespace
Matches anything that starts with '---\n or \r' and ends with '---\n or \r' and everything in between
*/
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
  updateRecentFilesList(recentFilesJSONExists(), openedFile[0]);
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
