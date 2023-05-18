let newFile: string

import { htmlToString } from 'helper/htmlToString'
import { getRawStyle } from 'styles/tilemapRenderer'

export class FileCreator {
  static newFile(): string {
    if (!newFile) {
      const html = createHtmlTilemap()
      const file = htmlToString(html)
      newFile = this.appendStyle(file)
    }
    return newFile
  }
  static appendStyle(htmlFile: string): string {
    return htmlFile + getRawStyle()
  }
}

function createHtmlTilemap(): HTMLElement {
  const doc = new Document()

  const divTilemap = doc.createElement('div')
  divTilemap.setAttribute('id', 'tilemap')

  const main = doc.createElement('main')
  main.appendChild(divTilemap)

  const body = doc.createElement('body')
  body.appendChild(main)

  const html = doc.createElement('html')
  html.appendChild(body)

  return html
}
