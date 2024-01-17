import { FileParser, type Tile } from 'file/FileParser'
import { TilemapEditorBaseView, type Mode } from 'TilemapEditorViewBase'
import { TilemapEditor } from 'TilemapEditor'
import { htmlToString } from 'file/htmlToString'
import { FileCreator } from 'file/FileCreator'

export class TilemapEditorView extends TilemapEditorBaseView {
  private rootElement?: HTMLElement
  private tilemapEditor?: TilemapEditor

  public onLoaded(rootElement: HTMLElement): void {
    this.rootElement = rootElement
  }

  public onFileLoaded(fileContent: string): void {
    if (!this.rootElement) {
      // failed to load
      return
    }

    // TODO: Move all this logic to file-handler
    let tilemapStr: string | undefined = undefined
    let customTilesStr: string | undefined = undefined

    function onTilemapChanged(tm: Element, save: (c: string) => void) {
      tilemapStr = htmlToString(tm)
      const content = tilemapStr + '\n' + customTilesStr
      save(content)
    }

    function onCustomTilesChanged(ct: Array<Tile>, save: (c: string) => void) {
      customTilesStr = FileCreator.metaDataToStr({ customTiles: ct })
      const content = tilemapStr + '\n' + customTilesStr
      save(content)
    }

    const [tilemap, customTiles] = FileParser.stringToTilemap(fileContent)
    tilemapStr = htmlToString(tilemap)
    customTilesStr = FileCreator.metaDataToStr({ customTiles })

    // TODO: Pass file-content-string into Tilemapeditor
    this.tilemapEditor = new TilemapEditor(
      tilemap,
      customTiles,
      (x) => onTilemapChanged(x, (c) => this.save(c)),
      (x) => onCustomTilesChanged(x, (c) => this.save(c))
    )
    this.rootElement?.appendChild(this.tilemapEditor.root)
  }

  public onModeChanged(mode: Mode) {
    this.tilemapEditor?.onModeChanged(mode)
  }

  private save(content: string) {
    // TODO: handle this async function
    this.app.vault.modify(this.file, content)
  }
}
