import { createElement } from 'func/createElement'

export type Tile = {
  id: number
  shape: string
  color: string
}

type TilemapMetadata = {
  customTiles: Array<Tile>
}

export default function parse(fileContent: string): { tilemap: Element; customTiles: Array<Tile> } {
  if (fileContent.trim().length === 0) {
    return {
      tilemap: createElement('div', { className: 'tilemap' }),
      customTiles: baseCustomTiles
    }
  }

  const metadata: TilemapMetadata = JSON.parse(
    fileContent.substring(fileContent.indexOf('<metadata>') + 10, fileContent.indexOf('</metadata>'))
  )

  const tilemap = new DOMParser()
    .parseFromString(
      // TODO: This can probably be simplified (also i think it does not work if two elements with space are on same line)
      fileContent.replace(/^\s+|\s+$/gm, '').replace(/(\r\n|\n|\r)/gm, ''),
      'text/html'
    )
    .getElementsByClassName('tilemap')[0]

  if (!tilemap) {
    throw new Error('could not read tilemap')
  }

  return { tilemap, customTiles: metadata.customTiles }
}

const baseCustomTiles: Array<Tile> = [
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
