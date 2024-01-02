export default class Style {
  static zoomStyle(tilesCountX: number, tilesCountY: number, tileSize: number, rendererRectangle: DOMRect): string {
    const spaceTilesCountX = Math.floor(rendererRectangle.width / tileSize)
    const spaceTilesCountY = Math.floor(rendererRectangle.height / tileSize)
    const setbackX = tileSize - (rendererRectangle.width % tileSize)
    const setbackY = tileSize - (rendererRectangle.height % tileSize)

    const width = (tilesCountX + spaceTilesCountX * 2) * tileSize - 2 * setbackX
    const height = (tilesCountY + spaceTilesCountY * 2) * tileSize - 2 * setbackY

    return `.view-content-tilemap-editor .tilemap-cell { width:${tileSize}px;height:${tileSize}px; }
  .view-content-tilemap-editor .tilemap-space { width:${width}px;height:${height}px; }`
  }
}
