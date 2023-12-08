import type { TilemapMetadata } from 'TilemapEditorView'
import { Space } from './Space'

export class SpaceWrapper {
  private readonly space: Space

  constructor(renderer: HTMLDivElement, tilesCountVertical: number, tilesCountHorizontal: number, tileSize: number) {
    const horizontal = renderer.getBoundingClientRect().width / tileSize
    const vertical = renderer.getBoundingClientRect().height / tileSize

    const overflowHorizontal = (horizontal % 1) * tileSize
    const overflowVertical = (vertical % 1) * tileSize

    const width = (Math.floor(horizontal) * 2 + tilesCountHorizontal) * tileSize
    const height = (Math.floor(vertical) * 2 + tilesCountVertical) * tileSize
    this.space = new Space(renderer)
    this.space.setStyle(width, height, tileSize - overflowHorizontal, tileSize - overflowVertical)

    const obs = new ResizeObserver(([entry]) => {
      if (entry) {
        const horizontal = entry.contentRect.width / tileSize
        const vertical = entry.contentRect.height / tileSize

        const overflowHorizontal = (horizontal % 1) * tileSize
        const overflowVertical = (vertical % 1) * tileSize

        const width = (Math.floor(horizontal) * 2 + tilesCountHorizontal) * tileSize
        const height = (Math.floor(vertical) * 2 + tilesCountVertical) * tileSize
        this.space.setStyle(width, height, tileSize - overflowHorizontal, tileSize - overflowVertical)
      }
    })
    obs.observe(renderer)
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

    this.space.append(...[tilemap, styleElement])
  }
}
