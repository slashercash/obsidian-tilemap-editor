import type { Tile } from 'file/FileParser'
import type { Mode } from 'TilemapEditorViewBase'
import { createElement } from 'utils'
import ClickAction, { trimTilemap } from 'handlers/ClickHandler'
import DragHandler from 'handlers/DragHandler'
import ZoomEvents from 'handlers/ZoomHandler'
import Toolbar from 'components/Toolbar'
import EditTile from 'components/EditTile'
import Style from 'Style'

export class TilemapEditor {
  public readonly root = createElement('div', { className: 'tilemap-editor' })
  private readonly renderer = createElement('div', { className: 'tilemap-renderer' })
  private readonly zoomStyle = createElement('style')
  private readonly tileStyle = createElement('style')
  private readonly toolbar: Toolbar
  private readonly editTile: EditTile
  private readonly space = createElement('div', { className: 'tilemap-space' })
  private tileSize = 30
  private onClick?: (e: MouseEvent) => void = undefined
  private toolBarAction?: (e: MouseEvent) => void = undefined

  constructor(
    private tilemap: Element,
    private customTiles: Array<Tile>,
    onTilemapChange: (t: Element) => void,
    onCustomTilesChange: (c: Array<Tile>) => void
  ) {
    this.toolbar = new Toolbar(customTiles, (tile) => {
      this.toolBarAction = this.createToolbarAction(tile)
      this.onClick = this.toolBarAction
      this.editTile.set(tile)
    })

    this.editTile = new EditTile(
      (x) => {
        this.onEditTile(x)
        onCustomTilesChange(this.customTiles)
      },
      (x) => {
        this.onCreateTile(x)
        onCustomTilesChange(this.customTiles)
      },
      (x) => {
        this.onDeleteTile(x)
        onTilemapChange(this.tilemap)
        onCustomTilesChange(this.customTiles)
      }
    )
    this.editTile.hide()
    this.toolbar.hide()
    this.space.appendChild(tilemap)
    this.renderer.appendChild(this.space)
    this.root.append(this.toolbar.root, this.renderer, this.zoomStyle, this.tileStyle)
    this.toolbar.appendChild(this.editTile.root)

    if (this.toolbar.initialTile) {
      this.toolBarAction = this.createToolbarAction(this.toolbar.initialTile)
      this.editTile.set(this.toolbar.initialTile)
    }

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

  private onEditTile(tile: Tile) {
    const i = this.customTiles.findIndex((t) => t.id === tile.id)
    if (i >= 0) {
      this.customTiles[i] = tile
      this.updateTileStyle(this.customTiles)
      this.toolbar.updateTile(tile)
      this.toolBarAction = this.createToolbarAction(tile)
      this.onClick = this.toolBarAction
    }
  }

  private onCreateTile(tile: Tile) {
    tile.id = Math.max(...this.customTiles.map((t) => t.id)) + 1
    this.customTiles.push(tile)
    this.updateTileStyle(this.customTiles)
    this.toolbar.addTile(tile)
    this.toolBarAction = this.createToolbarAction(tile)
    this.onClick = this.toolBarAction
  }

  private onDeleteTile(tile: Tile) {
    this.customTiles = this.customTiles.filter((t) => t.id != tile.id)
    const selectedTile = this.toolbar.removeTile(tile.id)
    this.toolBarAction = selectedTile && this.createToolbarAction(selectedTile)
    this.onClick = this.toolBarAction

    Array.from(this.tilemap.children).forEach((row, rowIndex) => {
      Array.from(row.children).forEach((cell, cellIndex) => {
        const newElements = Array.from(cell.children).filter((element) => element.className != `custom-tile-${tile.id}`)
        this.tilemap.children[rowIndex]?.children[cellIndex]?.replaceChildren(...newElements)
      })
    })

    const [scrollDeltaLeft, scrollDeltaTop, newRows] = trimTilemap(this.tilemap)
    this.updateTilemapSize(scrollDeltaTop, scrollDeltaLeft, newRows)
  }

  public onModeChanged(mode: Mode): void {
    switch (mode) {
      case 'navigate':
        this.editTile.hide() ///////////// this belongs together \
        this.toolbar.setHeight('unset') // this belongs together /
        this.toolbar.hide()
        this.onClick = undefined
        break
      case 'addTile':
        this.editTile.hide()
        this.toolbar.setHeight('unset')
        this.toolbar.show()
        this.onClick = this.toolBarAction
        break
      case 'editTile':
        this.editTile.show()
        this.toolbar.setHeight('100%')
        this.toolbar.show()
        this.onClick = undefined
        break
      case 'removeTile':
        this.editTile.hide()
        this.toolbar.setHeight('unset')
        this.toolbar.hide()
        this.onClick = (e) => {
          const [rowIndex, cellIndex] = this.tileIndexFromClick(e)
          ClickAction.deleteElement(this.tilemap, rowIndex, cellIndex, this.updateTilemapSize)
        }
        break
    }
  }

  private createToolbarAction(tile: Tile): (e: MouseEvent) => void {
    const className = `custom-tile-${tile.id}`
    // TODO: Only create clickAction?
    return (e: MouseEvent) => {
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
