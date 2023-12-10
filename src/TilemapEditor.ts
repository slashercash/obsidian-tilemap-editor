import type { TilemapMetadataCustomTile } from 'file/FileParser'
import { addDragEvents } from 'events/dragEvents'
import { addZoomEvents } from 'events/zoomEvents'
import ClickAction from 'clickActions/clickAction'

export class TilemapEditor {
  private readonly tilemapEditor: HTMLElement
  private readonly toolbar: HTMLElement
  private readonly renderer: HTMLElement
  private readonly space: HTMLElement

  constructor(tilemap: Element, customTiles: ReadonlyArray<TilemapMetadataCustomTile>) {
    this.tilemapEditor = createElement('div', 'tilemap-editor')

    this.toolbar = this.createToolbar(tilemap, customTiles)

    const zoomStyle = document.createElement('style')
    const setZoomStyle = (tileSize: number) => {
      const rendererRect = this.renderer.getBoundingClientRect()
      const tilesCountHorizontal = tilemap.children[0]?.children.length ?? 0
      const tilesCountVertical = tilemap.children.length
      const [width, height] = spaceStyle(rendererRect, tilesCountHorizontal, tilesCountVertical, tileSize)
      zoomStyle.innerText = `.view-content-tilemap-editor .tilemap-cell { width:${tileSize}px;height:${tileSize}px; }
.view-content-tilemap-editor .tilemap-space { width:${width}px;height:${height}px; }`
    }

    this.renderer = createElement('div', 'tilemap-renderer')
    addDragEvents(this.renderer)
    addZoomEvents(this.renderer, (newTileSize) => setZoomStyle(newTileSize))

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
    const obs = new ResizeObserver(() => setZoomStyle(30))
    obs.observe(this.renderer)
    this.space.appendChild(tilemap)
    this.renderer.appendChild(this.space)

    this.tilemapEditor.appendChild(this.toolbar)
    this.tilemapEditor.appendChild(this.renderer)
    this.tilemapEditor.appendChild(zoomStyle)
    this.tilemapEditor.appendChild(tileStyle)
  }

  public root() {
    return this.tilemapEditor
  }

  public setEditmode(isEditMode: boolean) {
    isEditMode ? this.toolbar.show() : this.toolbar.hide()
  }

  private createToolbar(tilemap: Element, customTiles: ReadonlyArray<TilemapMetadataCustomTile>): HTMLElement {
    const toolbar = createElement('div', 'tilemap-toolbar-overlay')
    toolbar.hide()
    const toolbarButtonContainer = createElement('div', 'tilemap-toolbar-button-container')
    const toolbarButtons = this.createToolbarButtons(tilemap, customTiles)
    toolbarButtonContainer.append(...toolbarButtons)
    toolbar.appendChild(toolbarButtonContainer)
    return toolbar
  }

  private createToolbarButtons(
    tilemap: Element,
    customTiles: ReadonlyArray<TilemapMetadataCustomTile>
  ): ReadonlyArray<HTMLElement> {
    const buttonSources = customTiles
      .map(({ id }) => `custom-tile-${id}`)
      .map((className) => ({
        child: createElement('div', className),
        onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => {
          const [rowKey, cellKey] = ClickAction.prepareTilemap(tilemap, this.renderer, offsetX, offsetY, tileSize)
          ClickAction.setElement(tilemap, className, rowKey, cellKey)
        }
      }))
    const deleteElement = document.createElement('span')
    deleteElement.innerText = 'Delete'
    buttonSources.push({
      child: deleteElement,
      onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => {
        const [rowKey, cellKey] = ClickAction.prepareTilemap(tilemap, this.renderer, offsetX, offsetY, tileSize)
        ClickAction.deleteElement(tilemap, this.renderer, rowKey, cellKey, tileSize)
      }
    })
    const [onSpaceClicked, buttons] = buttonSources.reduce<[OnSpaceClickedFn, Array<HTMLElement>]>(
      ([onSpaceClicked, buttons], buttonSource, i) => {
        const selectedButtonIndex = 0
        const isSelected = i === selectedButtonIndex
        // if (isEditMode && !editTiles && i === selectedButtonIndex) {
        //   onSpaceClicked = buttonSource.onSpaceClicked
        // }
        const button = createElement(
          'button',
          `tilemap-toolbar-button${isSelected ? ' tilemap-toolbar-button--selected' : ''}`
        )
        // TODO: setSelectedButtonIndex(i)
        button.onclick = () => {}
        button.appendChild(buttonSource.child)
        buttons.push(button)
        return [onSpaceClicked, buttons]
      },
      [() => {}, []]
    )
    return buttons
  }
}

type OnSpaceClickedFn = (offsetX: number, offsetY: number, tileSize: number) => void

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
