const filenameHdr = getById("filenameHdr");
const currentFilepath = getById("filepath");
const bodyContent = getById("bodyContent");

const fileState = {
  filename: "untitled.md",
  filepath: "untitled.md",
  hasFrontmatter: true,
  isSaved: false,
  isModified: false,
};

// const defaultFields = {
//   filename: fileState.filename,
//   filepath: fileState.filepath === fileState.filename ? "File Not Saved" : fileState.filepath,
//   frontmatter: fileState.hasFrontmatter ? "---\nFrontmatter: Content\n---\n" : "",
//   body: "Body Content",
// };

// ON INITIAL LOAD
document.addEventListener("DOMContentLoaded", () => {
  setFmEditorState("enabled");
  filenameHdr.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = "---\nFrontmatter: Content\n---\n";
  bodyContent.value = "Body Content";
  fileState.isSaved = false;
  fileState.isModified = false;
  renderRecentFilesList();
});

// NEW
const newFileUI = {
  button: getById("newBtn"),
  optionsMenu: getById("newBtnOptions"),
  options: {
    withFM: getById("newWithFrontmatter"),
    noFM: getById("newNoFrontmatter"),
  },
};
onClick(newFileUI.button, () => toggleVisibility(newFileUI.optionsMenu));

onClick(newFileUI.options.withFM, () => {
  toggleVisibility(newFileUI.optionsMenu);
  setFmEditorState("enabled");
  fileState.filename = "untitled.md";
  fileState.filepath = "untitled.md";
  filenameHdr.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = "---\nFrontmatter: Content\n---\n";
  bodyContent.value = "Body Content";
  fileState.isSaved = false;
  fileState.isModified = false;
});

onClick(newFileUI.options.noFM, () => {
  toggleVisibility(newFileUI.optionsMenu);
  setFmEditorState("disabled");
  fileState.filename = "untitled.md";
  fileState.filepath = "untitled.md";
  filenameHdr.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = "";
  bodyContent.value = "Body Content";
  fileState.isSaved = false;
  fileState.isModified = false;
});

onClick(document, (event) => closeDropDownMenu(event, newFileUI.optionsMenu, newFileUI.button));

// OPEN
const openBtn = getById("openBtn");

onClick(openBtn, async () => {
  const openFileDialog = await fileAPI.openFileDialog();
  if (openFileDialog !== undefined) {
    fileState.filename = openFileDialog.filename;
    fileState.filepath = openFileDialog.filepath;
    filenameHdr.innerText = fileState.filename;
    currentFilepath.innerText = fileState.filepath;
    fmContentBlock.value = openFileDialog.frontmatter;
    bodyContent.value = openFileDialog.body;
    if (fmContentBlock.value === "") setFmEditorState("disabled");
    else setFmEditorState("enabled");
    fileState.isSaved = true;
    fileState.isModified = false;
    renderRecentFilesList();
  }
});

// RECENT
const recentUI = {
  button: getById("recentBtn"),
  optionsMenu: getById("recentFiles"),
};

onClick(recentUI.button, () => toggleVisibility(recentUI.optionsMenu));

onClick(recentUI.optionsMenu, async (event) => {
  const button = event.target.closest("button[data-filepath]");
  if (!button) return;
  const openFile = await fileAPI.openRecentFile(button.dataset.filepath);
  toggleVisibility(recentUI.optionsMenu);
  fileState.filename = openFile.filename;
  fileState.filepath = openFile.filepath;
  filenameHdr.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = openFile.frontmatter;
  bodyContent.value = openFile.body;
  if (fmContentBlock.value === "") setFmEditorState("disabled");
  else setFmEditorState("enabled");
  fileState.isSaved = true;
  fileState.isModified = false;
  renderRecentFilesList();
});

onClick(document, (event) => closeDropDownMenu(event, recentUI.optionsMenu, recentUI.button));

