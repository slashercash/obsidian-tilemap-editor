import type { Tile } from 'file/FileParser'
import { createElement } from 'utils'

export default class Toolbar {
  public readonly root = createElement('div', { className: 'tilemap-toolbar' })
  public readonly buttonContainer: HTMLDivElement
  public tileButtons: Array<{ tile: Tile; button: HTMLButtonElement }>
  public readonly initialTile?: Tile

  private readonly onClick: (tile: Tile) => void

  constructor(tiles: ReadonlyArray<Tile>, onClick: (tile: Tile) => void) {
    this.onClick = onClick
    this.tileButtons = createToolbarButtons(tiles, onClick)
    this.initialTile = this.tileButtons[0]?.tile
    this.buttonContainer = createElement('div', {
      className: 'tilemap-toolbar-button-container', // TODO: Is this button-container needed?
      childrenToAppend: this.tileButtons.map((x) => x.button)
    })
    this.root.appendChild(this.buttonContainer)
  }

  public updateTile(tileToUpdate: Tile) {
    this.tileButtons.find(({ tile, button }) => {
      if (tile.id === tileToUpdate.id) {
        button.onclick = () => {
          this.tileButtons.forEach((x) => x.button.removeClass('tilemap-toolbar-button--selected'))
          button.addClass('tilemap-toolbar-button--selected')
          this.onClick(tileToUpdate)
        }
        return true
      }
    })
  }

  public addTile(tile: Tile) {
    this.onClick(tile)
    this.tileButtons.forEach((x) => x.button.removeClass('tilemap-toolbar-button--selected'))
    const newButton = createElement('button', { className: 'tilemap-toolbar-button tilemap-toolbar-button--selected' })
    newButton.replaceChildren(createElement('div', { className: `custom-tile-${tile.id}` }))
    newButton.onclick = () => {
      this.tileButtons.forEach((x) => x.button.removeClass('tilemap-toolbar-button--selected'))
      newButton.addClass('tilemap-toolbar-button--selected')
      this.onClick(tile)
    }
    this.tileButtons.push({ tile, button: newButton })
    this.buttonContainer.replaceChildren(...this.tileButtons.map((x) => x.button))
  }

  // TODO: Delete by classname instead id?
  public removeTile(id: number): Tile | undefined {
    this.tileButtons = this.tileButtons.filter((x) => x.tile.id != id)
    this.buttonContainer.replaceChildren(...this.tileButtons.map((x) => x.button))
    const tileButton = this.tileButtons[0]
    if (tileButton) {
      tileButton.button.addClass('tilemap-toolbar-button--selected')
      this.onClick(tileButton.tile)
      return tileButton.tile
    }
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

  tileButtons.forEach(({ tile, button }, i) => {
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

    return { tile, button }
  })

  return tileButtons
}
