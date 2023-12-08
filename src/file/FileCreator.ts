let newFile: string

import type { TilemapMetadata } from 'TilemapEditorView'
import { htmlToString } from 'file/htmlToString'

export class FileCreator {
  static newFile(): string {
    if (!newFile) {
      const html = createHtmlTilemap()
      const file = htmlToString(html)
      newFile = this.appendMetadata(file, baseMetadata)
    }
    return newFile
  }
  static appendMetadata(htmlFile: string, metadata: TilemapMetadata) {
    return (
      htmlFile +
      metadataToStyle(metadata) +
      `
<!-- <metadata>
${JSON.stringify(metadata, undefined, 2)}
</metadata> -->`
    )
  }
}

function metadataToStyle(metadata: TilemapMetadata): string {
  const css = metadata.customTiles
    .map((tile) => {
      const className = `  .custom-tile-${tile.id}`
      const borderRadius = tile.shape == 'circle' ? '\n    border-radius: 50%;' : ''
      return `${className} {
    background-color: ${tile.color};
    box-shadow: inset 0 0 0 1px black;${borderRadius}
  }`
    })
    .join('\n')

  return `
<style>
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
  }
${css}
</style>
`
}

const baseMetadata: TilemapMetadata = {
  customTiles: [
    {
      id: 0,
      shape: 'square',
      color: 'blue'
    },
    {
      id: 1,
      shape: 'circle',
      color: 'red'
    }
  ]
}

function createHtmlTilemap(): HTMLElement {
  const doc = new Document()

  const divTilemap = doc.createElement('div')
  divTilemap.className = 'tilemap'

  const main = doc.createElement('main')
  main.appendChild(divTilemap)

  const body = doc.createElement('body')
  body.appendChild(main)

  const html = doc.createElement('html')
  html.appendChild(body)

  return html
}
