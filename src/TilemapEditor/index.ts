import { type Tile } from 'TilemapEditor/func/parseFileContent'
import type { Mode } from 'TilemapEditorViewBase'
import { createElement } from 'TilemapEditor/func/createElement'
import ClickAction, { trimTilemap } from 'TilemapEditor/handlers/ClickHandler'
import DragHandler from 'TilemapEditor/handlers/DragHandler'
import ZoomEvents from 'TilemapEditor/handlers/ZoomHandler'
import Tools from 'TilemapEditor/components/Tools'
import Style from 'TilemapEditor/components/Style'
import Grid from 'TilemapEditor/components/Grid'
import FileHandler from 'TilemapEditor/handlers/FileHandler'
import parse from 'TilemapEditor/func/parseFileContent'

export default class TilemapEditor {
  public readonly root = createElement('div', { className: 'tilemap-editor' })
  private readonly renderer = createElement('div', { className: 'renderer' })
  private readonly zoomStyle = createElement('style')
  private readonly tileStyle = createElement('style')
  private readonly tools: Tools
  private readonly space = createElement('div', { className: 'space' })
  private readonly grid = new Grid()
  private tileSize = 30
  private onClick?: (e: MouseEvent) => void = undefined
  private tilemap: Element
  private fileHandler: FileHandler
  private style = new Style()

  constructor(fileContent: string, onFileContentChange: (c: string) => void) {
    const { tilemap, customTiles } = parse(fileContent)
    this.tilemap = tilemap
    this.fileHandler = new FileHandler(tilemap, customTiles)

    const onToolbarTilesChange = (tiles: Array<Tile>) => {
      this.style.setTileStyle(customTiles)
      this.fileHandler.setCustomTiles(tiles)
      onFileContentChange(this.fileHandler.getContent())
    }

    const onToolbarTileDeleted = (tileId: number) => {
      this.tilemap = removeTileFromTilemap(tileId, this.tilemap)
      const [scrollDeltaLeft, scrollDeltaTop, newRows] = trimTilemap(this.tilemap)
      this.updateTilemapSize(scrollDeltaTop, scrollDeltaLeft, newRows)
      this.fileHandler.setTilemap(this.tilemap)
      onFileContentChange(this.fileHandler.getContent())
    }

    this.tools = new Tools(customTiles, onToolbarTilesChange, onToolbarTileDeleted)
    this.tools.hide()
    this.space.appendChild(this.grid.root)
    this.space.appendChild(tilemap)
    this.renderer.appendChild(this.space)
    this.root.append(this.tools.root, this.renderer, this.zoomStyle, this.tileStyle)

    this.style.setTileStyle(customTiles)

    const onClick = (e: MouseEvent) => {
      if (this.onClick) {
        this.onClick(e)
        this.fileHandler.setTilemap(this.tilemap)
        onFileContentChange(this.fileHandler.getContent())
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
        this.tools.hide()
        this.onClick = undefined
        break
      case 'addTile':
        this.tools.show(false)
        this.onClick = this.toolbarAction
        break
      case 'editTile':
        this.tools.show(true)
        this.onClick = undefined
        break
      case 'removeTile':
        this.tools.hide()
        this.onClick = (e) => {
          const [rowIndex, cellIndex] = this.tileIndexFromClick(e)
          ClickAction.deleteElement(this.tilemap, rowIndex, cellIndex, this.updateTilemapSize)
        }
        break
    }
  }

  private toolbarAction(e: MouseEvent): void {
    const className = this.tools.selectedTile && `tile-${this.tools.selectedTile.id}`
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
    const rendererRectangle = this.renderer.getBoundingClientRect()
    const tilesCountX = this.tilemap.children[0]?.children.length ?? 0
    const tilesCountY = this.tilemap.children.length
    const spaceTilesCountX = Math.floor(rendererRectangle.width / this.tileSize)
    const spaceTilesCountY = Math.floor(rendererRectangle.height / this.tileSize)
    const setbackX = this.tileSize - (rendererRectangle.width % this.tileSize)
    const setbackY = this.tileSize - (rendererRectangle.height % this.tileSize)
    const width = (tilesCountX + spaceTilesCountX * 2) * this.tileSize
    const height = (tilesCountY + spaceTilesCountY * 2) * this.tileSize

    this.grid.update(width, height, -setbackX, -setbackY, this.tileSize)
    this.style.setZoomStyle(width - 2 * setbackX, height - 2 * setbackY, this.tileSize)
  }
}

function removeTileFromTilemap(tileId: number, tilemap: Element): Element {
  Array.from(tilemap.children).forEach((row, rowIndex) => {
    Array.from(row.children).forEach((cell, cellIndex) => {
      const newElements = Array.from(cell.children).filter((element) => element.className != `tile-${tileId}`)
      tilemap.children[rowIndex]?.children[cellIndex]?.replaceChildren(...newElements)
    })
  })
  return tilemap
}
