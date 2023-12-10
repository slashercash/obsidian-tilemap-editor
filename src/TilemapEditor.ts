import type { TilemapMetadataCustomTile } from 'file/FileParser'
import { addDragEvents } from 'events/dragEvents'
import { addZoomEvents } from 'events/zoomEvents'
import ClickAction from 'clickActions/clickAction'

export class TilemapEditor {
  public readonly root = createElement('div', 'tilemap-editor')
  private readonly renderer = createElement('div', 'tilemap-renderer')
  private readonly zoomStyle = document.createElement('style')
  private readonly tileStyle = document.createElement('style')
  private readonly toolbar = createElement('div', 'tilemap-toolbar-overlay')
  private readonly space = createElement('div', 'tilemap-space')

  private tileSize = 30

  private readonly tilemap: Element

  constructor(tilemap: Element, customTiles: ReadonlyArray<TilemapMetadataCustomTile>) {
    this.tilemap = tilemap
    this.toolbar.hide()

    this.space.appendChild(tilemap)
    this.renderer.appendChild(this.space)
    this.root.appendChild(this.toolbar)
    this.root.appendChild(this.renderer)
    this.root.appendChild(this.zoomStyle)
    this.root.appendChild(this.tileStyle)

    this.updateToolbar(customTiles)
    this.updateTileStyle(customTiles)

    // TODO: Remove events and observer
    addDragEvents(this.renderer, () => console.log('---'))
    addZoomEvents(this.renderer, (s) => this.updateTileSize(s))
    addResizeObserver(this.renderer, (r) => this.updateZoomStyle(r))
  }

  public setEditmode(isEditMode: boolean) {
    isEditMode ? this.toolbar.show() : this.toolbar.hide()
  }

  private updateToolbar(customTiles: ReadonlyArray<TilemapMetadataCustomTile>) {
    const toolbarButtonContainer = createElement('div', 'tilemap-toolbar-button-container')
    const toolbarButtons = this.createToolbarButtons(customTiles)
    toolbarButtonContainer.append(...toolbarButtons)
    this.toolbar.appendChild(toolbarButtonContainer)
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

  private updateTileStyle(customTiles: ReadonlyArray<TilemapMetadataCustomTile>) {
    this.tileStyle.innerText = customTiles
      .map((tile) => {
        const className = `.view-content-tilemap-editor .custom-tile-${tile.id}`
        const borderRadius = tile.shape == 'circle' ? '\n  border-radius: 50%;' : ''
        return `${className} {
background-color: ${tile.color};
box-shadow: inset 0 0 0 1px black;${borderRadius}
}`
      })
      .join('\n')
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

function addResizeObserver(renderer: HTMLElement, onResize: (rendererRect: DOMRect) => void) {
  const obs = new ResizeObserver(([entry]) => entry && onResize(entry.contentRect))
  obs.observe(renderer)
}
