import { FileParser, type TilemapMetadata } from 'file/FileParser'
import { TilemapEditor } from 'TilemapEditor'
import { TilemapEditorBaseView } from 'TilemapEditorViewBase'

export class TilemapEditorView extends TilemapEditorBaseView {
  private rootElement?: HTMLElement
  private tilemapEditor?: TilemapEditor
  private tilemap?: Element
  private metadata?: TilemapMetadata

  public onLoaded(rootElement: HTMLElement): void {
    this.rootElement = rootElement
  }

  public onFileLoaded(fileContent: string): void {
    if (!this.rootElement) {
      // failed to load
      return
    }
    const [tilemap, customTiles] = FileParser.stringToTilemap(fileContent)
    this.tilemapEditor = new TilemapEditor(tilemap, customTiles)
    this.rootElement?.appendChild(this.tilemapEditor.root)
  }

  public onEditModeChanged(isEditMode: boolean): void {
    this.tilemapEditor?.setEditmode(isEditMode)
  }

  public onDeleteTiles(): void {
    this.tilemapEditor?.setDeleteMode()
  }

  public onEditTiles(): void {}

  public getContentToSave(): [success: boolean, content: string] {
    if (this.tilemap && this.metadata) {
      return [true, FileParser.tilemapToString(this.tilemap, this.metadata)]
    }
    return [false, '']
  }
}
