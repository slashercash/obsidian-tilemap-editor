export class Toolbar {
  private readonly toolbar: HTMLDivElement

  constructor() {
    this.toolbar = document.createElement('div')
    this.toolbar.className = 'tilemap-toolbar-overlay'
    this.toolbar.hide()

    const toolbarButtonContainer = document.createElement('div')
    toolbarButtonContainer.className = 'tilemap-toolbar-button-container'

    const toolbarButton = document.createElement('button')
    toolbarButton.className = 'tilemap-toolbar-button'
    toolbarButton.innerText = 'Button'

    toolbarButtonContainer.appendChild(toolbarButton)
    this.toolbar.appendChild(toolbarButtonContainer)
  }

  public asChildOf(parentElement: HTMLElement) {
    parentElement.appendChild(this.toolbar)
  }

  public show() {
    this.toolbar.show()
  }

  public hide() {
    this.toolbar.hide()
  }
}
