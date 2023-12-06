import type { TilemapMetadata } from 'types'
import { htmlToString } from 'helper/htmlToString'
import { FileCreator } from 'app/FileCreator'

export class FileParser {
  static stringToTilemap(fileContent: string): [HTMLElement, TilemapMetadata] {
    const metadataString = fileContent.substring(
      fileContent.indexOf('<metadata>') + 10,
      fileContent.indexOf('</metadata>')
    )
    const metadata: TilemapMetadata = JSON.parse(metadataString)

    const htmlDoc: Document = new DOMParser().parseFromString(fileContent, 'text/html')
    const tilemapElement = htmlDoc.getElementById('tilemap')

    if (tilemapElement === null) {
      throw new Error('could not read tilemap')
    }

    return [tilemapElement, metadata]
  }

  static tilemapToString(tilemap: HTMLElement, metadata: TilemapMetadata): string {
    const htmlString = htmlToString(tilemap)
    return FileCreator.appendMetadata(htmlString, metadata)
  }
}
