import type { Tile } from 'TilemapEditor/func/parseFileContent'
import { createElement } from 'TilemapEditor/func/createElement'
import EditTile from './EditTile'

export default class Tools {
  public readonly root = createElement('div', { className: 'toolbar' })
  public selectedTile?: Tile = undefined

  private tileButtons: Array<{ tile: Tile; button: HTMLButtonElement }>
  private readonly tileButtonContainer: HTMLDivElement
  private readonly editTile: EditTile

  constructor(
    private tiles: Array<Tile>,
    private onTilesChange: (tiles: Array<Tile>) => void,
    private onTileDeleted: (tileId: number) => void
  ) {
    this.tileButtons = createToolbarButtons(tiles, this.onToolBarButtonClick)
    const initialTile = this.tileButtons[0]?.tile
    this.tileButtonContainer = createElement(
      'div',
      { className: 'toolbar-button-container' }, // TODO: Is this button-container needed?
      this.tileButtons.map((x) => x.button)
    )
    this.editTile = new EditTile(this.onEditTile, this.onCreateTile, this.onDeleteTile)
    this.editTile.hide()

    if (initialTile) {
      this.setTile(initialTile)
    }

    this.root.appendChild(this.tileButtonContainer)
    this.root.appendChild(this.editTile.root)
  }

  private onEditTile = (tile: Tile) => {
    const i = this.tiles.findIndex((t) => t.id === tile.id)
    if (i >= 0) {
      this.tiles[i] = tile
      this.setTile(tile)
      this.onTilesChange(this.tiles)
    }
  }

  private onCreateTile = (tile: Tile) => {
    tile.id = Math.max(...this.tiles.map((t) => t.id)) + 1
    this.tiles.push(tile)
    this.addTile(tile)
    this.setTile(tile)
    this.onTilesChange(this.tiles)
  }

  private onDeleteTile = (tile: Tile) => {
    this.tiles = this.tiles.filter((t) => t.id != tile.id)
    const selectedTile = this.removeTile(tile.id)
    if (selectedTile) {
      this.selectedTile = selectedTile
      this.editTile.set(selectedTile)
    }
    this.onTilesChange(this.tiles)
    this.onTileDeleted(tile.id)
  }

  private addTile(tile: Tile) {
    this.tileButtons.forEach((x) => x.button.removeClass('toolbar-button--selected'))
    const newButton = createElement('button', { className: 'toolbar-button toolbar-button--selected' })
    newButton.replaceChildren(createElement('div', { className: `tile-${tile.id}` }))
    newButton.onclick = () => this.onToolBarButtonClick(tile, newButton)
    this.tileButtons.push({ tile, button: newButton })
    this.tileButtonContainer.replaceChildren(...this.tileButtons.map((x) => x.button))
  }

  // TODO: Delete by classname instead id?
  private removeTile(id: number): Tile | undefined {
    this.tileButtons = this.tileButtons.filter((x) => x.tile.id != id)
    this.tileButtonContainer.replaceChildren(...this.tileButtons.map((x) => x.button))
    const tileButton = this.tileButtons[0]
    if (tileButton) {
      tileButton.button.addClass('toolbar-button--selected')
      return tileButton.tile
    }
  }

  public show = (showEditTile: boolean) => {
    showEditTile ? this.showEditTile() : this.hideEditTile()
    this.root.show()
  }

  public hide = () => {
    this.hideEditTile()
    this.root.hide()
  }

  private showEditTile() {
    this.root.style.height = '100%'
    this.editTile.show()
  }

  private hideEditTile() {
    this.root.style.height = 'unset'
    this.editTile.hide()
  }

  private setTile(tile: Tile) {
    this.selectedTile = tile
    this.editTile.set(tile)
  }

  private onToolBarButtonClick = (tile: Tile, button: HTMLButtonElement) => {
    this.tileButtons.forEach(({ button }) => button.removeClass('toolbar-button--selected'))
    button.addClass('toolbar-button--selected')
    this.setTile(tile)
  }
}

function createToolbarButtons(
  tiles: ReadonlyArray<Tile>,
  onToolBarButtonClick: (tile: Tile, button: HTMLButtonElement) => void
) {
  const tileButtons = tiles.map((tile) => ({
    tile,
    button: createElement('button', { className: 'toolbar-button' })
  }))

  tileButtons.forEach(({ tile, button }, i) => {
    button.appendChild(createElement('div', { className: `tile-${tile.id}` }))
    button.onclick = () => onToolBarButtonClick(tile, button)

    if (i === 0) {
      button.addClass('toolbar-button--selected')
    }

    return { tile, button }
  })

  return tileButtons
}
