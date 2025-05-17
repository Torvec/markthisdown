document.addEventListener("DOMContentLoaded", () => {
    // Use the URL search params to set the file name being editted
    const params = new URLSearchParams(document.location.search)
    const fileNameParam = params.get("fileName")
    const fileNameEl = document.getElementById("fileName")
    fileNameEl.textContent = fileNameParam
  
    const storageKey = "markthisdown_key";
  
  let savedData = localStorage.getItem(storageKey);

  // Initialize the editor
  const editor = new toastui.Editor({
    el: document.querySelector("#editor"),
    height: "500px",
    initialEditType: "markdown",
    previewStyle: "vertical",
  });
  editor.getMarkdown();

  // Get saved data from local storage if there is any
  !savedData
    ? editor.setMarkdown("")
    : editor.setMarkdown(JSON.parse(savedData));

  // Save markdown content from editor into local storage for persistance
  document.getElementById("theForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const markdown = editor.getMarkdown();
    localStorage.setItem(storageKey, JSON.stringify(markdown));
  });

  // Clear the editor on pressing reset
  document.getElementById("theForm").addEventListener("reset", () => {
    editor.setMarkdown("");
    localStorage.setItem(storageKey, "");
  });
});
