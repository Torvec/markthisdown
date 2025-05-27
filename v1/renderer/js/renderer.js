const initVal = {
  showNewFileMenu: false,
  showRecentMenu: false,
  saveEnabled: false,
  showClearAllMenu: false,
  fileInfo: {
    filename: "untitled.md",
    filepath: "untitled.md",
  },
  frontmatter: {
    isEnabled: true,
    view: "block",
    visible: true,
    showClearFmMenu: false,
    showRemoveFmMenu: false,
    content: "---\nkey: value\n---",
  },
  bodyContent: "content",
  fileState: {
    isSaved: false,
    isModified: false,
  },
};

//* Creates a deep copy of initVal (structure and values) and assigns it to editorState
const editorState = JSON.parse(JSON.stringify(initVal));

// UI ELEMENTS

const ui = {
  fileInfo: {
    filename: getById("filename"),
    filepath: getById("filepath"),
  },
  newFile: {
    button: getById("newFile"),
    menu: getById("newFileOptions"),
    options: {
      withFm: getById("newFileWithFm"),
      noFm: getById("newFileNoFm"),
    },
  },
  openFile: getById("openFile"),
  openRecent: {
    button: getById("openRecent"),
    menu: getById("recentFilesMenu"),
  },
  saveAs: getById("saveAs"),
  saveFile: getById("saveFile"),
  clearAll: {
    button: getById("clearAll"),
    menu: getById("clearAllMenu"),
    options: {
      confirm: getById("confirmClearAll"),
      cancel: getById("cancelClearAll"),
    },
  },
  fm: {
    view: {
      block: getById("fmBlockView"),
      lineItems: getById("fmLineItemView"),
    },
    visible: {
      hide: getById("fmHide"),
      show: getById("fmShow"),
    },
    clear: {
      button: getById("fmClear"),
      menu: getById("fmClearMenu"),
      options: {
        confirm: getById("fmConfirmClear"),
        cancel: getById("fmCancelClear"),
      },
    },
    remove: {
      button: getById("fmRemove"),
      menu: getById("fmRemoveMenu"),
      options: {
        confirm: getById("fmConfirmRemove"),
        cancel: getById("fmCancelRemove"),
      },
    },
    add: getById("fmAdd"),
    editor: getById("fmEditor"),
    content: {
      block: getById("fmContentBlock"),
      lineItems: getById("fmContentLineItems"),
    },
  },
  body: {
    content: getById("bodyContent"),
  },
};

// INITIAL LOAD

document.addEventListener("DOMContentLoaded", () => {
  resetEditorState();
  renderRecentFilesList();
});

// MENU BAR

