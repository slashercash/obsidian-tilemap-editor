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

  private tglButton = createElement('button', { className: 'toolbar-button', innerText: '▼' })
  private edtButton = createElement('button', { className: 'toolbar-button', innerText: '⚙' })
  private rmvButton = createElement('button', { className: 'toolbar-button', innerText: '➖' })
  private addButton = createElement('button', { className: 'toolbar-button', innerText: '➕' })

  constructor(tiles: Array<Tile>, onTileClick: (t: Tile) => void, private onModeChanged: (mode: Mode) => void) {
    this.tileButtonContainer = new TileButtonContainer(tiles, onTileClick)

    this.rmvButton.onclick = () => this.changeMode('removeTile', this.rmvButton)
    this.edtButton.onclick = () => {
      this.edtButton.hide()
      this.rmvButton.hide()
      this.addButton.style.visibility = 'hidden'
      this.mode = 'editTile'
      this.onModeChanged(this.mode)
    }
    this.addButton.onclick = () => this.changeMode('addTile', this.addButton)
    this.tglButton.onclick = () => {
      if (this.mode === 'navigate') {
        this.select(this.addButton)
        this.tglButton.innerText = '▲'
        this.mode = 'addTile'
        this.bar.show()
      } else if (this.mode === 'editTile') {
        this.mode = 'addTile'
        this.edtButton.show()
        this.rmvButton.show()
        this.addButton.style.visibility = 'unset'
      } else {
        this.select(undefined)
        this.tglButton.innerText = '▼'
        this.mode = 'navigate'
        this.bar.hide()
      }
      onModeChanged(this.mode)
    }

    this.bar.append(this.edtButton, this.tileButtonContainer.root, this.rmvButton, this.addButton)
    this.bar.hide()

    this.root.append(this.tglButton, this.bar)
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
    this.rmvButton.removeClass('toolbar-button--selected')
    this.edtButton.removeClass('toolbar-button--selected')
    this.addButton.removeClass('toolbar-button--selected')
    this.tglButton.removeClass('toolbar-button--selected')
    actionButton && actionButton.addClass('toolbar-button--selected')
  }
}
