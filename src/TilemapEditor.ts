import type { TilemapMetadataCustomTile } from 'file/FileParser'
import { addDragEvents } from 'events/dragEvents'
import { addZoomEvents } from 'events/zoomEvents'
import ClickAction from 'clickActions/clickAction'

export class TilemapEditor {
  private readonly tilemapEditor: HTMLElement
  private readonly toolbar: HTMLElement
  private readonly renderer: HTMLElement
  private readonly space: HTMLElement

  private tileSize = 30
  private readonly zoomStyle = document.createElement('style')
  private readonly tilemap: Element

  constructor(tilemap: Element, customTiles: ReadonlyArray<TilemapMetadataCustomTile>) {
    this.tilemap = tilemap

    this.tilemapEditor = createElement('div', 'tilemap-editor')

    this.toolbar = this.createToolbar(customTiles)

    this.renderer = createElement('div', 'tilemap-renderer')
    addDragEvents(this.renderer, () => console.log('---'))
    addZoomEvents(this.renderer, this.updateTileSize)

    const tileStyle = document.createElement('style')
    tileStyle.innerText = customTiles
      .map((tile) => {
        const className = `.view-content-tilemap-editor .custom-tile-${tile.id}`
        const borderRadius = tile.shape == 'circle' ? '\n  border-radius: 50%;' : ''
        return `${className} {
background-color: ${tile.color};
box-shadow: inset 0 0 0 1px black;${borderRadius}
}`
      })
      .join('\n')

    this.space = createElement('div', 'tilemap-space')
    const obs = new ResizeObserver(([entry]) => entry && this.updateZoomStyle(entry.contentRect))
    obs.observe(this.renderer)
    this.space.appendChild(tilemap)
    this.renderer.appendChild(this.space)

    this.tilemapEditor.appendChild(this.toolbar)
    this.tilemapEditor.appendChild(this.renderer)
    this.tilemapEditor.appendChild(this.zoomStyle)
    this.tilemapEditor.appendChild(tileStyle)
  }

  public root() {
    return this.tilemapEditor
  }

  public setEditmode(isEditMode: boolean) {
    isEditMode ? this.toolbar.show() : this.toolbar.hide()
  }

  private createToolbar(customTiles: ReadonlyArray<TilemapMetadataCustomTile>): HTMLElement {
    const toolbar = createElement('div', 'tilemap-toolbar-overlay')
    toolbar.hide()
    const toolbarButtonContainer = createElement('div', 'tilemap-toolbar-button-container')
    const toolbarButtons = this.createToolbarButtons(customTiles)
    toolbarButtonContainer.append(...toolbarButtons)
    toolbar.appendChild(toolbarButtonContainer)
    return toolbar
  }

  private createToolbarButtons(customTiles: ReadonlyArray<TilemapMetadataCustomTile>): ReadonlyArray<HTMLElement> {
    const buttons = customTiles
      .map(({ id }) => `custom-tile-${id}`)
      .map((className) => {
        const button = createElement('button', 'tilemap-toolbar-button')
        button.appendChild(createElement('div', className))
        return button
      })

    buttons.forEach(
      (button) =>
        (button.onclick = () => {
          buttons.forEach((b) => (b.className = 'tilemap-toolbar-button'))
          button.addClass('tilemap-toolbar-button--selected')
          // TODO: Optimize this
          addDragEvents(this.renderer, (e) => {
            const tileSize = this.tileSize
            const horizontal = this.renderer.getBoundingClientRect().width / tileSize
            const vertical = this.renderer.getBoundingClientRect().height / tileSize
            const overflowHorizontal = (horizontal % 1) * tileSize
            const overflowVertical = (vertical % 1) * tileSize
            const overflowHorizontalInverted = tileSize - overflowHorizontal
            const overflowVerticalInverted = tileSize - overflowVertical
            const spaceTilesCountHorizontal = Math.floor(horizontal)
            const spaceTilesCountVertical = Math.floor(vertical)

            const boundingClientRect = this.renderer.getBoundingClientRect()
            const spaceTileX = Math.floor(
              (e.clientX - boundingClientRect.left + overflowHorizontalInverted + this.renderer.scrollLeft) / tileSize
            )
            const spaceTileY = Math.floor(
              (e.clientY - boundingClientRect.top + overflowVerticalInverted + this.renderer.scrollTop) / tileSize
            )
            const offsetX = spaceTileX - spaceTilesCountHorizontal
            const offsetY = spaceTileY - spaceTilesCountVertical
            const [rowKey, cellKey] = ClickAction.prepareTilemap(
              this.tilemap,
              this.renderer,
              offsetX,
              offsetY,
              tileSize
            )
            ClickAction.setElement(this.tilemap, button.firstElementChild?.className ?? '', rowKey, cellKey)
            // TODO: only needed if tilemap was expanded
            this.updateZoomStyle(this.renderer.getBoundingClientRect())
          })
        })
    )
    return buttons
  }

  private updateTileSize(tileSize: number) {
    this.tileSize = tileSize
    this.updateZoomStyle(this.renderer.getBoundingClientRect())
  }

  private updateZoomStyle(rendererRect: DOMRect) {
    const tilesCountHorizontal = this.tilemap.children[0]?.children.length ?? 0
    const tilesCountVertical = this.tilemap.children.length
    const [width, height] = spaceStyle(rendererRect, tilesCountHorizontal, tilesCountVertical, this.tileSize)
    this.zoomStyle.innerText = `.view-content-tilemap-editor .tilemap-cell { width:${this.tileSize}px;height:${this.tileSize}px; }
.view-content-tilemap-editor .tilemap-space { width:${width}px;height:${height}px; }`
  }
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