onClick(ui.newFile.button, () => updateState({ showNewFileMenu: true }));
onClick(ui.newFile.options.withFm, () => resetEditorState());
onClick(ui.newFile.options.noFm, () => {
  resetEditorState();
  updateState({ frontmatter: { isEnabled: false } });
});
onClick(document, (event) => closeDropDownMenu(event, ui.newFile.menu, ui.newFile.button));
onClick(ui.openFile, async () => {
  const openFileDialog = await fileAPI.openFileDialog();
  if (openFileDialog !== undefined) {
    updateState({
      fileInfo: {
        filename: openFileDialog.filename,
        filepath: openFileDialog.filepath,
      },
      frontmatter: {
        isEnabled: openFileDialog.frontmatter !== "",
        content: openFileDialog.frontmatter,
      },
      bodyContent: openFileDialog.body,
      fileState: {
        isSaved: true,
        isModified: false,
      },
    });
    renderRecentFilesList();
  }
});
onClick(ui.openRecent.button, () => updateState({ showRecentMenu: true }));
onClick(ui.openRecent.menu, async (event) => {
  const button = event.target.closest("button[data-filepath]");
  if (!button) return;
  const openFile = await fileAPI.openRecentFile(button.dataset.filepath);
  updateState({
    showRecentMenu: false,
    fileInfo: {
      filename: openFile.filename,
      filepath: openFile.filepath,
    },
    frontmatter: {
      isEnabled: openFile.frontmatter !== "",
      content: openFile.frontmatter,
    },
    bodyContent: openFile.body,
    fileState: {
      isSaved: true,
      isModified: false,
    },
  });
  renderRecentFilesList();
});
onClick(document, (event) => closeDropDownMenu(event, ui.openRecent.menu, ui.openRecent.button));
onClick(ui.saveAs, async () => {
  const saveFileDialog = await fileAPI.saveFileDialog(
    editorState.fileInfo.filepath,
    combineEditorContent(),
  );
  if (saveFileDialog !== undefined) {
    updateState({
      fileInfo: {
        filename: saveFileDialog.filename,
        filepath: saveFileDialog.filepath,
      },
      frontmatter: {
        isEnabled: saveFileDialog.frontmatter !== "",
        content: saveFileDialog.frontmatter,
      },
      bodyContent: saveFileDialog.body,
      fileState: {
        isSaved: true,
        isModified: false,
      },
    });
    renderRecentFilesList();
  }
});
onClick(ui.saveFile, async () => {
  let savedFile = editorState.isSaved
    ? await fileAPI.saveFile(editorState.fileInfo.filepath, combineEditorContent())
    : await fileAPI.saveFileDialog(editorState.fileInfo.filepath, combineEditorContent());
  updateState({
    fileInfo: {
      filename: savedFile.filename,
      filepath: savedFile.filepath,
    },
    frontmatter: {
      isEnabled: savedFile.frontmatter !== "",
      content: savedFile.frontmatter,
    },
    bodyContent: savedFile.body,
    fileState: {
      isSaved: true,
      isModified: false,
    },
  });
});
onClick(ui.clearAll.button, () => updateState({ showClearAllMenu: true }));
onClick(ui.clearAll.options.confirm, () => {
  updateState({
    showClearAllMenu: false,
    frontmatter: {
      content: initVal.frontmatter.content,
    },
    bodyContent: initVal.bodyContent,
    fileState: {
      isModified: true,
    },
  });
});
onClick(ui.clearAll.options.cancel, () => updateState({ showClearAllMenu: false }));
onClick(document, (event) => closeDropDownMenu(event, ui.clearAll.menu, ui.clearAll.button));

// FRONTMATTER
onClick(ui.fm.view.block, () => updateState({ frontmatter: { view: "block" } }));
onClick(ui.fm.view.lineItems, () => updateState({ frontmatter: { view: "lineItems" } }));
onClick(ui.fm.visible.hide, () => updateState({ frontmatter: { visible: false } }));
onClick(ui.fm.visible.show, () => updateState({ frontmatter: { visible: true } }));
onClick(ui.fm.clear.button, () => updateState({ frontmatter: { showClearFmMenu: true } }));
onClick(ui.fm.clear.options.confirm, () => {
  updateState({
    frontmatter: { content: initVal.frontmatter.content, showClearFmMenu: false },
    bodyContent: initVal.bodyContent,
  });
});
onClick(ui.fm.clear.options.cancel, () => updateState({ frontmatter: { showClearFmMenu: false } }));
onClick(document, (event) => closeDropDownMenu(event, ui.fm.clear.menu, ui.fm.clear.button));
onClick(ui.fm.remove.button, () => updateState({ frontmatter: { showRemoveFmMenu: true } }));
onClick(ui.fm.remove.options.confirm, () => {
  updateState({ frontmatter: { isEnabled: false, showRemoveFmMenu: false } });
});
onClick(ui.fm.remove.options.cancel, () =>
  updateState({ frontmatter: { showRemoveFmMenu: false } }),
);
onClick(document, (event) => closeDropDownMenu(event, ui.fm.remove.menu, ui.fm.remove.button));
onClick(ui.fm.add, () => {
  updateState({ frontmatter: { isEnabled: true } });
});

