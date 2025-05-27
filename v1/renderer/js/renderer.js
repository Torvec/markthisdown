const fileState = {
  filename: "untitled.md",
  filepath: "untitled.md",
  hasFrontmatter: true,
  fmView: "block",
  content: {
    frontmatter: "---\nFrontmatter: Content\n---",
    body: "Body Content",
  },
  isSaved: false,
  isModified: false,
};

// UI ELEMENTS

const filename = getById("filename");
const currentFilepath = getById("filepath");
const bodyContent = getById("bodyContent");

const newFile = {
  button: getById("newFile"),
  optionsMenu: getById("newFileOptions"),
  options: {
    withFm: getById("newFileWithFm"),
    noFM: getById("newFileNoFm"),
  },
};
const openFile = getById("openFile");
const openRecent = {
  button: getById("openRecent"),
  optionsMenu: getById("recentFilesMenu"),
};
const saveAs = getById("saveAs");
const saveFile = getById("saveFile");
const clearAll = {
  button: getById("clearAll"),
  optionsMenu: getById("clearAllMenu"),
  options: {
    confirm: getById("confirmClearAll"),
    cancel: getById("cancelClearAll"),
  },
};
const fmContentBlock = getById("fmContentBlock");
const fmBlockView = getById("fmBlockView");
const fmLineItemView = getById("fmLineItemView");
const fmHide = getById("fmHide");
const fmShow = getById("fmShow");
const clearFm = {
  button: getById("fmClear"),
  optionsMenu: getById("fmClearMenu"),
  options: {
    confirm: getById("fmConfirmClear"),
    cancel: getById("fmCancelClear"),
  },
};
const removeFm = {
  button: getById("fmRemove"),
  optionsMenu: getById("fmRemoveMenu"),
  options: {
    confirm: getById("fmConfirmRemove"),
    cancel: getById("fmCancelRemove"),
  },
};
const addFm = getById("fmAdd");

// EVENTS

document.addEventListener("DOMContentLoaded", () => handleInitialLoad());

onClick(newFile.button, () => toggleVisibility(newFile.optionsMenu));
onClick(newFile.options.withFm, () => handleNewFileWithFm());
onClick(newFile.options.noFM, () => handleNewFileNoFm());
onClick(document, (event) => closeDropDownMenu(event, newFile.optionsMenu, newFile.button));

onClick(openFile, () => handleOpenFile());

onClick(openRecent.button, () => toggleVisibility(openRecent.optionsMenu));
onClick(openRecent.optionsMenu, (event) => handleOpenRecent(event));
onClick(document, (event) => closeDropDownMenu(event, openRecent.optionsMenu, openRecent.button));

onClick(saveAs, () => handleSaveAs());

onClick(saveFile, () => handleSaveFile());

onClick(clearAll.button, () => toggleVisibility(clearAll.optionsMenu));
onClick(clearAll.options.confirm, () => handleClearAllConfirm());
onClick(clearAll.options.cancel, () => toggleVisibility(clearAll.optionsMenu));
onClick(document, (event) => closeDropDownMenu(event, clearAll.optionsMenu, clearAll.button));

onClick(fmBlockView, () => console.log("fmBlockView clicked"));

onClick(fmLineItemView, () => console.log("fmLineItemView clicked"));

onClick(fmHide, () => setFmEditorState("hidden"));

onClick(fmShow, () => setFmEditorState("visible"));

onClick(clearFm.button, () => toggleVisibility(clearFm.optionsMenu));
onClick(clearFm.options.confirm, () => handleClearFmConfirm());
onClick(clearFm.options.cancel, () => toggleVisibility(clearFm.optionsMenu));
onClick(document, (event) => closeDropDownMenu(event, clearFm.optionsMenu, clearFm.button));

onClick(removeFm.button, () => toggleVisibility(removeFm.optionsMenu));
onClick(removeFm.options.confirm, () => handleRemoveConfirm());
onClick(removeFm.options.cancel, () => toggleVisibility(removeFm.optionsMenu));
onClick(document, (event) => closeDropDownMenu(event, removeFm.optionsMenu, removeFm.button));

onClick(addFm, () => setFmEditorState("enabled"));

// FUNCTIONS

function handleInitialLoad() {
  filename.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = fileState.content.frontmatter;
  bodyContent.value = fileState.content.body;
  fileState.isSaved = false;
  fileState.isModified = false;
  renderRecentFilesList();
}

function handleNewFileWithFm() {
  toggleVisibility(newFile.optionsMenu);
  setFmEditorState("enabled");
  fileState.filename = "untitled.md";
  fileState.filepath = "untitled.md";
  filename.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = "---\nFrontmatter: Content\n---\n";
  bodyContent.value = "Body Content";
  fileState.isSaved = false;
  fileState.isModified = false;
}

function handleNewFileNoFm() {
  toggleVisibility(newFile.optionsMenu);
  setFmEditorState("disabled");
  fileState.filename = "untitled.md";
  fileState.filepath = "untitled.md";
  filename.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = "";
  bodyContent.value = "Body Content";
  fileState.isSaved = false;
  fileState.isModified = false;
}

