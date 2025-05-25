const newBtn = document.getElementById("newBtn");
const openBtn = document.getElementById("openBtn");
const saveAsBtn = document.getElementById("saveAsBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const recentBtn = document.getElementById("recentBtn");
const recentFiles = document.getElementById("recentFiles");
const filenameHdr = document.getElementById("filenameHdr");
const currentFilepath = document.getElementById("filepath");
const fmContent = document.getElementById("fmContent");
const bodyContent = document.getElementById("bodyContent");

const editorDefaults = {
  filename: "untitled.md",
  filepath: "unsaved",
  frontmatter: "---\nkey: value\n---\n",
  body: "Body Content Here",
};

// EVENT LISTENERS

document.addEventListener("DOMContentLoaded", () => {
  setEditorFields(editorDefaults);
  renderRecentFilesList();
});

newBtn.addEventListener("click", () => {
  setEditorFields(editorDefaults);
});

openBtn.addEventListener("click", async () => {
  const openFileDialog = await fileAPI.openFileDialog();
  if (openFileDialog !== undefined) {
    setEditorFields(openFileDialog);
    renderRecentFilesList();
  }
});

saveAsBtn.addEventListener("click", async () => {
  const filepath =
    currentFilepath.innerText !== "undefined" ? currentFilepath.innerText : "untitled.md";
  const content = saveEditorContent();
  const saveFileDialog = await fileAPI.saveFileDialog(filepath, content);
  if (saveFileDialog !== undefined) {
    setEditorFields(saveFileDialog);
    renderRecentFilesList();
  }
});

saveBtn.addEventListener("click", async () => {
  const filepath = currentFilepath.innerText;
  const content = saveEditorContent();
  const savedFile = await fileAPI.saveFile(filepath, content);
  setEditorFields(savedFile);
});

clearBtn.addEventListener("click", async () => {
  const result = confirm("Are you sure?");
  if (result) setEditorFields(editorDefaults);
});

recentBtn.addEventListener("click", async () => {
  recentFiles.classList.toggle("hidden");
});

recentFiles.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-filepath]");
  if (!button) return;
  const openFile = await fileAPI.openRecentFile(button.dataset.filepath);
  recentFiles.classList.toggle("hidden");
  setEditorFields(openFile);
  renderRecentFilesList();
});

document.addEventListener("click", (event) => {
  const clickedInsideRecentFiles = recentFiles.contains(event.target);
  const clickedRecentBtn = recentBtn.contains(event.target);
  if (!clickedInsideRecentFiles && !clickedRecentBtn) {
    recentFiles.classList.add("hidden");
  }
});

// UTILITY FUNCTIONS

function setEditorFields({ filepath, filename, frontmatter, body }) {
  filenameHdr.innerText = filename;
  currentFilepath.innerText = filepath;
  fmContent.value = frontmatter;
  bodyContent.value = body;
}

function saveEditorContent() {
  const content = fmContent.value + bodyContent.value;
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
  return `<button data-filepath="${filepath}" class="flex w-full overflow-hidden text-left cursor-pointer space-x-3 p-3 bg-neutral-900 hover:bg-neutral-600 transition-colors duration-150 ease-in-out">
    <span class="font-medium shrink-0">${filename}</span>
    <span class="text-neutral-400 min-w-max">${filepath}</span>
  </button>`;
};

/*
🔳 Need a save as and save button next to each other and both will bring up the save dialog if the file hasn't been saved/titled at least once, after that save will just save over the file, but only if anything changed
*/
