import Button from "./button";

function MainMenu() {
  const handleNewFileTrigger = () => {
    console.log("Handled New File Trigger");
    // Opens a drop down menu
  };

  const handleOpenFileTrigger = () => {
    console.log("Handled Open File Trigger");
    // Opens the open file dialog
  };

  const handleOpenRecentTrigger = () => {
    console.log("Handled Open Recent Trigger");
    // Opens a drop down menu
  };

  const handleSaveAsTrigger = () => {
    console.log("Handled Save As Trigger");
    // Opens the save file dialog
  };

  const handleSaveTrigger = () => {
    console.log("Handled Save Trigger");
    // Opens the save file dialog if file has not been saved once, other wise saves file
  };

  const handleClearAllTrigger = () => {
    console.log("Handled Clear All Trigger");
    // Opens a drop down menu
  };

  return (
    <>
      <div className="relative">
        <Button
          twc="border-yellow-500/80 from-yellow-900/20 to-transparent hover:bg-yellow-500/10"
          onClick={handleNewFileTrigger}
        >
          New +
        </Button>
        <div
          id="newFileOptions"
          className="absolute left-0 top-10 z-10 hidden min-w-max border border-yellow-500/80 bg-black"
        >
          <button
            id="newFileWithFm"
            className="w-full cursor-pointer px-6 py-2 transition-colors duration-150 ease-in-out hover:bg-neutral-900"
          >
            With Frontmatter
          </button>
          <button
            id="newFileNoFm"
            className="w-full cursor-pointer px-6 py-2 transition-colors duration-150 ease-in-out hover:bg-neutral-900"
          >
            No Frontmatter
          </button>
        </div>
      </div>
      <Button
        twc="border-blue-500/80 from-blue-900/40 to-transparent hover:bg-blue-500/10"
        onClick={handleOpenFileTrigger}
      >
        Open
      </Button>
      <div className="relative">
        <Button
          twc="border-violet-500/80 from-violet-900/20 to-transparent hover:bg-violet-500/10"
          onClick={handleOpenRecentTrigger}
        >
          Recent +
        </Button>
        <div
          id="recentFilesMenu"
          className="w-lg absolute left-0 top-10 z-10 hidden border border-violet-500/80"
        >
          {/* Recent Files List Goes Here */}
        </div>
      </div>
      <Button
        twc="border-lime-500 from-lime-900/40 to-transparent hover:bg-lime-500/10"
        onClick={handleSaveAsTrigger}
      >
        Save As
      </Button>
      <Button
        twc="not-disabled:hover:bg-emerald-500/10 border-emerald-500 border-r from-emerald-900/40 to-transparent"
        onClick={handleSaveTrigger}
      >
        Save
      </Button>
      <div className="relative ml-auto pr-2">
        <Button
          twc="border-red-500 from-red-900/40 to-transparent hover:bg-red-500/10"
          onClick={handleClearAllTrigger}
        >
          Clear All +
        </Button>
        <div
          id="clearAllMenu"
          className="absolute right-0 top-10 z-10 hidden min-w-max border border-red-500/80 bg-black"
        >
          <button
            id="confirmClearAll"
            className="w-full cursor-pointer px-6 py-2 transition-colors duration-150 ease-in-out hover:bg-neutral-900"
          >
            Confirm
          </button>
          <button
            id="cancelClearAll"
            className="w-full cursor-pointer px-6 py-2 transition-colors duration-150 ease-in-out hover:bg-neutral-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default MainMenu;
