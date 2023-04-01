let newFile: string

import { htmlToString } from 'helper/htmlToString'

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
    return htmlFile + cssStyle
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

const cssStyle = `<style>
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
  .circle {
    border-radius: 50%;
    background-color: rgb(184, 32, 32);
    box-shadow: inset 0 0 0 1px black;
  }
</style>
`
