import type { Tile } from 'file/FileParser'

export default class Toolbar {
  public readonly root = createElement('div', 'tilemap-toolbar')
  public readonly initialTile?: Tile

  constructor(tiles: ReadonlyArray<Tile>, onClick: (tile: Tile) => void) {
    // TODO: Is this needed?
    const toolbarButtonContainer = createElement('div', 'tilemap-toolbar-button-container')
    const { initialTile, buttons } = createToolbarButtons(tiles, onClick)
    toolbarButtonContainer.append(...buttons)
    this.root.appendChild(toolbarButtonContainer)
    this.initialTile = initialTile
  }

  public show = () => this.root.show()
  public hide = () => this.root.hide()
  public appendChild = (node: Node) => this.root.appendChild(node)
  // TODO: Find nicer solution
  public setHeight = (height: string) => (this.root.style.height = height)
}

function createToolbarButtons(tiles: ReadonlyArray<Tile>, onClick: (tile: Tile) => void) {
  let initialTile: Tile | undefined = undefined

  const tileButtons = tiles.map((tile) => ({ tile, button: createElement('button', 'tilemap-toolbar-button') }))

  const buttons = tileButtons.map(({ tile, button }, i) => {
    button.appendChild(createElement('div', `custom-tile-${tile.id}`))
    button.onclick = () => {
      tileButtons.forEach(({ button }) => button.removeClass('tilemap-toolbar-button--selected'))
      button.addClass('tilemap-toolbar-button--selected')
      onClick(tile)
    }

    if (i === 0) {
      button.addClass('tilemap-toolbar-button--selected')
      initialTile = tile
    }

    return button
  })

  return { initialTile, buttons }
}

// TODO: Outsource
function createElement(tagName: keyof HTMLElementTagNameMap, className: string): HTMLElement {
  const element = document.createElement(tagName)
  element.className = className
  return element
}
