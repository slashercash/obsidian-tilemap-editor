import type { TilemapMetadata } from 'TilemapEditorView'
import { FileCreator } from 'file/FileCreator'
import { htmlToString } from 'file/htmlToString'

export class FileParser {
  static stringToTilemap(fileContent: string): [Element, TilemapMetadata] {
    const metadataString = fileContent.substring(
      fileContent.indexOf('<metadata>') + 10,
      fileContent.indexOf('</metadata>')
    )
    const metadata: TilemapMetadata = JSON.parse(metadataString)

    const htmlDoc: Document = new DOMParser().parseFromString(fileContent, 'text/html')
    const tilemapElement = htmlDoc.getElementsByClassName('tilemap')[0]

    if (!tilemapElement) {
      throw new Error('could not read tilemap')
    }

    return [tilemapElement, metadata]
  }

  static tilemapToString(tilemap: Element, metadata: TilemapMetadata): string {
    const htmlString = htmlToString(tilemap)
    return FileCreator.appendMetadata(htmlString, metadata)
  }
}
