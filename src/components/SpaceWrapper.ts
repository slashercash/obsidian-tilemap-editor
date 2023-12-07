import type { TilemapMetadata } from 'TilemapEditorView'
import { Space } from './Space'

export class SpaceWrapper {
  private readonly space: HTMLDivElement

  constructor(tilesCountVertical: number, tilesCountHorizontal: number, tileSize: number) {
    const width = tilesCountHorizontal * tileSize
    const height = tilesCountVertical * tileSize
    this.space = Space(width, height, 0, 0, tileSize, (x, y) => {})
    // space.appendChild(SpaceGrid(width, height, 0, 0, tileSize))
  }

  public asChildOf(parentElement: HTMLElement) {
    parentElement.appendChild(this.space)
  }

  public setData(tilemap: Element, metadata: TilemapMetadata) {
    const styleElement = document.createElement('style')
    styleElement.innerText = metadata.customTiles
      .map((tile) => {
        const className = `.view-content-tilemap-editor .custom-tile-${tile.id}`
        const borderRadius = tile.shape == 'circle' ? '\n  border-radius: 50%;' : ''
        return `${className} {
background-color: ${tile.color};
box-shadow: inset 0 0 0 1px black;${borderRadius}
}`
      })
      .join('\n')

    this.space.appendChild(tilemap)
    this.space.appendChild(styleElement)
  }
}
