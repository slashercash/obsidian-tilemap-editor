import type { Tile } from 'file/FileParser'
import { createElement } from 'utils'

export default class Toolbar {
  public readonly root = createElement('div', { className: 'tilemap-toolbar' })
  public readonly buttonContainer: HTMLDivElement
  public idButtons: Array<{ id: number; button: HTMLButtonElement }>
  public readonly initialTile?: Tile

  private readonly onClick: (tile: Tile) => void

  constructor(tiles: ReadonlyArray<Tile>, onClick: (tile: Tile) => void) {
    this.onClick = onClick
    const { initialTile, idButtons } = createToolbarButtons(tiles, onClick)
    this.initialTile = initialTile
    this.idButtons = idButtons
    this.buttonContainer = createElement('div', {
      className: 'tilemap-toolbar-button-container', // TODO: Is this button-container needed?
      childrenToAppend: idButtons.map((x) => x.button)
    })
    this.root.appendChild(this.buttonContainer)
  }

  public updateTile(tile: Tile) {
    this.idButtons.find(({ id, button }) => {
      if (id === tile.id) {
        button.onclick = () => {
          this.idButtons.forEach((x) => x.button.removeClass('tilemap-toolbar-button--selected'))
          button.addClass('tilemap-toolbar-button--selected')
          this.onClick(tile)
        }
        return true
      }
    })
  }

  public addTile(tile: Tile) {
    this.onClick(tile)
    this.idButtons.forEach((x) => x.button.removeClass('tilemap-toolbar-button--selected'))
    const newButton = createElement('button', { className: 'tilemap-toolbar-button tilemap-toolbar-button--selected' })
    newButton.replaceChildren(createElement('div', { className: `custom-tile-${tile.id}` }))
    newButton.onclick = () => {
      this.idButtons.forEach((x) => x.button.removeClass('tilemap-toolbar-button--selected'))
      newButton.addClass('tilemap-toolbar-button--selected')
      this.onClick(tile)
    }
    this.idButtons.push({ id: tile.id, button: newButton })
    this.buttonContainer.replaceChildren(...this.idButtons.map((x) => x.button))
  }

  // TODO: Delete by classname instead id?
  public removeTile(id: number): number | undefined {
    this.idButtons = this.idButtons.filter((x) => x.id != id)
    this.buttonContainer.replaceChildren(...this.idButtons.map((x) => x.button))
    const btn = this.idButtons[0]
    btn && btn.button.addClass('tilemap-toolbar-button--selected')
    return btn?.id
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

  const idButtons = tileButtons.map(({ tile, button }, i) => {
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

    return { id: tile.id, button }
  })

  // TODO: Typescript is stupid here
  return { initialTile: initialTile as Tile | undefined, idButtons }
}
