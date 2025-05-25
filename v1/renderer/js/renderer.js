const newBtn = document.getElementById("newBtn");
const openBtn = document.getElementById("openBtn");
const saveAsBtn = document.getElementById("saveAsBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const recentBtn = document.getElementById("recentBtn");
const recentFiles = document.getElementById("recentFiles");
const filenameHdr = document.getElementById("filenameHdr");
const currentFilepath = document.getElementById("filepath");
const frontmatterContent = document.getElementById("frontmatterContent");
const bodyContent = document.getElementById("bodyContent");

const editorDefaults = {
  filename: "untitled.md",
  frontmatter: "---\nkey: value\n---\n",
  body: "Body Content Here",
};

// EVENT LISTENERS

document.addEventListener("DOMContentLoaded", () => {
  setEditorFields(editorDefaults);
});

newBtn.addEventListener("click", () => {
  setEditorFields(editorDefaults);
});

openBtn.addEventListener("click", async () => {
  const openFileDialog = await fileAPI.openFileDialog();
  if (openFileDialog !== undefined) setEditorFields(openFileDialog);
});

saveAsBtn.addEventListener("click", async () => {
  const filepath =
    currentFilepath.innerText !== "undefined" ? currentFilepath.innerText : "untitled.md";
  const content = saveEditorContent();
  const saveFileDialog = await fileAPI.saveFileDialog(filepath, content);
  if (saveFileDialog !== undefined) setEditorFields(saveFileDialog);
});

saveBtn.addEventListener("click", async () => {
  const filepath = currentFilepath.innerText;
  const content = saveEditorContent();
  const savedFile = await fileAPI.saveFile(filepath, content);
  setEditorFields(savedFile);
});

//! TODO: Implement functionality
clearBtn.addEventListener("click", async () => {
  setEditorFields(editorDefaults);
});

recentBtn.addEventListener("click", async () => {
  recentFiles.classList.toggle("hidden");
});

recentFiles.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-filepath]");
  if (!button) return;
  const filepath = button.dataset.filepath;
  const openFile = await fileAPI.openRecentFile(filepath);
  recentFiles.classList.toggle("hidden");
  setEditorFields(openFile);
});

// UTILITY FUNCTIONS

function setEditorFields({ filepath, filename, frontmatter, body }) {
  filenameHdr.innerText = filename;
  currentFilepath.innerText = filepath;
  frontmatterContent.value = frontmatter;
  bodyContent.value = body;
}

function saveEditorContent() {
  const content = frontmatterContent.value + bodyContent.value;
  return content;
}

async function renderRecentFilesList() {
  const fileList = await fileAPI.getRecentFiles();
  if (fileList.length === 0) {
    const message = "Recent Files List Empty";
    recentFiles.innerHTML = noRecentFilesP(message);
    return fileList;
  }
  let buttons = "";
  fileList.forEach((file) => {
    buttons += recentFilesBtn(file.filename, file.filepath);
  });
  recentFiles.innerHTML = buttons;
  return fileList;
}

const noRecentFilesP = (message) => {
  return `<p class="text-center text-neutral-500 italic">${message}</p>`;
};

const recentFilesBtn = (filename, filepath) => {
  return `<button data-filepath="${filepath}" class="flex w-full overflow-hidden text-left cursor-pointer space-x-3 p-3 bg-neutral-900 hover:bg-neutral-600 active:scale-90 transition-all duration-150 ease-in-out">
    <span class="font-medium shrink-0">${filename}</span>
    <span class="text-neutral-400 min-w-max">${filepath}</span>
  </button>`;
};

renderRecentFilesList();

/*
🔳 Need a save as and save button next to each other and both will bring up the save dialog if the file hasn't been saved/titled at least once, after that save will just save over the file, but only if anything changed
*/
