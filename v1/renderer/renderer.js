// Controls
const dashboardBtn = getById("dashboardBtn");
const editorBtn = getById("editorBtn");
const newFileBtn = getById("newFileBtn");
const editFileBtn = getById("editFileBtn");
const saveFileBtn = getById("saveFileBtn");
const clearEditorBtn = getById("clearEditorBtn");
const fmToggle = getById("fmToggle");

// Views
const dashboard = getById("dashboard");
const editor = getById("editor");

// Data outputs
const recentFiles = getById("recentFiles");
const renderFilename = getById("filenameHeader");
const renderFrontmatter = getById("fmEditor");
const renderBody = getById("mdEditor");

let filename = "untitled.md";
let frontmatter = "---\n\n---\n";
let body = "Content";

// dashboardBtn.addEventListener("click", () => showView("dashboard"));
// editorBtn.addEventListener("click", () => showView("editor"));

newFileBtn.addEventListener("click", async () => {
  const saveFileDialog = await fileAPI.saveFileDialog();
  if (saveFileDialog !== undefined) {
    filename = saveFileDialog.name;
    frontmatter = saveFileDialog.frontmatter;
    body = saveFileDialog.body;
    renderFilename.innerText = filename;
    renderFrontmatter.value = frontmatter;
    renderBody.value = body;
    showView("editor");
  }
});

editFileBtn.addEventListener("click", async () => {
  const openFileDialog = await fileAPI.openFileDialog();
  if (openFileDialog !== undefined) {
    filename = openFileDialog.name;
    frontmatter = openFileDialog.frontmatter;
    body = openFileDialog.body;
    renderFilename.innerText = filename;
    renderFrontmatter.value = frontmatter;
    renderBody.value = body;
    showView("editor");
  }
});

fmToggle.addEventListener("change", () => {
  if (fmToggle.checked) {
    console.log("checked");
  } else {
    console.log("unchecked");
  }
});

function showView(viewId) {
  const views = ["dashboard", "editor"];
  views.forEach((id) => {
    const el = getById(id);
    if (id === viewId) {
      el.classList.remove("hidden");
      el.classList.add("block");
    } else {
      el.classList.remove("block");
      el.classList.add("hidden");
    }
  });
}

function getById(id) {
  return document.getElementById(id);
}

recentFiles.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-filepath]");
  if (!button) return;
  const filepath = button.dataset.filepath;
  const openFile = await fileAPI.openRecentFile(filepath);
  filename = openFile.name;
  frontmatter = openFile.frontmatter;
  body = openFile.body;
  renderFilename.innerText = filename;
  renderFrontmatter.value = frontmatter;
  renderBody.value = body;
  showView("editor");
});

async function renderRecentFilesList() {
  const fileList = await fileAPI.getRecentFiles();
  if (fileList.length === 0) {
    const paragraphEl = document.createElement("p");
    paragraphEl.classList.add("text-center", "text-neutral-500", "italic");
    paragraphEl.textContent = "Recent Files List Empty";
    recentFiles.appendChild(paragraphEl);
  }
  fileList.forEach(({ filename, filepath }) => {
    const buttonEl = document.createElement("button");
    buttonEl.classList.add(
      "block",
      "w-full",
      "text-left",
      "cursor-pointer",
      "space-x-3",
      "p-3",
      "bg-neutral-900",
      "overflow-hidden",
      "text-ellipsis",
      "hover:bg-neutral-500/10",
      "active:scale-90",
      "transition-all",
      "duration-150",
      "ease-in-out"
    );
    buttonEl.dataset.filepath = filepath;
    const spanFileNameEl = document.createElement("span");
    spanFileNameEl.classList.add("font-medium");
    spanFileNameEl.textContent = `${filename}`;
    const spanFilePathEl = document.createElement("span");
    spanFilePathEl.classList.add("text-neutral-400");
    spanFilePathEl.textContent = `${filepath}`;
    recentFiles.appendChild(buttonEl);
    buttonEl.appendChild(spanFileNameEl);
    buttonEl.appendChild(spanFilePathEl);
  });
  return fileList;
}

renderRecentFilesList();
