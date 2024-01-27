import type { Tile } from 'TilemapEditor/func/parseFileContent'
import { createElement } from 'TilemapEditor/func/createElement'
import EditTile from './EditTile'
import Toolbar from './Toolbar'

export default class Tools {
  public readonly root = createElement('div', { className: 'tools' })
  // TODO: only save index insetad of whole tile
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
    if (!this.selectedTile) {
      return
    }
    this.selectedTile = { ...tile, id: this.selectedTile.id }
    const i = this.tiles.findIndex((t) => t.id === this.selectedTile?.id)
    if (i >= 0) {
      this.tiles[i] = this.selectedTile
      this.onTilesChange(this.tiles)
    }
  }

  private onCreateTile = () => {
    const id = Math.max(...this.tiles.map((t) => t.id)) + 1
    this.selectedTile = this.selectedTile ? { ...this.selectedTile, id } : { id, shape: 'square', color: 'red' }
    this.tiles.push(this.selectedTile)
    this.toolbar.addTile(this.selectedTile)
    this.onTilesChange(this.tiles)
  }

  private onDeleteTile = () => {
    const deleteId = this.selectedTile?.id
    if (!deleteId) {
      return
    }
    this.tiles = this.tiles.filter((t) => t.id != deleteId)
    this.selectedTile = this.toolbar.removeTile(deleteId)
    if (this.selectedTile) {
      this.editTile.set(this.selectedTile)
    }
    this.onTileDeleted(deleteId)
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
