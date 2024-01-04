import type { Tile } from 'file/FileParser'

export default class EditTile {
  public readonly root = document.createElement('div')

  private readonly selectShape = createSelectElement('square', ['square', 'circle'])
  private readonly selectColor = createSelectElement('red', ['red', 'blue'])

  constructor() {
    this.root.className = 'tilemap-toolbar-edit-tile'
    const labelShape = document.createElement('label')
    labelShape.innerText = 'Shape:'
    const labelColor = document.createElement('label')
    labelColor.innerText = 'Color:'
    const deleteButton = document.createElement('button')
    deleteButton.onclick = () => console.log('DELETE')
    deleteButton.innerText = 'Delete Tile'

    this.root.append(labelShape, this.selectShape, labelColor, this.selectColor, deleteButton)
  }

  public show = () => this.root.show()
  public hide = () => this.root.hide()

  public set(tile: Tile) {
    this.selectShape.value = tile.shape
    this.selectColor.value = tile.color
  }
}

function createSelectElement(value: string, options: ReadonlyArray<string>): HTMLSelectElement {
  const optionElements = options.map((option) => {
    const optionElement = document.createElement('option')
    optionElement.value = option
    optionElement.innerText = option
    return optionElement
  })
  const selectElement = document.createElement('select')
  selectElement.value = value
  selectElement.onchange = ({ target }) => target instanceof HTMLSelectElement && console.log(target.value)
  selectElement.append(...optionElements)
  return selectElement
}
