import type { Tile } from 'TilemapEditor/func/parseFileContent'
import { createElement } from 'TilemapEditor/func/createElement'
import EditTile from './EditTile'
import Toolbar from './Toolbar'

export default class Tools {
  public readonly root = createElement('div', { className: 'tools' })
  public selectedTile?: Tile = undefined

  private readonly toolbar: Toolbar
  private readonly editTile: EditTile

  constructor(
    private tiles: Array<Tile>,
    private onTilesChange: (tiles: Array<Tile>) => void,
    private onTileDeleted: (tileId: number) => void
  ) {
    this.editTile = new EditTile(this.onEditTile, this.onCreateTile, this.onDeleteTile)
    this.editTile.hide()

    this.toolbar = new Toolbar(tiles, (t: Tile) => {
      this.selectedTile = t
      this.editTile.set(t)
    })

    this.root.appendChild(this.toolbar.root)
    this.root.appendChild(this.editTile.root)
  }

  private onEditTile = (tile: Tile) => {
    this.selectedTile = tile
    const i = this.tiles.findIndex((t) => t.id === tile.id)
    if (i >= 0) {
      this.tiles[i] = tile
      this.onTilesChange(this.tiles)
    }
  }

  private onCreateTile = () => {
    const id = Math.max(...this.tiles.map((t) => t.id)) + 1
    const newTile = this.selectedTile ? { ...this.selectedTile, id } : { id, shape: 'square', color: 'red' }
    this.selectedTile = newTile
    this.tiles.push(newTile)
    this.editTile.set(newTile)
    this.toolbar.addTile(newTile)
    this.onTilesChange(this.tiles)
  }

  private onDeleteTile = (tile: Tile) => {
    this.tiles = this.tiles.filter((t) => t.id != tile.id)
    this.selectedTile = this.toolbar.removeTile(tile.id)
    this.onTileDeleted(tile.id)
    this.onTilesChange(this.tiles)
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
