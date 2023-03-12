import { Tilemap, TilemapCell, TilemapElement, TilemapRow } from 'src/types/tilemap'

export class FileParser {
  static stringToTilemap(fileContent: string): Tilemap {
    const htmlDoc: Document = new DOMParser().parseFromString(fileContent, 'text/html')
    const tilemapElement = htmlDoc.getElementById('tilemap')

    if (tilemapElement === null) {
      throw new Error('could not read tilemap')
    }

    return { rows: Array.from(tilemapElement.children).map(parseRow) }
  }

  static tilemapToString(tilemap: Tilemap): string {
    const html = tilemapToHtml(tilemap)

    const htmlString = htmlToString(html)

    return htmlString.replace('<style></style>', `<style>${cssStyle}</style>`)
  }
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

function tilemapToHtml(tilemap: Tilemap): HTMLElement {
  const doc = new Document()

  const div = tilemapToDiv(doc, tilemap)
  const html = divToHtml(doc, div)

  return html
}

function tilemapToDiv(doc: Document, tilemap: Tilemap): HTMLDivElement {
  const div: HTMLDivElement = doc.createElement('div')
  div.setAttribute('id', 'tilemap')

  tilemap.rows.forEach((row) => {
    const rowElement = doc.createElement('div')
    rowElement.setAttribute('class', 'tilemap-row')

    row.cells.forEach((cell) => {
      const cellElement = doc.createElement('div')
      cellElement.setAttribute('class', 'tilemap-cell')
      cellElement.appendText('')

      cell.elements.forEach((element) => {
        const elementElement = doc.createElement('div')
        elementElement.setAttribute('class', element.className)
        elementElement.appendText('')

        cellElement.appendChild(elementElement)
      })
      rowElement.appendChild(cellElement)
    })
    div.appendChild(rowElement)
  })

  return div
}

function divToHtml(doc: Document, div: HTMLDivElement): HTMLHtmlElement {
  const html = doc.createElement('html')
  const body = doc.createElement('body')
  const main = doc.createElement('main')
  const style = doc.createElement('style')
  style.appendText('')

  main.appendChild(div)
  body.appendChild(main)
  html.appendChild(body)
  html.appendChild(style)

  return html
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

function htmlToString(html: HTMLElement): string {
  return format(html).innerHTML
}

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
