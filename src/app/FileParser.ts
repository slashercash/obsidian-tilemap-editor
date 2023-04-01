import { Tilemap, TilemapCell, TilemapElement, TilemapRow } from 'src/types/tilemap'
import { htmlToString } from 'src/helper/htmlToString'
import { FileCreator } from './FileCreator'

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
    return FileCreator.appendStyle(htmlString)
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

  main.appendChild(div)
  body.appendChild(main)
  html.appendChild(body)

  return html
}
