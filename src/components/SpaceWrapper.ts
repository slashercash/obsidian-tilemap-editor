import type { TilemapMetadata } from 'TilemapEditorView'
import { Space } from './Space'

export class SpaceWrapper {
  private readonly space: HTMLDivElement

  constructor(renderer: HTMLDivElement, tilesCountVertical: number, tilesCountHorizontal: number, tileSize: number) {
    const horizontal = renderer.getBoundingClientRect().width / tileSize
    const vertical = renderer.getBoundingClientRect().height / tileSize

    const overflowHorizontal = (horizontal % 1) * tileSize
    const overflowVertical = (vertical % 1) * tileSize

    const width = (Math.floor(horizontal) * 2 + tilesCountHorizontal) * tileSize
    const height = (Math.floor(vertical) * 2 + tilesCountVertical) * tileSize
    this.space = Space(width, height, overflowHorizontal, overflowVertical, tileSize, (x, y) => {})
    renderer.appendChild(this.space)
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
