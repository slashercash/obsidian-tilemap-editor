import type { Tile } from 'file/FileParser'
import type { Mode } from 'TilemapEditorViewBase'
import ClickAction from 'handlers/ClickHandler'
import DragHandler from 'handlers/DragHandler'
import ZoomEvents from 'handlers/ZoomHandler'
import Style from 'Style'

export class TilemapEditor {
  public readonly root = createElement('div', 'tilemap-editor')
  private readonly renderer = createElement('div', 'tilemap-renderer')
  private readonly zoomStyle = document.createElement('style')
  private readonly tileStyle = document.createElement('style')
  private readonly toolbar = createElement('div', 'tilemap-toolbar')
  private readonly editTiles = createElement('div', 'tilemap-toolbar-edit-tile')
  private readonly space = createElement('div', 'tilemap-space')
  private tileSize = 30
  private onClick?: (e: MouseEvent) => void = undefined
  private toolBarAction: (e: MouseEvent) => void

  constructor(private readonly tilemap: Element, customTiles: ReadonlyArray<Tile>) {
    this.editTiles.hide()
    this.toolbar.hide()

    this.space.appendChild(tilemap)
    this.renderer.appendChild(this.space)
    this.root.appendChild(this.toolbar)
    this.root.appendChild(this.renderer)
    this.root.appendChild(this.zoomStyle)
    this.root.appendChild(this.tileStyle)

    const [initialAction, toolbarButtonContainer] = this.createToolbarButtonContainer(customTiles)
    this.editTiles.append(...createEditTilesContent())
    this.toolbar.append(toolbarButtonContainer, this.editTiles)
    this.toolBarAction = initialAction

    this.updateTileStyle(customTiles)

    const onClick = (e: MouseEvent) => {
      if (this.onClick) {
        console.log('TODO: Save tilemap')
        this.onClick(e)
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

  public onModeChanged(mode: Mode): void {
    switch (mode) {
      case 'navigate':
        this.editTiles.hide()
        this.toolbar.hide()
        this.toolbar.style.height = 'unset'
        this.onClick = undefined
        break
      case 'addTile':
        this.editTiles.hide()
        this.toolbar.show()
        this.toolbar.style.height = 'unset'
        this.onClick = this.toolBarAction
        break
      case 'editTile':
        this.editTiles.show()
        this.toolbar.show()
        this.toolbar.style.height = '100%'
        this.onClick = undefined
        break
      case 'removeTile':
        this.editTiles.hide()
        this.toolbar.hide()
        this.toolbar.style.height = 'unset'
        this.onClick = (e) => {
          const [rowIndex, cellIndex] = this.tileIndexFromClick(e)
          ClickAction.deleteElement(this.tilemap, rowIndex, cellIndex, this.updateTilemapSize)
        }
        break
    }
  }

  private createToolbarButtonContainer(customTiles: ReadonlyArray<Tile>): [(e: MouseEvent) => void, HTMLElement] {
    const toolbarButtonContainer = createElement('div', 'tilemap-toolbar-button-container')
    const [initialAction, toolbarButtons] = this.createToolbarButtons(customTiles)
    toolbarButtonContainer.append(...toolbarButtons)
    return [initialAction, toolbarButtonContainer]
  }

  private createToolbarButtons(
    customTiles: ReadonlyArray<Tile>
  ): [(e: MouseEvent) => void, ReadonlyArray<HTMLElement>] {
    const buttons = customTiles
      .map(({ id }) => `custom-tile-${id}`)
      .map((className) => {
        const button = createElement('button', 'tilemap-toolbar-button')
        button.appendChild(createElement('div', className))
        return button
      })

    let initialAction: ((e: MouseEvent) => void) | undefined = undefined

    buttons.forEach((button, i) => {
      const action = (e: MouseEvent) => {
        const [rowIndex, cellIndex] = this.tileIndexFromClick(e)
        ClickAction.setElement(this.tilemap, button.firstElementChild?.className ?? '', rowIndex, cellIndex)
      }

      button.onclick = () => {
        buttons.forEach((b) => (b.className = 'tilemap-toolbar-button'))
        button.addClass('tilemap-toolbar-button--selected')
        this.toolBarAction = action
        this.onClick = this.toolBarAction
      }

      if (i === 0) {
        button.addClass('tilemap-toolbar-button--selected')
        initialAction = action
      }
    })

    return [initialAction ?? (() => void {}), buttons]
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

function createElement(tagName: keyof HTMLElementTagNameMap, className: string): HTMLElement {
  const element = document.createElement(tagName)
  element.className = className
  return element
}

function createEditTilesContent(): ReadonlyArray<HTMLElement> {
  const labelShape = document.createElement('label')
  labelShape.innerText = 'Shape:'
  const labelColor = document.createElement('label')
  labelColor.innerText = 'Color:'

  const selectShape = createSelectElement('square', ['square', 'circle'])
  const selectColor = createSelectElement('red', ['red', 'blue'])

  const deleteButton = document.createElement('button')
  deleteButton.onclick = () => console.log('DELETE')
  deleteButton.innerText = 'Delete Tile'

  return [labelShape, selectShape, labelColor, selectColor, deleteButton]
}

function createSelectElement(value: string, options: ReadonlyArray<string>): HTMLSelectElement {
  const optionElements = options.map((option) => {
    const optionElement = document.createElement('option')
    optionElement.value = option
    optionElement.innerText = option
    return optionElement
  })
  const selectElement = document.createElement('select')
  selectElement.value = value
  selectElement.onchange = ({ target }) => target instanceof HTMLSelectElement && console.log(target.value)
  selectElement.append(...optionElements)
  return selectElement
}
