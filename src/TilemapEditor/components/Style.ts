import { createElement } from 'TilemapEditor/func/createElement'
import type { Tile } from 'TilemapEditor/func/parseFileContent'

// TODO: Outsource potential constants
const STYLE_ID = 'tilemap-editor-dynamic-style'

export default class Style {
  private style: HTMLStyleElement
  private zoomStyle?: string
  private tileStyle?: string

  constructor() {
    // TODO: Remove style tag on unload?
    const element = document.getElementById(STYLE_ID)
    if (element) {
      this.style = element as HTMLStyleElement
    } else {
      this.style = createElement('style', { id: STYLE_ID })
      document.head.appendChild(this.style)
    }
  }

  public setZoomStyle(width: number, height: number, tileSize: number): void {
    this.zoomStyle = `.view-content-tilemap-editor .tilemap-cell { 
  width:${tileSize}px;
  height:${tileSize}px;
}
.view-content-tilemap-editor .tilemap-space { 
  width:${width}px;
  height:${height}px;
}`

    this.style.setText(this.zoomStyle + '\n' + this.tileStyle)
  }

  public setTileStyle(customTiles: ReadonlyArray<Tile>): void {
    this.tileStyle = customTiles
      .map(
        (tile) => `.view-content-tilemap-editor .custom-tile-${tile.id} {
  background-color: ${tile.color};
  box-shadow: inset 0 0 0 1px black;${
    tile.shape == 'circle'
      ? `
  border-radius: 50%;`
      : ''
  }
}`
      )
      .join('\n')

    this.style.setText(this.zoomStyle + '\n' + this.tileStyle)
  }
}
