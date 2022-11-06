import { ItemView, WorkspaceLeaf } from 'obsidian'
import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'

export const VIEW_TYPE_EXAMPLE = 'example-view'

export class ExampleView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE
  }

  getDisplayText() {
    return 'Example view'
  }

  async onOpen() {
    createRoot(this.containerEl.children[1]).render(<View />)
  }

  async onClose() {
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1])
  }
}

const View = () => <h4>ExampleView</h4>