//* FUNCTIONS

// !This does not update the ui based off of state like everything else does
async function renderRecentFilesList() {
  const fileList = await fileAPI.getRecentFiles();
  if (fileList.length === 0) {
    const message = "Recent Files List Empty";
    ui.openRecent.menu.innerHTML = noRecentFilesP(message);
    return fileList;
  }
  let buttons = "";
  fileList.forEach((file) => {
    buttons += recentFileButton(file.filename, file.filepath);
  });
  ui.openRecent.menu.innerHTML = buttons;
  return fileList;
}

const noRecentFilesP = (message) => {
  return `<p class="text-center text-neutral-500 italic">${message}</p>`;
};

const recentFileButton = (filename, filepath) => {
  return `<button data-filepath="${filepath}" class="flex w-full overflow-hidden cursor-pointer space-x-3 p-3 bg-neutral-900 hover:bg-neutral-600 transition-colors duration-150 ease-in-out">
    <span class="font-medium shrink-0">${filename}</span>
    <span class="text-neutral-400 min-w-max">${filepath}</span>
  </button>`;
};

// ! TODO
function renderFmLineItems(state) {
  return;
}

//* UTILITY FUNCTIONS
function updateState(updates) {
  for (const key in updates) {
    if (typeof updates[key] === "object") {
      Object.assign(editorState[key], updates[key]);
    } else {
      editorState[key] = updates[key];
    }
  }
  syncUI();
}

function resetEditorState() {
  Object.assign(editorState, JSON.parse(JSON.stringify(initVal)));
  syncUI();
}

function syncUI() {
  // MENU BAR
  toggleVisibility(ui.newFile.menu, editorState.showNewFileMenu);
  toggleVisibility(ui.openRecent.menu, editorState.showRecentMenu);
  ui.saveFile.disabled = !editorState.saveEnabled;
  toggleVisibility(ui.clearAll.menu, editorState.showClearAllMenu);

  // FILE INFO
  ui.fileInfo.filename.innerText = editorState.fileInfo.filename;
  ui.fileInfo.filepath.innerText = editorState.fileInfo.filepath;

  // FRONTMATTER MENU
  const disableFmBtns = !editorState.frontmatter.isEnabled;
  ui.fm.view.block.disabled = editorState.frontmatter.view === "block" || disableFmBtns;
  ui.fm.view.lineItems.disabled = editorState.frontmatter.view === "lineItems" || disableFmBtns;
  toggleVisibility(ui.fm.visible.hide, editorState.frontmatter.visible);
  ui.fm.visible.hide.disabled = disableFmBtns;
  toggleVisibility(ui.fm.visible.show, !editorState.frontmatter.visible);
  ui.fm.visible.show.disabled = disableFmBtns;
  toggleVisibility(ui.fm.clear.menu, editorState.frontmatter.showClearFmMenu);
  ui.fm.clear.button.disabled = disableFmBtns;
  toggleVisibility(ui.fm.remove.button, editorState.frontmatter.isEnabled);
  toggleVisibility(ui.fm.remove.menu, editorState.frontmatter.showRemoveFmMenu);
  toggleVisibility(ui.fm.add, !editorState.frontmatter.isEnabled);

  // FRONTMATTER CONTENT
  toggleVisibility(ui.fm.editor, editorState.frontmatter.visible);
  toggleVisibility(ui.fm.content.block, editorState.frontmatter.view === "block");
  toggleVisibility(ui.fm.content.lineItems, editorState.frontmatter.view === "lineItems");
  ui.fm.content.block.value = editorState.frontmatter.content;
  ui.fm.content.lineItems.innerHTML = renderFmLineItems(editorState.frontmatter.content);

  // BODY CONTENT
  ui.body.content.value = editorState.bodyContent;
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

function toggleVisibility(element, show) {
  element.classList.toggle("hidden", !show);
}
