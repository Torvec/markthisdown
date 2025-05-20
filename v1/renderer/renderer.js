// Buttons
const dashboardBtn = getById("dashboardBtn");
const editorBtn = getById("editorBtn");
const newFileBtn = getById("newFileBtn");
const editFileBtn = getById("editFileBtn");
const saveFileBtn = getById("saveFileBtn");
const clearEditorBtn = getById("clearEditorBtn");

// Sections (aka pages)
const dashboard = getById("dashboard");
const editor = getById("editor");

const renderFilename = getById("filenameHeader");
const renderFrontmatter = getById("fmEditor");
const renderBody = getById("mdEditor");

let filename = "untitled.md";
let frontmatter = "---\n\n---\n";
let body = "Content";

// Events
dashboardBtn.addEventListener("click", () => showView("dashboard"));

editorBtn.addEventListener("click", () => showView("editor"));

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
