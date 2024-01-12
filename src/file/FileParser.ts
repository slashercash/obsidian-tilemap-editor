// TODO: Remove this if possible or make private
export type TilemapMetadata = {
  customTiles: Array<Tile>
}

export type Tile = {
  id: number
  shape: string
  color: string
}

export class FileParser {
  static stringToTilemap(fileContent: string): [Element, Array<Tile>] {
    const metadataString = fileContent.substring(
      fileContent.indexOf('<metadata>') + 10,
      fileContent.indexOf('</metadata>')
    )
    const metadata: TilemapMetadata = JSON.parse(metadataString)

    const htmlDoc: Document = new DOMParser().parseFromString(
      // TODO: This can probably be simplified (also i think it does not work if two elements with space are on same line)
      fileContent.replace(/^\s+|\s+$/gm, '').replace(/(\r\n|\n|\r)/gm, ''),
      'text/html'
    )

    const tilemapElement = htmlDoc.getElementsByClassName('tilemap')[0]

    if (!tilemapElement) {
      throw new Error('could not read tilemap')
    }

    return [tilemapElement, metadata.customTiles]
  }
}
