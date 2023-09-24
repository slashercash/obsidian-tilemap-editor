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
    return appendMetadata(newFile)
  }
  static appendStyle(htmlFile: string): string {
    return htmlFile + getRawStyle()
  }
}

function appendMetadata(htmlFile: string) {
  const metadata = `
<!-- <metadata>
{
  "customTiles": [
    {
      "id": "00001",
      "shape": "square",
      "color": "blue"
    },
    {
      "id": "00002",
      "shape": "circle",
      "color": "red"
    }
  ]
}
</metadata> -->`
  return htmlFile + metadata
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
