import type { Mode } from 'TilemapEditor'
import type { Tile } from 'TilemapEditor/func/parseFileContent'
import { createElement } from 'TilemapEditor/func/createElement'
import TileButtonContainer from './TileButtonContainer'

export default class Toolbar {
  public readonly root = createElement('div', { className: 'toolbar' })

  private tileButtonContainer: TileButtonContainer
  private mode: Mode = 'navigate'
  private bar = createElement('div', { className: 'toolbar-bar' })

  // TOOLTIPS:
  // Remove Tiles
  // Edit Tiles
  // Add Tiles
  // Close Toolbar

  private rmvButton = createElement('button', { innerText: 'REMOVE' })
  private edtButton = createElement('button', { innerText: 'EDIT' })
  private addButton = createElement('button', { innerText: 'ADD' })
  private tglButton = createElement('button', { innerText: 'ADD' })

  constructor(tiles: Array<Tile>, onTileClick: (t: Tile) => void, private onModeChanged: (mode: Mode) => void) {
    this.tileButtonContainer = new TileButtonContainer(tiles, onTileClick)

    this.rmvButton.onclick = () => this.changeMode('removeTile', this.rmvButton)
    this.edtButton.onclick = () => this.changeMode('editTile', this.edtButton)
    this.addButton.onclick = () => this.changeMode('addTile', this.addButton)
    this.tglButton.onclick = () => {
      if (this.mode === 'navigate') {
        this.select(this.addButton)
        this.tglButton.innerText = 'CLOSE'
        this.mode = 'addTile'
        this.bar.show()
      } else {
        this.select(undefined)
        this.tglButton.innerText = 'ADD'
        this.mode = 'navigate'
        this.bar.hide()
      }
      onModeChanged(this.mode)
    }

    this.bar.append(this.addButton, this.rmvButton, this.tileButtonContainer.root, this.edtButton)
    this.bar.hide()

    this.root.append(this.bar, this.tglButton)
  }

  public addTile(tile: Tile): void {
    this.tileButtonContainer.addTile(tile)
  }

  public removeTile(id: number): Tile | undefined {
    return this.tileButtonContainer.removeTile(id)
  }

  private changeMode(mode: Mode, actionButton: HTMLElement) {
    this.select(actionButton)
    this.onModeChanged(mode)
  }

  private select(actionButton?: HTMLElement) {
    this.rmvButton.removeClass('is-selected')
    this.edtButton.removeClass('is-selected')
    this.addButton.removeClass('is-selected')
    this.tglButton.removeClass('is-selected')
    actionButton && actionButton.addClass('is-selected')
  }
}
