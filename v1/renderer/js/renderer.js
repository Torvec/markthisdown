const filenameHdr = getById("filenameHdr");
const currentFilepath = getById("filepath");
const bodyContent = getById("bodyContent");

const defaultFileState = {
  filename: "untitled.md",
  filepath: "File Not Saved",
  frontmatter: "---\nFrontmatter: Content\n---\n",
  body: "Body Content",
};

// ON INITIAL LOAD
document.addEventListener("DOMContentLoaded", () => {
  setEditorFields(defaultFileState);
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

newFileUI.button.addEventListener("click", () => {
  newFileUI.optionsMenu.classList.toggle("hidden");
});

document.addEventListener("click", (event) =>
  closeDropDownMenu(event, newFileUI.optionsMenu, newFileUI.button),
);

newFileUI.options.withFM.addEventListener("click", () => {
  newFileUI.optionsMenu.classList.toggle("hidden");
  setFrontmatterEditorState("enabled");
  setEditorFields(defaultFileState);
});

newFileUI.options.noFM.addEventListener("click", () => {
  newFileUI.optionsMenu.classList.toggle("hidden");
  setFrontmatterEditorState("disabled");
  setEditorFields({
    filename: "untitled.md",
    filepath: "File Not Saved",
    frontmatter: "",
    body: "Body Content",
  });
});

// OPEN
const openBtn = getById("openBtn");

openBtn.addEventListener("click", async () => {
  const openFileDialog = await fileAPI.openFileDialog();
  if (openFileDialog !== undefined) {
    setEditorFields(openFileDialog);
    renderRecentFilesList();
  }
});

// SAVE AS
const saveAsBtn = getById("saveAsBtn");

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
const saveBtn = getById("saveBtn");

saveBtn.addEventListener("click", async () => {
  const filepath = currentFilepath.innerText;
  const content = combineEditorContent();
  const savedFile = await fileAPI.saveFile(filepath, content);
  setEditorFields(savedFile);
});

// CLEAR
const clearAllUI = {
  button: getById("clearBtn"),
  optionsMenu: getById("clearBtnOptions"),
  options: {
    confirm: getById("confirmClear"),
    cancel: getById("cancelClear"),
  },
};

clearAllUI.button.addEventListener("click", () => {
  clearAllUI.optionsMenu.classList.toggle("hidden");
});

document.addEventListener("click", (event) =>
  closeDropDownMenu(event, clearAllUI.optionsMenu, clearAllUI.button),
);

clearAllUI.options.confirm.addEventListener("click", () => {
  clearAllUI.optionsMenu.classList.toggle("hidden");
  setEditorFields({
    filename: filenameHdr.innerText,
    filepath: currentFilepath.innerText,
    frontmatter: "---\n\n---\n",
    body: "",
  });
});

clearAllUI.options.cancel.addEventListener("click", () =>
  clearAllUI.optionsMenu.classList.toggle("hidden"),
);

// RECENT
const recentBtn = getById("recentBtn");
const recentFiles = getById("recentFiles");

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
const fmContentBlock = getById("fmContentBlock");

// FRONTMATTER BLOCK VIEW
const fmBlockViewBtn = getById("fmBlockViewBtn");
fmBlockViewBtn.addEventListener("click", () => {
  console.log("fmBlockViewBtn clicked");
});

// FRONTMATTER LINE ITEM VIEW
const fmLineItemViewBtn = getById("fmLineItemViewBtn");
fmLineItemViewBtn.addEventListener("click", () => {
  console.log("fmLineItemViewBtn clicked");
});

// FRONTMATTER HIDE
const fmHideBtn = getById("fmHideBtn");
fmHideBtn.addEventListener("click", () => setFrontmatterEditorState("hidden"));

// FRONTMATTER SHOW
const fmShowBtn = getById("fmShowBtn");
fmShowBtn.addEventListener("click", () => setFrontmatterEditorState("visible"));

// FRONTMATTER CLEAR
const clearFMUI = {
  button: getById("fmClearBtn"),
  optionsMenu: getById("fmClearBtnOptions"),
  options: {
    confirm: getById("fmConfirmClear"),
    cancel: getById("fmCancelClear"),
  },
};

clearFMUI.button.addEventListener("click", () => clearFMUI.optionsMenu.classList.toggle("hidden"));

document.addEventListener("click", (event) =>
  closeDropDownMenu(event, clearFMUI.optionsMenu, clearFMUI.button),
);

clearFMUI.options.confirm.addEventListener("click", () => {
  clearFMUI.optionsMenu.classList.toggle("hidden");
  fmContentBlock.value = "---\n\n---\n";
});

clearFMUI.options.cancel.addEventListener("click", () =>
  clearFMUI.optionsMenu.classList.toggle("hidden"),
);

// FRONTMATTER REMOVE
const removeFMUI = {
  button: getById("fmRemoveBtn"),
  optionsMenu: getById("fmRemoveBtnOptions"),
  options: {
    confirm: getById("fmConfirmRemove"),
    cancel: getById("fmCancelRemove"),
  },
};

removeFMUI.button.addEventListener("click", () =>
  removeFMUI.optionsMenu.classList.toggle("hidden"),
);

document.addEventListener("click", (event) =>
  closeDropDownMenu(event, removeFMUI.optionsMenu, removeFMUI.button),
);

removeFMUI.options.confirm.addEventListener("click", () => {
  removeFMUI.optionsMenu.classList.toggle("hidden");
  setFrontmatterEditorState("disabled");
});

removeFMUI.options.cancel.addEventListener("click", () =>
  removeFMUI.optionsMenu.classList.toggle("hidden"),
);

// FRONTMATTER ADD
const fmAddBtn = getById("fmAddBtn");
fmAddBtn.addEventListener("click", () => setFrontmatterEditorState("enabled"));

// FRONTMATTER EDITOR STATE HANDLER
function setFrontmatterEditorState(state) {
  switch (state) {
    case "enabled":
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
