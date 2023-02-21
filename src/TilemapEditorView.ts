import { WorkspaceLeaf, FileView, Notice } from 'obsidian'
import { createRoot, Root } from 'react-dom/client'
import Editor from './editor/Editor'
import { Tilemap, TilemapCell, TilemapElement, TilemapRow } from './types/tilemap'

export const TILE_FILE_EXTENSIONS = ['html']
export const VIEW_TYPE_TILE = 'tile-view'

export class TilemapEditorView extends FileView {
  allowNoFile: false

  private editAction_Element: HTMLElement
  private readAction_Element: HTMLElement
  private saveAction_Element: HTMLElement
  private isEditMode: boolean = false
  private tilemap: Tilemap
  private root: Root

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  getViewType(): string {
    return VIEW_TYPE_TILE
  }

  getIcon(): string {
    return 'dice'
  }

  renderEditor() {
    this.root.render(
      Editor({ tilemap: this.tilemap, isEditMode: this.isEditMode, onTilemapChanged: this.onTilemapChanged })
    )
  }

  setIsEditMode = (targetIsEditMode: boolean): void => {
    this.isEditMode = targetIsEditMode
    if (this.isEditMode) {
      this.editAction_Element.hide()
      this.saveAction_Element.show()
      this.readAction_Element.show()
    } else {
      this.saveAction_Element.hide()
      this.readAction_Element.hide()
      this.editAction_Element.show()
    }
    this.renderEditor()
  }

  onTilemapChanged = (tilemap: Tilemap): void => {
    this.tilemap = tilemap
    this.renderEditor()
  }

  async onload(): Promise<void> {
    this.root = createRoot(this.containerEl.children[1])

    this.editAction_Element = this.addAction('pencil', 'Current view: reading\nClick to edit', () =>
      this.setIsEditMode(true)
    )

    this.readAction_Element = this.addAction('cross', 'Current view: editing\nClick to read', () =>
      this.setIsEditMode(false)
    )

    this.saveAction_Element = this.addAction('checkmark', 'Save', () => {
      const newFileContent = parseFileContent(this.tilemap)
      this.app.vault.modify(this.file, newFileContent)
      new Notice('File saved')
    })

    this.readAction_Element.hide()
    this.saveAction_Element.hide()
  }

  async onLoadFile(): Promise<void> {
    const fileContent = await this.app.vault.read(this.file)
    this.tilemap = parseTilemap(fileContent)
    this.renderEditor()
  }

  async onunload(): Promise<void> {
    this.editAction_Element.remove()
    this.readAction_Element.remove()
    this.saveAction_Element.remove()
    this.root.unmount()
  }
}

function parseTilemap(view: string): Tilemap {
  const htmlDoc = new DOMParser().parseFromString(view, 'text/html')
  const tm = htmlDoc.getElementById('tilemap')

  if (tm === null) {
    throw new Error('could not read tilemap')
  }

  const rows: ReadonlyArray<TilemapRow> = Array.from(tm.children).map(parseRow)

  const tilemap: Tilemap = { rows }

  return tilemap
}

function parseRow(row: Element): TilemapRow {
  const cells: ReadonlyArray<TilemapCell> = Array.from(row.children).map(parseCell)
  return { cells }
}

function parseCell(cell: Element): TilemapCell {
  const elements: ReadonlyArray<TilemapElement> = Array.from(cell.children).map(parseElement)
  return { elements }
}

function parseElement(element: Element): TilemapElement {
  return {
    className: element.className
  }
}

function parseFileContent(tilemap: Tilemap): string {
  const htmlDoc = new Document()

  const html = htmlDoc.createElement('html')
  const body = htmlDoc.createElement('body')
  const style = htmlDoc.createElement('style')
  const main = htmlDoc.createElement('main')
  const div = htmlDoc.createElement('div')
  div.setAttribute('id', 'tilemap')

  style.appendText('')
  main.appendChild(div)
  body.appendChild(main)

  html.appendChild(style)
  html.appendChild(body)

  htmlDoc.appendChild(html)

  tilemap.rows.forEach((row) => {
    const rowElement = htmlDoc.createElement('div')
    rowElement.setAttribute('class', 'tilemap-row')

    row.cells.forEach((cell) => {
      const cellElement = htmlDoc.createElement('div')
      cellElement.setAttribute('class', 'tilemap-cell')
      cellElement.appendText('')

      cell.elements.forEach((element) => {
        const elementElement = htmlDoc.createElement('div')
        elementElement.setAttribute('class', element.className)
        elementElement.appendText('')

        cellElement.appendChild(elementElement)
      })
      rowElement.appendChild(cellElement)
    })
    div.appendChild(rowElement)
  })

  return format(htmlDoc.documentElement).innerHTML.replace('<style></style>', `<style>${cssStyle}</style>`)
}

const cssStyle = `
  main {
    display: flex;
    justify-content: center;
  }
  .tilemap-row {
    display: flex;
  }
  .tilemap-cell {
    display: grid;
    height: 30px;
    width: 30px;
    box-shadow: inset 0 0 0 1px lightgray;
  }
  .tilemap-cell > div {
    grid-row-start: 1;
    grid-column-start: 1;
  }
  .tile {
    background-color: rgb(93, 0, 255);
    box-shadow: inset 0 0 0 1px black;
  }
`

function format(node: Element, level: number = 0) {
  var indentBefore = new Array(level++ + 1).join('  '),
    indentAfter = new Array(level - 1).join('  '),
    textNode

  for (var i = 0; i < node.children.length; i++) {
    textNode = document.createTextNode('\n' + indentBefore)
    node.insertBefore(textNode, node.children[i])

    format(node.children[i], level)

    if (node.lastElementChild == node.children[i]) {
      textNode = document.createTextNode('\n' + indentAfter)
      node.appendChild(textNode)
    }
  }

  return node
}
