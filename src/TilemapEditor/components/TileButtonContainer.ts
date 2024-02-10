import { createElement } from 'TilemapEditor/func/createElement'
import type { Tile } from 'TilemapEditor/func/parseFileContent'

export default class TileButtonContainer {
  public readonly root = createElement('div', { className: 'tiles-container' })

  // TODO possible only buttons?
  private tileButtons: Array<{ tile: Tile; button: HTMLButtonElement }>

  constructor(tiles: Array<Tile>, private onTileClick: (t: Tile) => void) {
    this.tileButtons = createTileButtons(tiles, this.onTileButtonClick)
    this.root.append(...this.tileButtons.map((x) => x.button))

    if (this.tileButtons[0]) {
      this.tileButtons[0].button.addClass('tile-button--selected')
      onTileClick(this.tileButtons[0].tile)
    }
  }

  public addTile(tile: Tile) {
    this.tileButtons.forEach((x) => x.button.removeClass('tile-button--selected'))

    const button = createTileButton(tile, () => this.onTileButtonClick(tile, button))
    button.addClass('tile-button--selected')

    this.tileButtons.push({ tile, button })
    this.root.replaceChildren(...this.tileButtons.map((x) => x.button))
  }

  // TODO: Delete by classname instead id?
  public removeTile(id: number): Tile | undefined {
    this.tileButtons = this.tileButtons.filter((x) => x.tile.id != id)
    this.root.replaceChildren(...this.tileButtons.map((x) => x.button))
    const tileButton = this.tileButtons[0]
    if (tileButton) {
      tileButton.button.addClass('tile-button--selected')
      return tileButton.tile
    }
  }

  private onTileButtonClick = (tile: Tile, button: HTMLButtonElement) => {
    this.tileButtons.forEach(({ button }) => button.removeClass('tile-button--selected'))
    button.addClass('tile-button--selected')
    this.onTileClick(tile)
  }
}

function createTileButtons(tiles: ReadonlyArray<Tile>, onClick: (tile: Tile, button: HTMLButtonElement) => void) {
  return tiles.map((tile) => ({ tile, button: createTileButton(tile, (t, b) => onClick(t, b)) }))
}

function createTileButton(tile: Tile, onClick: (t: Tile, b: HTMLButtonElement) => void) {
  const button = createElement('button', { className: 'tile-button' })
  button.appendChild(createElement('div', { className: `tile-${tile.id}` }))
  button.onclick = () => onClick(tile, button)
  return button
}
