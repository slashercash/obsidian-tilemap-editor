import type { Tile } from 'file/FileParser'
import { createElement } from 'utils'
import EditTile from './EditTile'

export default class Toolbar {
  public readonly root = createElement('div', { className: 'tilemap-toolbar' })
  public readonly buttonContainer: HTMLDivElement
  public tileButtons: Array<{ tile: Tile; button: HTMLButtonElement }>
  public toolbarAction?: (e: MouseEvent) => void = undefined
  private readonly editTile: EditTile

  constructor(
    private tiles: Array<Tile>,
    private createToolbarAction: (tile: Tile) => (e: MouseEvent) => void,
    onCustomTilesChange: (c: Array<Tile>) => void,
    onTilemapChange: () => void,
    private updateTileStyle: (t: ReadonlyArray<Tile>) => void,
    private trimTilemap: (tileId: number) => void
  ) {
    this.tileButtons = createToolbarButtons(tiles, (tile) => {
      this.toolbarAction = createToolbarAction(tile)
      this.editTile.set(tile)
    })
    const initialTile = this.tileButtons[0]?.tile
    this.buttonContainer = createElement(
      'div',
      { className: 'tilemap-toolbar-button-container' }, // TODO: Is this button-container needed?
      this.tileButtons.map((x) => x.button)
    )
    this.editTile = new EditTile(
      (x) => {
        this.onEditTile(x)
        onCustomTilesChange(this.tiles)
      },
      (x) => {
        this.onCreateTile(x)
        onCustomTilesChange(this.tiles)
      },
      (x) => {
        this.onDeleteTile(x)
        onTilemapChange()
        onCustomTilesChange(this.tiles)
      }
    )
    this.editTile.hide()

    if (initialTile) {
      this.toolbarAction = createToolbarAction(initialTile)
      this.editTile.set(initialTile)
    }

    this.root.appendChild(this.buttonContainer)
    this.root.appendChild(this.editTile.root)
  }

  private onEditTile(tile: Tile) {
    const i = this.tiles.findIndex((t) => t.id === tile.id)
    if (i >= 0) {
      this.tiles[i] = tile
      this.updateTileStyle(this.tiles)
      // this.updateTile(tile)
      this.toolbarAction = this.createToolbarAction(tile)
      this.editTile.set(tile)
    }
  }

  private onCreateTile(tile: Tile) {
    tile.id = Math.max(...this.tiles.map((t) => t.id)) + 1
    this.tiles.push(tile)
    this.updateTileStyle(this.tiles)
    this.addTile(tile)
    this.toolbarAction = this.createToolbarAction(tile)
    this.editTile.set(tile)
  }

  private onDeleteTile(tile: Tile) {
    this.tiles = this.tiles.filter((t) => t.id != tile.id)
    const selectedTile = this.removeTile(tile.id)
    if (selectedTile) {
      this.toolbarAction = this.createToolbarAction(selectedTile)
      this.editTile.set(selectedTile)
    }

    this.trimTilemap(tile.id)
  }

  // TODO: Is this needed?
  // private updateTile(tileToUpdate: Tile) {
  //   this.tileButtons.find(({ tile, button }) => {
  //     if (tile.id === tileToUpdate.id) {
  //       button.onclick = () => {
  //         this.tileButtons.forEach((x) => x.button.removeClass('tilemap-toolbar-button--selected'))
  //         button.addClass('tilemap-toolbar-button--selected')
  //       }
  //       return true
  //     }
  //   })
  // }

  private addTile(tile: Tile) {
    this.tileButtons.forEach((x) => x.button.removeClass('tilemap-toolbar-button--selected'))
    const newButton = createElement('button', { className: 'tilemap-toolbar-button tilemap-toolbar-button--selected' })
    newButton.replaceChildren(createElement('div', { className: `custom-tile-${tile.id}` }))
    newButton.onclick = () => {
      this.tileButtons.forEach((x) => x.button.removeClass('tilemap-toolbar-button--selected'))
      newButton.addClass('tilemap-toolbar-button--selected')
      this.toolbarAction = this.createToolbarAction(tile)
    }
    this.tileButtons.push({ tile, button: newButton })
    this.buttonContainer.replaceChildren(...this.tileButtons.map((x) => x.button))
  }

  // TODO: Delete by classname instead id?
  private removeTile(id: number): Tile | undefined {
    this.tileButtons = this.tileButtons.filter((x) => x.tile.id != id)
    this.buttonContainer.replaceChildren(...this.tileButtons.map((x) => x.button))
    const tileButton = this.tileButtons[0]
    if (tileButton) {
      tileButton.button.addClass('tilemap-toolbar-button--selected')
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
