import type { Tile } from 'file/FileParser'
import type { Mode } from 'TilemapEditorViewBase'
import { createElement } from 'utils'
import ClickAction, { trimTilemap } from 'handlers/ClickHandler'
import DragHandler from 'handlers/DragHandler'
import ZoomEvents from 'handlers/ZoomHandler'
import Toolbar from 'components/Toolbar'
import Style from 'Style'
import Grid from 'components/Grid'

export class TilemapEditor {
  public readonly root = createElement('div', { className: 'tilemap-editor' })
  private readonly renderer = createElement('div', { className: 'tilemap-renderer' })
  private readonly zoomStyle = createElement('style')
  private readonly tileStyle = createElement('style')
  private readonly toolbar: Toolbar
  private readonly space = createElement('div', { className: 'tilemap-space' })
  private tileSize = 30
  private onClick?: (e: MouseEvent) => void = undefined

  constructor(
    private tilemap: Element,
    customTiles: Array<Tile>,
    onTilemapChange: (t: Element) => void,
    onCustomTilesChange: (c: Array<Tile>) => void
  ) {
    const onToolbarTilesChange = (tiles: Array<Tile>) => {
      this.updateTileStyle(tiles)
      onCustomTilesChange(tiles)
    }

    const onToolbarTileDeleted = (tileId: number) => {
      this.tilemap = removeTileFromTilemap(tileId, this.tilemap)
      const [scrollDeltaLeft, scrollDeltaTop, newRows] = trimTilemap(this.tilemap)
      this.updateTilemapSize(scrollDeltaTop, scrollDeltaLeft, newRows)
      onTilemapChange(this.tilemap)
    }

    this.toolbar = new Toolbar(customTiles, onToolbarTilesChange, onToolbarTileDeleted)
    this.toolbar.hide()
    this.space.appendChild(new Grid().root)
    this.space.appendChild(tilemap)
    this.renderer.appendChild(this.space)
    this.root.append(this.toolbar.root, this.renderer, this.zoomStyle, this.tileStyle)

    this.updateTileStyle(customTiles)

    const onClick = (e: MouseEvent) => {
      if (this.onClick) {
        this.onClick(e)
        onTilemapChange(this.tilemap)
      }
    }

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

  public centerView(): void {
    this.updateZoomStyle()
    this.renderer.scrollLeft = (this.renderer.scrollWidth - this.renderer.clientWidth) / 2
    this.renderer.scrollTop = (this.renderer.scrollHeight - this.renderer.clientHeight) / 2
  }

  public onModeChanged(mode: Mode): void {
    switch (mode) {
      case 'navigate':
        this.toolbar.hide()
        this.onClick = undefined
        break
      case 'addTile':
        this.toolbar.show(false)
        this.onClick = this.toolbarAction
        break
      case 'editTile':
        this.toolbar.show(true)
        this.onClick = undefined
        break
      case 'removeTile':
        this.toolbar.hide()
        this.onClick = (e) => {
          const [rowIndex, cellIndex] = this.tileIndexFromClick(e)
          ClickAction.deleteElement(this.tilemap, rowIndex, cellIndex, this.updateTilemapSize)
        }
        break
    }
  }

  private toolbarAction(e: MouseEvent): void {
    const className = this.toolbar.selectedTile && `custom-tile-${this.toolbar.selectedTile.id}`
    if (className) {
      const [rowIndex, cellIndex] = this.tileIndexFromClick(e)
      ClickAction.setElement(this.tilemap, className, rowIndex, cellIndex)
    }
  }

  private tileIndexFromClick(e: MouseEvent) {
    const rendererRectangle = this.renderer.getBoundingClientRect()

    const setbackX = this.tileSize - (rendererRectangle.width % this.tileSize)
    const setbackY = this.tileSize - (rendererRectangle.height % this.tileSize)

    const clickPosX = e.clientX - rendererRectangle.left + setbackX + this.renderer.scrollLeft
    const clickPosY = e.clientY - rendererRectangle.top + setbackY + this.renderer.scrollTop

    const tileX = Math.floor(clickPosX / this.tileSize)
    const tileY = Math.floor(clickPosY / this.tileSize)

    const offsetX = tileX - Math.floor(rendererRectangle.width / this.tileSize)
    const offsetY = tileY - Math.floor(rendererRectangle.height / this.tileSize)

    return ClickAction.prepareTilemap(this.tilemap, offsetX, offsetY, this.updateTilemapSize)
  }

  private updateTilemapSize = (scrollDeltaTop: number, scrollDeltaLeft: number, newRows: ReadonlyArray<Element>) => {
    const scrollTop = this.renderer.scrollTop + scrollDeltaTop * this.tileSize
    const scrollLeft = this.renderer.scrollLeft + scrollDeltaLeft * this.tileSize

    this.tilemap.replaceChildren(...newRows)

    this.renderer.scrollTop = scrollTop
    this.renderer.scrollLeft = scrollLeft

    this.updateZoomStyle()
  }

  private updateZoomStyle() {
    const x = this.tilemap.children[0]?.children.length ?? 0
    const y = this.tilemap.children.length
    this.zoomStyle.innerText = Style.zoomStyle(x, y, this.tileSize, this.renderer.getBoundingClientRect())
  }

  private updateTileStyle(customTiles: ReadonlyArray<Tile>) {
    this.tileStyle.innerText = Style.tileStyle(customTiles)
  }
}

function removeTileFromTilemap(tileId: number, tilemap: Element): Element {
  Array.from(tilemap.children).forEach((row, rowIndex) => {
    Array.from(row.children).forEach((cell, cellIndex) => {
      const newElements = Array.from(cell.children).filter((element) => element.className != `custom-tile-${tileId}`)
      tilemap.children[rowIndex]?.children[cellIndex]?.replaceChildren(...newElements)
    })
  })
  return tilemap
}
