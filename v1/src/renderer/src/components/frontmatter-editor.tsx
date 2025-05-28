function FrontmatterEditor() {
    return (
        <div id="fmEditor">
          <textarea
            id="fmContentBlock"
            className="min-h-48 w-full resize-y border border-neutral-500 bg-neutral-800 p-4 outline-0 focus-visible:bg-neutral-700/75"
          >
          </textarea>
          <div id="fmContentLineItems" className="hidden grid-cols-2 gap-3">
            {/* <!-- Text Inputs Go Here --> */}
            <div className="flex gap-3">
              <input type="text" className="w-1/2" />
              <input type="text" className="w-1/2" />
            </div>
          </div>
        </div>
    )
}

export default FrontmatterEditor