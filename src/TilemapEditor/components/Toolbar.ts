import type { Mode } from 'TilemapEditor'
import type { Tile } from 'TilemapEditor/func/parseFileContent'
import { createElement } from 'TilemapEditor/func/createElement'
import TileButtonContainer from './TileButtonContainer'

export default class Toolbar {
  public readonly root = createElement('div', { className: 'toolbar-container' })

  private readonly toolbar = createElement('div', { className: 'toolbar' })
  private readonly toolbarLeft = createElement('div', { className: 'toolbar-side' })
  private readonly toolbarRight = createElement('div', { className: 'toolbar-side' })
  private readonly toolbarCenter = createElement('div', { className: 'toolbar-center' })
  private readonly btnHidden = createElement('button', { className: 'hidden' })

  private tileButtonContainer: TileButtonContainer
  private mode: Mode = 'navigate'
  // private bar = createElement('div', { className: 'toolbar-bar' })

  // TOOLTIPS:
  // Remove Tiles
  // Edit Tiles
  // Add Tiles
  // Close Toolbar

  // private tglButton = createElement('button', { className: 'toolbar-button', innerText: '▼' })
  private edtButton = createElement('button', { innerText: '⚙' })
  private rmvButton = createElement('button', { innerText: '➖' })
  private addButton = createElement('button', { innerText: '➕' })

  constructor(tiles: Array<Tile>, onTileClick: (t: Tile) => void, private onModeChanged: (mode: Mode) => void) {
    this.tileButtonContainer = new TileButtonContainer(tiles, onTileClick)

    this.rmvButton.onclick = () => this.changeMode('removeTile', this.rmvButton)
    this.edtButton.onclick = () => {
      if (this.mode === 'editTile') {
        this.mode = 'addTile'
      } else {
        this.mode = 'editTile'
      }
      this.onModeChanged(this.mode)
    }
    this.addButton.onclick = () => this.changeMode('addTile', this.addButton)

    this.toolbarLeft.append(this.btnHidden, this.edtButton)
    this.toolbarCenter.append(this.tileButtonContainer.root)
    this.toolbarRight.append(this.rmvButton, this.addButton)
    this.toolbar.append(this.toolbarLeft, this.toolbarCenter, this.toolbarRight)
    this.root.append(this.toolbar)
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
    this.rmvButton.removeClass('selected')
    this.edtButton.removeClass('selected')
    this.addButton.removeClass('selected')
    // this.tglButton.removeClass('selected')
    actionButton && actionButton.addClass('selected')
  }
}
