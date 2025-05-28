function MainMenu() {
  return (
    <>
      <div className="relative">
        <button
          id="newFile"
          className="bg-linear-to-br cursor-pointer border-l border-t border-yellow-500/80 from-yellow-900/20 to-transparent px-6 py-1.5 transition-all duration-150 ease-in-out hover:bg-yellow-500/10 active:scale-90"
        >
          New +
        </button>
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
      <button
        id="openFile"
        className="bg-linear-to-br block cursor-pointer border-l border-t border-blue-500/80 from-blue-900/40 to-transparent px-6 py-1.5 transition-all duration-150 ease-in-out hover:bg-blue-500/10 active:scale-90"
      >
        Open
      </button>
      <div className="relative">
        <button
          id="openRecent"
          className="bg-linear-to-br block cursor-pointer border-l border-t border-violet-500/80 from-violet-900/20 to-transparent px-6 py-1.5 transition-all duration-150 ease-in-out hover:bg-violet-500/10 active:scale-90"
        >
          Recent +
        </button>
        <div
          id="recentFilesMenu"
          className="w-lg absolute left-0 top-10 z-10 hidden border border-violet-500/80"
        ></div>
      </div>
      <button
        id="saveAs"
        className="bg-linear-to-br to-transparen cursor-pointer border-l border-t border-lime-500 from-lime-900/40 px-6 py-1.5 transition-all duration-150 ease-in-out hover:bg-lime-500/10 active:scale-90"
      >
        Save As
      </button>
      <button
        id="saveFile"
        className="bg-linear-to-br not-disabled:hover:bg-emerald-500/10 cursor-pointer border-x border-t border-emerald-500 from-emerald-900/40 to-transparent px-6 py-1.5 transition-all duration-150 ease-in-out active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Save
      </button>
      <div className="relative ml-auto pr-2">
        <button
          id="clearAll"
          className="bg-linear-to-br cursor-pointer border-x border-t border-red-500 from-red-900/40 to-transparent px-6 py-1.5 transition-all duration-150 ease-in-out hover:bg-red-500/10 active:scale-90"
        >
          Clear All +
        </button>
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
