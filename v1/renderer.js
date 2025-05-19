// const information = document.getElementById("info");
// information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

// const func = async () => {
//   const response = await window.versions.ping();
//   console.log(response); // prints out whatever is in ipcMain.handle in main.js
// };

// func();

// Testing localStorage and counter state
// const lsKey = "number";
// let number = Number(localStorage.getItem(lsKey)) || 0;
// const numEl = document.getElementById("num");
// numEl.innerText = number;

// const incNumBtn = document.getElementById("inc");
// const decNumBtn = document.getElementById("dec");
// const saveNumBtn = document.getElementById("saver");
// const clearNumBtn = document.getElementById("clear");

// const updateNumber = (newNumber) => {
//   number = newNumber;
//   numEl.innerText = number;
// };

// incNumBtn.addEventListener("click", () => updateNumber(number + 1));
// decNumBtn.addEventListener("click", () => updateNumber(number - 1));
// saveNumBtn.addEventListener("click", () => localStorage.setItem(lsKey, number));
// clearNumBtn.addEventListener("click", () => {
//     localStorage.setItem(lsKey, 0);
//     updateNumber(0)
// });

// Buttons
const dashboardBtn = getById("dashboardBtn");
const editorBtn = getById("editorBtn");
const aboutBtn = getById("aboutBtn");
const settingsBtn = getById("settingsBtn");
const newFileBtn = getById("newFileBtn");
const editFileBtn = getById("editFileBtn");

// Sections (aka pages)
const dashboard = getById("dashboard");
const editor = getById("editor");
const about = getById("about");
const settings = getById("settings");

// Events
dashboardBtn.addEventListener("click", () => showView("dashboard"));
editorBtn.addEventListener("click", () => showView("editor"));
aboutBtn.addEventListener("click", () => showView("about"));
settingsBtn.addEventListener("click", () => showView("settings"));
newFileBtn.addEventListener("click", () => showView("editor"));
editFileBtn.addEventListener("click", () => showView("editor"));

function showView(viewId) {
  const views = ["dashboard", "editor", "about", "settings"];
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
