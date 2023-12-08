import type { TilemapMetadata } from 'TilemapEditorView'
import { Renderer } from 'components/Renderer'
import { SpaceWrapper } from 'components/SpaceWrapper'

export class TilemapEditor {
  private readonly tilemapEditor: HTMLElement
  private readonly toolbar: HTMLElement
  private readonly renderer = new Renderer()

  constructor() {
    this.tilemapEditor = createElement('div', 'tilemap-editor')

    this.toolbar = createToolbar()

    this.tilemapEditor.appendChild(this.toolbar)

    this.renderer.asChildOf(this.tilemapEditor)
  }

  public asChildOf(parentElement: HTMLElement) {
    parentElement.appendChild(this.tilemapEditor)
  }

  public setData(tilemap: Element, metadata: TilemapMetadata) {
    const tileSize = 30

    const space = new SpaceWrapper(
      this.renderer.renderer,
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
