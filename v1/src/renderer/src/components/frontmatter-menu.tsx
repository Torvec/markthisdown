function FrontmatterMenu() {
  return (
    <div className="flex gap-0.5">
      <h3 className="bg-neutral-500 px-2 py-1 font-mono uppercase text-neutral-900">Frontmatter</h3>
      <button
        id="fmBlockView"
        className="not-disabled:hover:bg-neutral-500 not-disabled:hover:text-neutral-50 cursor-pointer bg-neutral-600 px-4 py-1 text-neutral-300 transition-colors duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
      >
        Block View
      </button>
      <button
        id="fmLineItemView"
        className="not-disabled:hover:bg-neutral-500 not-disabled:hover:text-neutral-50 cursor-pointer bg-neutral-600 px-4 py-1 text-neutral-300 transition-colors duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
      >
        Line Item View
      </button>
      <div className="ml-auto flex gap-0.5">
        <button
          id="fmHide"
          className="not-disabled:hover:bg-neutral-500 not-disabled:hover:text-neutral-50 cursor-pointer bg-neutral-600 px-4 py-1 text-neutral-300 transition-colors duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hide
        </button>
        <button
          id="fmShow"
          className="not-disabled:hover:bg-neutral-500 not-disabled:hover:text-neutral-50 hidden cursor-pointer bg-neutral-600 px-4 py-1 text-neutral-300 transition-colors duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
        >
          Show
        </button>
        <div className="relative">
          <button
            id="fmClear"
            className="not-disabled:hover:bg-neutral-500 not-disabled:hover:text-neutral-50 cursor-pointer bg-neutral-600 px-4 py-1 text-neutral-300 transition-colors duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear +
          </button>
          <div
            id="fmClearMenu"
            className="absolute left-0 top-10 z-10 hidden min-w-max border border-neutral-500 bg-black"
          >
            <button
              id="fmConfirmClear"
              className="block w-full cursor-pointer px-6 py-2 transition-colors duration-150 ease-in-out hover:bg-neutral-900"
            >
              Confirm
            </button>
            <button
              id="fmCancelClear"
              className="block w-full cursor-pointer px-6 py-2 transition-colors duration-150 ease-in-out hover:bg-neutral-900"
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="relative">
          <button
            id="fmRemove"
            className="cursor-pointer bg-pink-200 px-4 py-1 text-red-600 transition-colors duration-150 ease-in-out hover:bg-pink-100 hover:text-red-500"
          >
            Remove +
          </button>
          <div
            id="fmRemoveMenu"
            className="absolute left-0 top-10 z-10 hidden min-w-max border border-red-500 bg-black"
          >
            <button
              id="fmConfirmRemove"
              className="block w-full cursor-pointer px-6 py-2 transition-colors duration-150 ease-in-out hover:bg-neutral-900"
            >
              Confirm
            </button>
            <button
              id="fmCancelRemove"
              className="block w-full cursor-pointer px-6 py-2 transition-colors duration-150 ease-in-out hover:bg-neutral-900"
            >
              Cancel
            </button>
          </div>
        </div>
        <button
          id="fmAdd"
          className="ml-auto hidden cursor-pointer bg-pink-200 px-4 py-1 text-red-600 transition-colors duration-150 ease-in-out hover:bg-pink-100 hover:text-red-500"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default FrontmatterMenu;
