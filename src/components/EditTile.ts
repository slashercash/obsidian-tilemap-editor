import type { Tile } from 'file/FileParser'
import { createElement } from 'utils'

export default class EditTile {
  public readonly root = createElement('div', { className: 'tilemap-toolbar-edit-tile' })

  private readonly selectShape: HTMLSelectElement
  private readonly selectColor: HTMLSelectElement

  private tile?: Tile

  constructor(onEdit: (tile: Tile) => void) {
    this.selectShape = createSelectElement(
      ['square', 'circle'],
      (shape) => this.tile && onEdit({ ...this.tile, shape })
    )
    this.selectColor = createSelectElement(['red', 'blue'], (color) => this.tile && onEdit({ ...this.tile, color }))

    this.root.append(
      createElement('label', { innerText: 'Shape:' }),
      this.selectShape,
      createElement('label', { innerText: 'Color:' }),
      this.selectColor,
      createElement('button', { innerText: 'Create Tile', onclick: () => console.log('CREATE'), className: 'green' }),
      createElement('button', { innerText: 'Delete Tile', onclick: () => console.log('DELETE'), className: 'red' })
    )
  }

  public show = () => this.root.show()
  public hide = () => this.root.hide()

  public set(tile: Tile) {
    this.tile = tile
    this.selectShape.value = tile.shape
    this.selectColor.value = tile.color
  }
}

function createSelectElement(options: ReadonlyArray<string>, onSelect: (value: string) => void): HTMLSelectElement {
  return createElement('select', {
    onchange: ({ target }) => target instanceof HTMLSelectElement && onSelect(target.value),
    childrenToAppend: options.map((option) => createElement('option', { innerText: option, value: option }))
  })
}
