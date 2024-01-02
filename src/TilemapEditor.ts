import type { TilemapMetadataCustomTile } from 'file/FileParser'
import ClickAction from 'handlers/ClickHandler'
import DragHandler from 'handlers/DragHandler'
import ZoomEvents from 'handlers/ZoomHandler'
import Style from 'Style'

export class TilemapEditor {
  public readonly root = createElement('div', 'tilemap-editor')
  private readonly renderer = createElement('div', 'tilemap-renderer')
  private readonly zoomStyle = document.createElement('style')
  private readonly tileStyle = document.createElement('style')
  private readonly toolbar = createElement('div', 'tilemap-toolbar-overlay')
  private readonly space = createElement('div', 'tilemap-space')
  private tileSize = 30
  private onClick?: (e: MouseEvent) => void = undefined

  constructor(private readonly tilemap: Element, customTiles: ReadonlyArray<TilemapMetadataCustomTile>) {
    this.toolbar.hide()

    this.space.appendChild(tilemap)
    this.renderer.appendChild(this.space)
    this.root.appendChild(this.toolbar)
    this.root.appendChild(this.renderer)
    this.root.appendChild(this.zoomStyle)
    this.root.appendChild(this.tileStyle)

    this.updateToolbar(customTiles)
    this.updateTileStyle(customTiles)

    // TODO: Look for better solution
    const onClick = (e: MouseEvent) => this.onClick && this.onClick(e)

    const updateTileSize = (zoomFactor: number) => {
      this.tileSize *= zoomFactor
      this.updateZoomStyle()
    }

    this.renderer.addEventListener('mousedown', DragHandler.startDragging(this.renderer))
    this.renderer.addEventListener('click', DragHandler.click(onClick))
    this.renderer.addEventListener('mouseleave', DragHandler.stopDragging)
    this.renderer.addEventListener('mousemove', DragHandler.mouseMove(this.renderer))
    this.renderer.addEventListener('touchstart', ZoomEvents.handleTouch(updateTileSize), { passive: true })
    this.renderer.addEventListener('touchmove', ZoomEvents.handleTouch(updateTileSize), { passive: true })
    this.renderer.addEventListener('touchend', ZoomEvents.handleTouch(updateTileSize), { passive: true })
    this.renderer.addEventListener('touchcancel', ZoomEvents.handleTouch(updateTileSize), { passive: true })
    this.renderer.addEventListener('wheel', ZoomEvents.handleWheel(updateTileSize), { passive: true })

    new ResizeObserver(() => this.updateZoomStyle()).observe(this.renderer)
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

    const setbackX = this.tileSize - (rendererRectangle.width % this.tileSize)
    const setbackY = this.tileSize - (rendererRectangle.height % this.tileSize)

    const clickPosX = e.clientX - rendererRectangle.left + setbackX + this.renderer.scrollLeft
    const clickPosY = e.clientY - rendererRectangle.top + setbackY + this.renderer.scrollTop

    const tileX = Math.floor(clickPosX / this.tileSize)
    const tileY = Math.floor(clickPosY / this.tileSize)
    // TODO: Merge?
    const offsetX = tileX - Math.floor(rendererRectangle.width / this.tileSize)
    const offsetY = tileY - Math.floor(rendererRectangle.height / this.tileSize)

    const expandTilemap = (scrollDeltaTop: number, scrollDeltaLeft: number, newRows: ReadonlyArray<Element>): void => {
      const scrollTop = this.renderer.scrollTop + scrollDeltaTop
      const scrollLeft = this.renderer.scrollLeft + scrollDeltaLeft

      this.tilemap.replaceChildren(...newRows)

      this.renderer.scrollTop = scrollTop
      this.renderer.scrollLeft = scrollLeft

      this.updateZoomStyle()
    }

    return ClickAction.prepareTilemap(this.tilemap, offsetX, offsetY, this.tileSize, expandTilemap)
  }

  private updateZoomStyle() {
    const tilesCountX = this.tilemap.children[0]?.children.length ?? 0
    const tilesCountY = this.tilemap.children.length
    this.zoomStyle.innerText = Style.zoomStyle(
      tilesCountX,
      tilesCountY,
      this.tileSize,
      this.renderer.getBoundingClientRect()
    )
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

function createElement(tagName: keyof HTMLElementTagNameMap, className: string): HTMLElement {
  const element = document.createElement(tagName)
  element.className = className
  return element
}
