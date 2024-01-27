import { FileCreator } from 'file/FileCreator'
import { FileParser, type Tile } from 'file/FileParser'
import { htmlToString } from 'file/htmlToString'

// TODO: Is this the right name?
export default class FileHandler {
  public tilemapStr: string
  public customTilesStr: string

  constructor(tilemap: Element, customTiles: Array<Tile>) {
    this.tilemapStr = htmlToString(tilemap)
    this.customTilesStr = FileCreator.metaDataToStr({ customTiles })
  }

  public setTilemap(t: Element): void {
    this.tilemapStr = htmlToString(t)
  }

  public setCustomTiles(c: Array<Tile>): void {
    this.customTilesStr = FileCreator.metaDataToStr({ customTiles: c })
  }

  public getContent(): string {
    return this.tilemapStr + '\n' + this.customTilesStr
  }
}
