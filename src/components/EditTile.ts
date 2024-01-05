import type { Tile } from 'file/FileParser'
import { createElement } from 'utils'

export default class EditTile {
  public readonly root = createElement('div', { className: 'tilemap-toolbar-edit-tile' })

  private readonly selectShape = createSelectElement('square', ['square', 'circle'])
  private readonly selectColor = createSelectElement('red', ['red', 'blue'])

  constructor() {
    this.root.append(
      createElement('label', { innerText: 'Shape:' }),
      this.selectShape,
      createElement('label', { innerText: 'Color:' }),
      this.selectColor,
      createElement('button', { innerText: 'Delete Tile', onclick: () => console.log('DELETE') })
    )
  }

  public show = () => this.root.show()
  public hide = () => this.root.hide()

  public set(tile: Tile) {
    this.selectShape.value = tile.shape
    this.selectColor.value = tile.color
  }
}

function createSelectElement(value: string, options: ReadonlyArray<string>): HTMLSelectElement {
  return createElement('select', {
    onchange: ({ target }) => target instanceof HTMLSelectElement && console.log(target.value),
    childrenToAppend: options.map((option) => createElement('option', { innerText: option, value: option })),
    value
  })
}
