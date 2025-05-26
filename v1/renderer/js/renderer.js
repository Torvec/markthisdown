const filenameHdr = document.getElementById("filenameHdr");
const currentFilepath = document.getElementById("filepath");
const bodyContent = document.getElementById("bodyContent");

//! This interferes with setFrontmatterEditorState, fix it!
const editorDefaults = {
  filename: "untitled.md",
  filepath: "File Not Saved",
  frontmatter: "---\n\n---\n",
  body: "Body Content Here",
};

// ON INITIAL LOAD

document.addEventListener("DOMContentLoaded", () => {
  setEditorFields(editorDefaults);
  renderRecentFilesList();
});

// NEW
const newBtn = document.getElementById("newBtn");
const newBtnOptions = document.getElementById("newBtnOptions");
const newWithFrontmatter = document.getElementById("newWithFrontmatter");
const newNoFrontmatter = document.getElementById("newNoFrontmatter");

newBtn.addEventListener("click", () => {
  newBtnOptions.classList.toggle("hidden");
});

document.addEventListener("click", (event) => closeDropDownMenu(event, newBtnOptions, newBtn));

newWithFrontmatter.addEventListener("click", () => {
  newBtnOptions.classList.toggle("hidden");
  setFrontmatterEditorState("enabled");
  setEditorFields(editorDefaults);
});

newNoFrontmatter.addEventListener("click", () => {
  newBtnOptions.classList.toggle("hidden");
  setFrontmatterEditorState("disabled");
  setEditorFields(editorDefaults);
});

// OPEN
const openBtn = document.getElementById("openBtn");

openBtn.addEventListener("click", async () => {
  const openFileDialog = await fileAPI.openFileDialog();
  if (openFileDialog !== undefined) {
    setEditorFields(openFileDialog);
    renderRecentFilesList();
  }
});

// SAVE AS
const saveAsBtn = document.getElementById("saveAsBtn");

saveAsBtn.addEventListener("click", async () => {
  const filepath =
    currentFilepath.innerText !== "undefined" ? currentFilepath.innerText : "untitled.md";
  const content = combineEditorContent();
  const saveFileDialog = await fileAPI.saveFileDialog(filepath, content);
  if (saveFileDialog !== undefined) {
    setEditorFields(saveFileDialog);
    renderRecentFilesList();
  }
});

// SAVE
const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", async () => {
  const filepath = currentFilepath.innerText;
  const content = combineEditorContent();
  const savedFile = await fileAPI.saveFile(filepath, content);
  setEditorFields(savedFile);
});

// CLEAR
const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {
  const result = confirm("Are you sure?");
  if (result) setEditorFields(editorDefaults);
});

// RECENT
const recentBtn = document.getElementById("recentBtn");
const recentFiles = document.getElementById("recentFiles");

recentBtn.addEventListener("click", () => {
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

document.addEventListener("click", (event) => closeDropDownMenu(event, recentFiles, recentBtn));

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
  return `<button data-filepath="${filepath}" class="flex w-full overflow-hidden cursor-pointer space-x-3 p-3 bg-neutral-900 hover:bg-neutral-600 transition-colors duration-150 ease-in-out">
    <span class="font-medium shrink-0">${filename}</span>
    <span class="text-neutral-400 min-w-max">${filepath}</span>
  </button>`;
};

// FRONTMATTER
const fmContentBlock = document.getElementById("fmContentBlock");
const fmBlockViewBtn = document.getElementById("fmBlockViewBtn");
const fmLineItemViewBtn = document.getElementById("fmLineItemViewBtn");
const fmHideBtn = document.getElementById("fmHideBtn");
const fmShowBtn = document.getElementById("fmShowBtn");
const fmClearBtn = document.getElementById("fmClearBtn");
const fmRemoveBtn = document.getElementById("fmRemoveBtn");
const fmAddBtn = document.getElementById("fmAddBtn");

fmBlockViewBtn.addEventListener("click", () => {
  console.log("fmBlockViewBtn clicked");
});

fmLineItemViewBtn.addEventListener("click", () => {
  console.log("fmLineItemViewBtn clicked");
});

fmHideBtn.addEventListener("click", () => setFrontmatterEditorState("hidden"));
fmShowBtn.addEventListener("click", () => setFrontmatterEditorState("visible"));
fmClearBtn.addEventListener("click", () => (fmContentBlock.value = "---\n\n---\n"));
fmRemoveBtn.addEventListener("click", () => setFrontmatterEditorState("disabled"));
fmAddBtn.addEventListener("click", () => setFrontmatterEditorState("enabled"));

function setFrontmatterEditorState(state) {
  switch (state) {
    case "enabled":
      fmContentBlock.value = "---\nkey: value\n---\n";
      fmContentBlock.classList.remove("hidden");
      fmHideBtn.classList.remove("hidden");
      fmShowBtn.classList.add("hidden");
      fmAddBtn.classList.add("hidden");
      fmRemoveBtn.classList.remove("hidden");
      fmBlockViewBtn.disabled = false;
      fmLineItemViewBtn.disabled = false;
      fmHideBtn.disabled = false;
      fmShowBtn.disabled = false;
      fmClearBtn.disabled = false;
      break;
    case "disabled":
      fmContentBlock.value = "";
      fmContentBlock.classList.add("hidden");
      fmAddBtn.classList.remove("hidden");
      fmRemoveBtn.classList.add("hidden");
      fmBlockViewBtn.disabled = true;
      fmLineItemViewBtn.disabled = true;
      fmHideBtn.disabled = true;
      fmShowBtn.disabled = true;
      fmClearBtn.disabled = true;
      break;
    case "hidden":
      fmContentBlock.classList.add("hidden");
      fmHideBtn.classList.add("hidden");
      fmShowBtn.classList.remove("hidden");
      break;
    case "visible":
      fmContentBlock.classList.remove("hidden");
      fmHideBtn.classList.remove("hidden");
      fmShowBtn.classList.add("hidden");
      break;
  }
}

// UTILITY FUNCTIONS

function setEditorFields({ filename, filepath, frontmatter, body }) {
  filenameHdr.innerText = filename;
  currentFilepath.innerText = filepath;
  fmContentBlock.value = frontmatter;
  bodyContent.value = body;
}

function combineEditorContent() {
  const content = fmContentBlock.value + bodyContent.value;
  return content;
}

function closeDropDownMenu(event, menu, menuBtn) {
  if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
    menu.classList.add("hidden");
  }
}
