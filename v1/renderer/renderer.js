// Buttons
const dashboardBtn = getById("dashboardBtn");
const editorBtn = getById("editorBtn");
const settingsBtn = getById("settingsBtn");
const newFileBtn = getById("newFileBtn");
const editFileBtn = getById("editFileBtn");
const saveFileBtn = getById("saveFileBtn");
const clearEditorBtn = getById("clearEditorBtn");

// Sections (aka pages)
const dashboard = getById("dashboard");
const editor = getById("editor");
const settings = getById("settings");

// Events
dashboardBtn.addEventListener("click", () => showView("dashboard"));
editorBtn.addEventListener("click", () => showView("editor"));
settingsBtn.addEventListener("click", () => showView("settings"));
newFileBtn.addEventListener("click", () => showView("editor"));
editFileBtn.addEventListener("click", () => showView("editor"));

function showView(viewId) {
  const views = ["dashboard", "editor", "settings"];
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

function getById(id) {
  return document.getElementById(id);
}