async function handleOpenFile() {
  const openFileDialog = await fileAPI.openFileDialog();
  if (openFileDialog !== undefined) {
    fileState.filename = openFileDialog.filename;
    fileState.filepath = openFileDialog.filepath;
    filename.innerText = fileState.filename;
    currentFilepath.innerText = fileState.filepath;
    fmContentBlock.value = openFileDialog.frontmatter;
    bodyContent.value = openFileDialog.body;
    if (fmContentBlock.value === "") setFmEditorState("disabled");
    else setFmEditorState("enabled");
    fileState.isSaved = true;
    fileState.isModified = false;
    renderRecentFilesList();
  }
}

async function handleOpenRecent(event) {
  const button = event.target.closest("button[data-filepath]");
  if (!button) return;
  const openFile = await fileAPI.openRecentFile(button.dataset.filepath);
  toggleVisibility(openRecent.optionsMenu);
  fileState.filename = openFile.filename;
  fileState.filepath = openFile.filepath;
  filename.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = openFile.frontmatter;
  bodyContent.value = openFile.body;
  if (fmContentBlock.value === "") setFmEditorState("disabled");
  else setFmEditorState("enabled");
  fileState.isSaved = true;
  fileState.isModified = false;
  renderRecentFilesList();
}

async function renderRecentFilesList() {
  const fileList = await fileAPI.getRecentFiles();
  if (fileList.length === 0) {
    const message = "Recent Files List Empty";
    openRecent.optionsMenu.innerHTML = noRecentFilesP(message);
    return fileList;
  }
  let buttons = "";
  fileList.forEach((file) => {
    buttons += recentFile(file.filename, file.filepath);
  });
  openRecent.optionsMenu.innerHTML = buttons;
  return fileList;
}

const noRecentFilesP = (message) => {
  return `<p class="text-center text-neutral-500 italic">${message}</p>`;
};

const recentFile = (filename, filepath) => {
  return `<button data-filepath="${filepath}" class="flex w-full overflow-hidden cursor-pointer space-x-3 p-3 bg-neutral-900 hover:bg-neutral-600 transition-colors duration-150 ease-in-out">
    <span class="font-medium shrink-0">${filename}</span>
    <span class="text-neutral-400 min-w-max">${filepath}</span>
  </button>`;
};

async function handleSaveAs() {
  const saveFileDialog = await fileAPI.saveFileDialog(fileState.filepath, combineEditorContent());
  if (saveFileDialog !== undefined) {
    fileState.filename = saveFileDialog.filename;
    fileState.filepath = saveFileDialog.filepath;
    filename.innerText = fileState.filename;
    currentFilepath.innerText = fileState.filepath;
    fmContentBlock.value = saveFileDialog.frontmatter;
    bodyContent.value = saveFileDialog.body;
    fileState.isSaved = true;
    fileState.isModified = false;
    renderRecentFilesList();
  }
}

async function handleSaveFile() {
  let savedFile = fileState.isSaved
    ? await fileAPI.saveFile(fileState.filepath, combineEditorContent())
    : await fileAPI.saveFileDialog(fileState.filepath, combineEditorContent());
  fileState.filename = savedFile.filename;
  fileState.filepath = savedFile.filepath;
  filename.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = savedFile.frontmatter;
  bodyContent.value = savedFile.body;
  fileState.isSaved = true;
  fileState.isModified = false;
}

function handleClearAllConfirm() {
  toggleVisibility(clearAll.optionsMenu);
  filename.innerText = fileState.filename;
  currentFilepath.innerText = fileState.filepath;
  fmContentBlock.value = "---\n\n---\n";
  bodyContent.value = "";
}

function handleClearFmConfirm() {
  toggleVisibility(clearFm.optionsMenu);
  fmContentBlock.value = "---\n\n---\n";
}

function handleRemoveConfirm() {
  toggleVisibility(removeFm.optionsMenu);
  setFmEditorState("disabled");
}

// FRONTMATTER EDITOR STATE HANDLER
function setFmEditorState(state) {
  switch (state) {
    case "enabled":
      fileState.hasFrontmatter = true;
      fmContentBlock.value = "---\n\n---\n";
      fmContentBlock.classList.remove("hidden");
      fmHide.classList.remove("hidden");
      fmShow.classList.add("hidden");
      fmAdd.classList.add("hidden");
      fmRemove.classList.remove("hidden");
      fmBlockView.disabled = false;
      fmLineItemView.disabled = false;
      fmHide.disabled = false;
      fmShow.disabled = false;
      fmClear.disabled = false;
      break;
    case "disabled":
      fileState.hasFrontmatter = false;
      fmContentBlock.value = "";
      fmContentBlock.classList.add("hidden");
      fmAdd.classList.remove("hidden");
      fmRemove.classList.add("hidden");
      fmBlockView.disabled = true;
      fmLineItemView.disabled = true;
      fmHide.disabled = true;
      fmShow.disabled = true;
      fmClear.disabled = true;
      break;
    case "hidden":
      fmContentBlock.classList.add("hidden");
      fmHide.classList.add("hidden");
      fmShow.classList.remove("hidden");
      break;
    case "visible":
      fmContentBlock.classList.remove("hidden");
      fmHide.classList.remove("hidden");
      fmShow.classList.add("hidden");
      break;
  }
}

// UTILITY FUNCTIONS

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
