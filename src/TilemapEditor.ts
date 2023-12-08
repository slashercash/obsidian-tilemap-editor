import type { TilemapMetadata } from 'TilemapEditorView'
import { addDragEvents } from 'events/dragEvents'

export class TilemapEditor {
  private readonly tilemapEditor: HTMLElement
  private readonly toolbar: HTMLElement
  private readonly renderer: HTMLElement
  private readonly space: HTMLElement

  constructor(tilemap: Element, metadata: TilemapMetadata) {
    this.tilemapEditor = createElement('div', 'tilemap-editor')

    this.toolbar = createToolbar()

    this.renderer = createElement('div', 'tilemap-renderer')
    addDragEvents(this.renderer)

    const styleElement = document.createElement('style')
    styleElement.innerText = `.view-content-tilemap-editor .tilemap-cell { width:${30}px;height:${30}px; }`

    const styleElement2 = document.createElement('style')
    styleElement2.innerText = metadata.customTiles
      .map((tile) => {
        const className = `.view-content-tilemap-editor .custom-tile-${tile.id}`
        const borderRadius = tile.shape == 'circle' ? '\n  border-radius: 50%;' : ''
        return `${className} {
background-color: ${tile.color};
box-shadow: inset 0 0 0 1px black;${borderRadius}
}`
      })
      .join('\n')

    this.space = document.createElement('div')
    this.space.style.position = 'relative'
    const obs = new ResizeObserver(([entry]) => {
      if (!entry) return
      const rendererRect = entry.contentRect
      const tilesCountHorizontal = tilemap.children[0]?.children.length ?? 0
      const tilesCountVertical = tilemap.children.length
      const tileSize = 30
      const [width, height] = spaceStyle(rendererRect, tilesCountHorizontal, tilesCountVertical, tileSize)
      this.space.style.width = width + 'px'
      this.space.style.height = height + 'px'
    })
    obs.observe(this.renderer)
    this.space.appendChild(tilemap)
    this.renderer.appendChild(this.space)

    this.tilemapEditor.appendChild(this.toolbar)
    this.tilemapEditor.appendChild(this.renderer)
    this.tilemapEditor.appendChild(styleElement)
    this.tilemapEditor.appendChild(styleElement2)
  }

  public root() {
    return this.tilemapEditor
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

function spaceStyle(
  rendererRect: DOMRect,
  tilesCountHorizontal: number,
  tilesCountVertical: number,
  tileSize: number
): [number, number] {
  const horizontal = rendererRect.width / tileSize
  const vertical = rendererRect.height / tileSize

  const overflowHorizontal = (horizontal % 1) * tileSize
  const overflowVertical = (vertical % 1) * tileSize

  const width = (Math.floor(horizontal) * 2 + tilesCountHorizontal) * tileSize
  const height = (Math.floor(vertical) * 2 + tilesCountVertical) * tileSize

  const w = width - 2 * (tileSize - overflowHorizontal)
  const h = height - 2 * (tileSize - overflowVertical)

  return [w, h]
}

function createElement(tagName: keyof HTMLElementTagNameMap, className: string): HTMLElement {
  const element = document.createElement(tagName)
  element.className = className
  return element
}
