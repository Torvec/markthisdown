document.addEventListener("DOMContentLoaded", () => {
  const storageKey = "markthisdown_key";
  const savedData = localStorage.getItem(storageKey);

  // Initialize the editor
  const editor = new toastui.Editor({
    el: document.querySelector("#editor"),
    height: "500px",
    initialEditType: "markdown",
    previewStyle: "vertical",
    initialValue: initialMarkdown || "",
  });
  editor.getMarkdown();

  // Get saved data from local storage if there is any
  // !savedData
  //   ? editor.setMarkdown("")
  //   : editor.setMarkdown(JSON.parse(savedData));

  // Intercept form submission to trigger file download instead
  document.getElementById("saveForm").addEventListener("submit", (event) => {
    event.preventDefault();
    // Create a Blob from the editor's markdown content
    const blobURL = URL.createObjectURL(
      new Blob([editor.getMarkdown()], { type: "text/markdown" })
    );
    // Create a temporary <a> element to simulate a download link
    const anchorEl = document.createElement("a");
    // Set the href to the Blob URL
    anchorEl.href = blobURL;
    // Set the download attribute to prompt file saving with a default filename
    anchorEl.download = "test.md";
    // Simulate a click to trigger the browser's Save As dialog
    anchorEl.click();
    // Revoke the Blob URL to free memory
    URL.revokeObjectURL(blobURL);
  });
});
