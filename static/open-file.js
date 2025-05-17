document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("theFile").addEventListener("change", () => {
    document.getElementById("fileForm").submit();
  });
});
