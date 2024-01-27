import { createElement } from 'TilemapEditor/func/createElement'
import type { Tile } from 'TilemapEditor/func/parseFileContent'
import TileButtonContainer from './TileButtonContainer'

export default class Toolbar {
  public readonly root = createElement('div', { className: 'toolbar' })

  private tileButtonContainer: TileButtonContainer

  constructor(tiles: Array<Tile>, onTileClick: (t: Tile) => void) {
    this.tileButtonContainer = new TileButtonContainer(tiles, onTileClick)
    this.root.append(this.tileButtonContainer.root)
  }

  public addTile(tile: Tile): void {
    this.tileButtonContainer.addTile(tile)
  }

  public removeTile(id: number): Tile | undefined {
    return this.tileButtonContainer.removeTile(id)
  }
}