async function renderRecentFilesList() {
  const fileList = await fileAPI.getRecentFiles();
  if (fileList.length === 0) {
    const message = "Recent Files List Empty";
    recentUI.optionsMenu.innerHTML = noRecentFilesP(message);
    return fileList;
  }
  let buttons = "";
  fileList.forEach((file) => {
    buttons += recentFilesBtn(file.filename, file.filepath);
  });
  recentUI.optionsMenu.innerHTML = buttons;
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

// SAVE AS
const saveAsBtn = getById("saveAsBtn");

onClick(saveAsBtn, async () => {
  const saveFileDialog = await fileAPI.saveFileDialog(fileState.filepath, combineEditorContent());
  if (saveFileDialog !== undefined) {
    fileState.filename = saveFileDialog.filename;
    fileState.filepath = saveFileDialog.filepath;
    filenameHdr.innerText = fileState.filename;
    currentFilepath.innerText = fileState.filepath;
    fmContentBlock.value = saveFileDialog.frontmatter;
    bodyContent.value = saveFileDialog.body;
    fileState.isSaved = true;
    fileState.isModified = false;
    renderRecentFilesList();
  }
});

// SAVE
const saveBtn = getById("saveBtn");

if (!fileState.isSaved || !fileState.isModified) saveBtn.disabled = true;

onClick(saveBtn, async () => {
  const savedFile = await fileAPI.saveFile(fileState.filepath, combineEditorContent());
  fileState.filename = savedFile.filename;
  fileState.filepath = savedFile.filepath;
  filenameHdr.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = savedFile.frontmatter;
  bodyContent.value = savedFile.body;
  fileState.isSaved = true;
  fileState.isModified = false;
});

// CLEAR ALL
const clearAllUI = {
  button: getById("clearBtn"),
  optionsMenu: getById("clearBtnOptions"),
  options: {
    confirm: getById("confirmClear"),
    cancel: getById("cancelClear"),
  },
};

onClick(clearAllUI.button, () => toggleVisibility(clearAllUI.optionsMenu));

onClick(clearAllUI.options.confirm, () => {
  toggleVisibility(clearAllUI.optionsMenu);
  filenameHdr.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = "---\n\n---\n";
  bodyContent.value = "";
});

onClick(clearAllUI.options.cancel, () => toggleVisibility(clearAllUI.optionsMenu));

onClick(document, (event) => closeDropDownMenu(event, clearAllUI.optionsMenu, clearAllUI.button));

// FRONTMATTER
const fmContentBlock = getById("fmContentBlock");

// FRONTMATTER BLOCK VIEW
const fmBlockViewBtn = getById("fmBlockViewBtn");

onClick(fmBlockViewBtn, () => console.log("fmBlockViewBtn clicked"));

// FRONTMATTER LINE ITEM VIEW
const fmLineItemViewBtn = getById("fmLineItemViewBtn");

onClick(fmLineItemViewBtn, () => console.log("fmLineItemViewBtn clicked"));

// FRONTMATTER HIDE
const fmHideBtn = getById("fmHideBtn");

onClick(fmHideBtn, () => setFmEditorState("hidden"));

// FRONTMATTER SHOW
const fmShowBtn = getById("fmShowBtn");

onClick(fmShowBtn, () => setFmEditorState("visible"));

// FRONTMATTER CLEAR
const clearFMUI = {
  button: getById("fmClearBtn"),
  optionsMenu: getById("fmClearBtnOptions"),
  options: {
    confirm: getById("fmConfirmClear"),
    cancel: getById("fmCancelClear"),
  },
};
onClick(clearFMUI.button, () => toggleVisibility(clearFMUI.optionsMenu));

onClick(clearFMUI.options.confirm, () => {
  toggleVisibility(clearFMUI.optionsMenu);
  fmContentBlock.value = "---\n\n---\n";
});

onClick(clearFMUI.options.cancel, () => toggleVisibility(clearFMUI.optionsMenu));

onClick(document, (event) => closeDropDownMenu(event, clearFMUI.optionsMenu, clearFMUI.button));

// FRONTMATTER REMOVE
const removeFMUI = {
  button: getById("fmRemoveBtn"),
  optionsMenu: getById("fmRemoveBtnOptions"),
  options: {
    confirm: getById("fmConfirmRemove"),
    cancel: getById("fmCancelRemove"),
  },
};

onClick(removeFMUI.button, () => toggleVisibility(removeFMUI.optionsMenu));

onClick(removeFMUI.options.confirm, () => {
  toggleVisibility(removeFMUI.optionsMenu);
  setFmEditorState("disabled");
});

onClick(removeFMUI.options.cancel, () => toggleVisibility(removeFMUI.optionsMenu));

onClick(document, (event) => closeDropDownMenu(event, removeFMUI.optionsMenu, removeFMUI.button));

// FRONTMATTER ADD
const fmAddBtn = getById("fmAddBtn");

onClick(fmAddBtn, () => setFmEditorState("enabled"));

// FRONTMATTER EDITOR STATE HANDLER
function setFmEditorState(state) {
  switch (state) {
    case "enabled":
      fileState.hasFrontmatter = true;
      fmContentBlock.value = "---\n\n---\n";
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
      fileState.hasFrontmatter = false;
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

function getById(element) {
  return document.getElementById(element);
}

function onClick(element, func) {
  element.addEventListener("click", func);
}

function toggleVisibility(element) {
  element.classList.toggle("hidden");
}
