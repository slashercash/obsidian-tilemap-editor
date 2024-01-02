import type { TilemapMetadataCustomTile } from 'file/FileParser'
import DragEvents from 'events/DragEvents'
import ZoomEvents from 'events/ZoomEvents'
import ClickAction from 'clickActions/clickAction'

export class TilemapEditor {
  public readonly root = createElement('div', 'tilemap-editor')
  private readonly renderer = createElement('div', 'tilemap-renderer')
  private readonly zoomStyle = document.createElement('style')
  private readonly tileStyle = document.createElement('style')
  private readonly toolbar = createElement('div', 'tilemap-toolbar-overlay')
  private readonly space = createElement('div', 'tilemap-space')

  private onClick?: (e: MouseEvent) => void = undefined

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

    const onClick = (e: MouseEvent) => this.onClick && this.onClick(e)
    const updateTileSize = (zoomFactor: number) => this.updateTileSize(zoomFactor)

    this.renderer.addEventListener('mousedown', DragEvents.startDragging(this.renderer))
    this.renderer.addEventListener('click', DragEvents.click(onClick))
    this.renderer.addEventListener('mouseleave', DragEvents.stopDragging)
    this.renderer.addEventListener('mousemove', DragEvents.mouseMove(this.renderer))

    this.renderer.addEventListener('touchstart', ZoomEvents.handleTouch(updateTileSize), { passive: true })
    this.renderer.addEventListener('touchmove', ZoomEvents.handleTouch(updateTileSize), { passive: true })
    this.renderer.addEventListener('touchend', ZoomEvents.handleTouch(updateTileSize), { passive: true })
    this.renderer.addEventListener('touchcancel', ZoomEvents.handleTouch(updateTileSize), { passive: true })
    this.renderer.addEventListener('wheel', ZoomEvents.handleWheel(updateTileSize), { passive: true })

    addResizeObserver(this.renderer, (r) => this.updateZoomStyle(spaceProps(r, this.tileSize)))
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
          this.onClick = (e) => {
            const [rowIndex, cellIndex] = this.tileIndexFromClick(e)
            ClickAction.setElement(this.tilemap, button.firstElementChild?.className ?? '', rowIndex, cellIndex)
          }
        })
    )
    return buttons
  }

  private tileIndexFromClick(e: MouseEvent) {
    const rendererRectangle = this.renderer.getBoundingClientRect()
    const sp = spaceProps(rendererRectangle, this.tileSize)

    const clickPosX = e.clientX - rendererRectangle.left + sp.setbackHorizontal + this.renderer.scrollLeft
    const clickPosY = e.clientY - rendererRectangle.top + sp.setbackVertical + this.renderer.scrollTop

    const tileX = Math.floor(clickPosX / this.tileSize)
    const tileY = Math.floor(clickPosY / this.tileSize)

    const offsetX = tileX - sp.tilesCountHorizontal
    const offsetY = tileY - sp.spaceTilesCountVertical
    return ClickAction.prepareTilemap(this.tilemap, this.renderer, offsetX, offsetY, this.tileSize, () =>
      this.updateZoomStyle(sp)
    )
  }

  private updateTileSize(zoomFactor: number) {
    this.tileSize *= zoomFactor
    const sp = spaceProps(this.renderer.getBoundingClientRect(), this.tileSize)
    this.updateZoomStyle(sp)
  }

  private updateZoomStyle(sp: {
    tilesCountHorizontal: number
    spaceTilesCountVertical: number
    setbackHorizontal: number
    setbackVertical: number
  }) {
    const tilesCountHorizontal = this.tilemap.children[0]?.children.length ?? 0
    const tilesCountVertical = this.tilemap.children.length

    const width = (tilesCountHorizontal + sp.tilesCountHorizontal * 2) * this.tileSize - 2 * sp.setbackHorizontal
    const height = (tilesCountVertical + sp.spaceTilesCountVertical * 2) * this.tileSize - 2 * sp.setbackVertical

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

function spaceProps(rendererRectangle: DOMRect, tileSize: number) {
  return {
    tilesCountHorizontal: Math.floor(rendererRectangle.width / tileSize),
    spaceTilesCountVertical: Math.floor(rendererRectangle.height / tileSize),
    setbackHorizontal: tileSize - (rendererRectangle.width % tileSize),
    setbackVertical: tileSize - (rendererRectangle.height % tileSize)
  }
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
