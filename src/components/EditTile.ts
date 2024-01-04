export default class EditTile {
  public readonly root = createElement('div', 'tilemap-toolbar-edit-tile')

  constructor() {
    this.root.append(...createEditTilesContent())
  }

  public show = () => this.root.show()
  public hide = () => this.root.hide()
}

function createEditTilesContent(): ReadonlyArray<HTMLElement> {
  const labelShape = document.createElement('label')
  labelShape.innerText = 'Shape:'
  const labelColor = document.createElement('label')
  labelColor.innerText = 'Color:'

  const selectShape = createSelectElement('square', ['square', 'circle'])
  const selectColor = createSelectElement('red', ['red', 'blue'])

  const deleteButton = document.createElement('button')
  deleteButton.onclick = () => console.log('DELETE')
  deleteButton.innerText = 'Delete Tile'

  return [labelShape, selectShape, labelColor, selectColor, deleteButton]
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

function createElement(tagName: keyof HTMLElementTagNameMap, className: string): HTMLElement {
  const element = document.createElement(tagName)
  element.className = className
  return element
}
