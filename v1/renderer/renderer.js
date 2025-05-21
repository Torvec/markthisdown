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

// Events
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

async function renderRecentlyOpened() {
  // if length === 0 render some text saying no recent files found
  // otherwise, loop through the list and render each as a button that can
  // trigger an event to open the file, read it, and then render it in the editor
  const fileList = await fileAPI.getRecentFiles();
  const parsed = JSON.parse(fileList).map(
    ({ fileName, filePath }) =>
      (recentFiles.innerHTML += `<button class="cursor-pointer space-x-3 p-3 bg-neutral-900"><span class="font-medium">${fileName}:</span><span class="text-neutral-400">${filePath}</span></button>`)
  );
  return parsed;
}

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

renderRecentlyOpened();
