import type { Tile } from 'file/FileParser'
import { createElement } from 'utils'

export default class Toolbar {
  public readonly root = createElement('div', { className: 'tilemap-toolbar' })
  public readonly initialTile?: Tile

  constructor(tiles: ReadonlyArray<Tile>, onClick: (tile: Tile) => void) {
    const { initialTile, buttons } = createToolbarButtons(tiles, onClick)
    this.initialTile = initialTile
    this.root.appendChild(
      createElement('div', {
        className: 'tilemap-toolbar-button-container', // TODO: Is this button-container needed?
        childrenToAppend: buttons
      })
    )
  }

  public show = () => this.root.show()
  public hide = () => this.root.hide()
  public appendChild = (node: Node) => this.root.appendChild(node)
  // TODO: Find nicer solution
  public setHeight = (height: string) => (this.root.style.height = height)
}

function createToolbarButtons(tiles: ReadonlyArray<Tile>, onClick: (tile: Tile) => void) {
  let initialTile: Tile | undefined = undefined

  const tileButtons = tiles.map((tile) => ({
    tile,
    button: createElement('button', { className: 'tilemap-toolbar-button' })
  }))

  const buttons = tileButtons.map(({ tile, button }, i) => {
    button.appendChild(createElement('div', { className: `custom-tile-${tile.id}` }))
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
