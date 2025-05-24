// Controls
const newFileBtn = document.getElementById("newFileBtn");
const openFileBtn = document.getElementById("openFileBtn");
const saveAsFileBtn = document.getElementById("saveAsFileBtn");
const saveFileBtn = document.getElementById("saveFileBtn");
const clearEditorBtn = document.getElementById("clearEditorBtn");
const fmToggle = document.getElementById("fmToggle");

// Views
const dashboard = document.getElementById("dashboard");
const editor = document.getElementById("editor");

const recentFiles = document.getElementById("recentFiles");

const filenameHdr = document.getElementById("filenameHdr");
const currentFilepath = document.getElementById("filepath");
const frontmatterContent = document.getElementById("frontmatterContent");
const bodyContent = document.getElementById("bodyContent");

newFileBtn.addEventListener("click", () => {
  setEditorFields({
    filename: "untitled.md",
    frontmatter: "---\nkey: value\n---\n",
    body: "Content Goes Here",
    saved: false,
  });
  showView("editor");
});

fmToggle.addEventListener("change", () => {
  if (fmToggle.checked) {
    console.log("checked");
  } else {
    console.log("unchecked");
  }
});

openFileBtn.addEventListener("click", async () => {
  const openFileDialog = await fileAPI.openFileDialog();
  if (openFileDialog !== undefined) {
    setEditorFields(openFileDialog);
    showView("editor");
  }
});

recentFiles.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-filepath]");
  if (!button) return;
  const filepath = button.dataset.filepath;
  const openFile = await fileAPI.openRecentFile(filepath);
  setEditorFields(openFile);
  showView("editor");
});

saveAsFileBtn.addEventListener("click", async () => {
  const filepath =
    currentFilepath.innerText !== "undefined" ? currentFilepath.innerText : "untitled.md";
  const content = saveEditorContent();
  const saveFileDialog = await fileAPI.saveFileDialog(filepath, content);
  if (saveFileDialog !== undefined) {
    setEditorFields(saveFileDialog);
    showView("editor");
  }
});

saveFileBtn.addEventListener("click", async () => {
  const filepath = currentFilepath.innerText;
  const content = saveEditorContent();
  const savedFile = await fileAPI.saveFile(filepath, content);
  setEditorFields(savedFile);
  showView("editor");
});

//! TODO: Implement functionality
clearEditorBtn.addEventListener("click", async () => {
  console.log("Clear Editor Button Clicked");
});

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
    recentFiles.innerHTML = `<p class="text-center text-neutral-500 italic">${message}</p>`;
  }
  fileList.forEach(({ filename, filepath }) => {
    recentFiles.innerHTML += `<button data-filepath="${filepath}" class="block w-full text-left cursor-pointer space-x-3 p-3 bg-neutral-900 overflow-hidden text-ellipsis hover:bg-neutral-500/10 active:scale-90 transition-all duration-150 ease-in-out">
    <span class="font-medium">${filename}</span>
    <span class="text-neutral-400">${filepath}</span>
  </button>`;
  });
  return fileList;
}

function showView(viewId) {
  const views = ["dashboard", "editor"];
  views.forEach((id) => {
    const el = document.getElementById(id);
    if (id === viewId) {
      el.classList.remove("hidden");
      el.classList.add("block");
    } else {
      el.classList.remove("block");
      el.classList.add("hidden");
    }
  });
}

renderRecentFilesList();

/*
🔳 Need a save as and save button next to each other and both will bring up the save dialog if the file hasn't been saved/titled at least once, after that save will just save over the file, but only if anything changed
*/
