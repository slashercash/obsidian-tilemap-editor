let newFile: string

import { htmlToString } from 'helper/htmlToString'
import { getRawStyle } from 'styles/tilemapRenderer'

export class FileCreator {
  static newFile(): string {
    if (!newFile) {
      const html = createHtmlTilemap(6, 6)
      const file = htmlToString(html)
      newFile = this.appendStyle(file)
    }
    return newFile
  }
  static appendStyle(htmlFile: string): string {
    return htmlFile + getRawStyle()
  }
}

function createHtmlTilemap(columnCnt: number, rowCnt: number): HTMLElement {
  const doc = new Document()

  const divTilemapCell = doc.createElement('div')
  divTilemapCell.setAttribute('class', 'tilemap-cell')
  divTilemapCell.appendText('')

  const divTilemapRow = doc.createElement('div')
  divTilemapRow.setAttribute('class', 'tilemap-row')
  divTilemapRow.appendChild(divTilemapCell)

  for (let column = 1; column < columnCnt; column++) {
    divTilemapCell.after(divTilemapCell.cloneNode(true))
  }

  const divTilemap = doc.createElement('div')
  divTilemap.setAttribute('id', 'tilemap')
  divTilemap.appendChild(divTilemapRow)

  for (let row = 1; row < rowCnt; row++) {
    divTilemapRow.after(divTilemapRow.cloneNode(true))
  }

  const main = doc.createElement('main')
  main.appendChild(divTilemap)

  const body = doc.createElement('body')
  body.appendChild(main)

  const html = doc.createElement('html')
  html.appendChild(body)

  return html
}
