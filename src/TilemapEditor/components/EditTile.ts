import type { Tile } from 'TilemapEditor/func/parseFileContent'
import { createElement } from 'TilemapEditor/func/createElement'

export default class EditTile {
  public readonly root = createElement('div', { className: 'customizer-container' })

  private readonly customizer = createElement('div', { className: 'customizer' })
  private readonly selectShape: HTMLSelectElement
  private readonly selectColor: HTMLSelectElement

  constructor(onEdit: (tile: Tile) => void, onCreate: () => void, onDelete: () => void) {
    this.selectShape = createSelectElement(['square', 'circle'], () => {
      onEdit({ id: -1, color: this.selectColor.value, shape: this.selectShape.value })
    })
    this.selectColor = createSelectElement(['red', 'blue'], () => {
      onEdit({ id: -1, color: this.selectColor.value, shape: this.selectShape.value })
    })

    this.customizer.append(
      createElement('label', { innerText: 'Shape:' }),
      this.selectShape,
      createElement('label', { innerText: 'Color:' }),
      this.selectColor,
      createElement('button', {
        innerText: 'Create Tile',
        onclick: () => onCreate(),
        className: 'create'
      }),
      createElement('button', {
        innerText: 'Delete Tile',
        onclick: () => onDelete(),
        className: 'delete'
      })
    )

    this.root.append(this.customizer)
  }

  public show = () => {} // this.root.show()
  public hide = () => {} //this.root.hide()

  public set(tile: Tile) {
    this.selectShape.value = tile.shape
    this.selectColor.value = tile.color
  }
}

function createSelectElement(options: ReadonlyArray<string>, onChange: () => void): HTMLSelectElement {
  const element = createElement('select', { onchange: onChange })
  element.append(...options.map((option) => createElement('option', { innerText: option, value: option })))
  return element
}
