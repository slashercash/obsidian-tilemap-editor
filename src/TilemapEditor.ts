import type { TilemapMetadata } from 'TilemapEditorView'
import { SpaceWrapper } from 'components/SpaceWrapper'
import { addDragEvents } from 'events/dragEvents'

export class TilemapEditor {
  private readonly tilemapEditor: HTMLElement
  private readonly toolbar: HTMLElement
  private readonly renderer: HTMLElement

  constructor() {
    this.tilemapEditor = createElement('div', 'tilemap-editor')

    this.toolbar = createToolbar()

    this.renderer = createElement('div', 'tilemap-renderer')
    addDragEvents(this.renderer)

    const styleElement = document.createElement('style')
    styleElement.innerText = `.view-content-tilemap-editor .tilemap-cell { width:${30}px;height:${30}px; }`

    this.tilemapEditor.appendChild(this.toolbar)
    this.tilemapEditor.appendChild(this.renderer)
    this.tilemapEditor.appendChild(styleElement)
  }

  public asChildOf(parentElement: HTMLElement) {
    parentElement.appendChild(this.tilemapEditor)
  }

  public setData(tilemap: Element, metadata: TilemapMetadata) {
    const tileSize = 30

    const space = new SpaceWrapper(
      this.renderer,
      tilemap.children.length,
      tilemap.children[0]?.children.length ?? 0,
      tileSize
    )
    space.setData(tilemap, metadata)
  }

  public setEditmode(isEditMode: boolean) {
    isEditMode ? this.toolbar.show() : this.toolbar.hide()
  }
}

function createToolbar(): HTMLElement {
  const toolbar = createElement('div', 'tilemap-toolbar-overlay')
  toolbar.hide()
  const toolbarButtonContainer = createElement('div', 'tilemap-toolbar-button-container')
  const toolbarButton = createElement('button', 'tilemap-toolbar-button')
  toolbarButton.innerText = 'Button'
  toolbarButtonContainer.appendChild(toolbarButton)
  toolbar.appendChild(toolbarButtonContainer)
  return toolbar
}

function createElement(tagName: keyof HTMLElementTagNameMap, className: string): HTMLElement {
  const element = document.createElement(tagName)
  element.className = className
  return element
}
