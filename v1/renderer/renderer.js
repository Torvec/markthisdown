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

const displayFilename = getById("filenameHeader");
const displayContent = getById("mdEditor");

let filename = "untitled.md";
let fileContent = "Content";

// Events
dashboardBtn.addEventListener("click", () => showView("dashboard"));

editorBtn.addEventListener("click", () => showView("editor"));

newFileBtn.addEventListener("click", async () => {
  const saveFileDialog = await fileAPI.saveFileDialog();
  if (saveFileDialog !== undefined) {
    filename = saveFileDialog.name;
    fileContent = saveFileDialog.content;
    displayFilename.innerText = filename;
    displayContent.value = fileContent;
    showView("editor");
  }
});

editFileBtn.addEventListener("click", async () => {
  const openFileDialog = await fileAPI.openFileDialog();
  if (openFileDialog !== undefined) {
    filename = openFileDialog.name;
    fileContent = openFileDialog.content;
    displayFilename.innerText = filename;
    displayContent.value = fileContent;
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
