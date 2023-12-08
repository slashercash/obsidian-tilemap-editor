import { TilemapEditor } from 'TilemapEditor'
import { TilemapEditorBaseView } from 'TilemapEditorViewBase'
import { FileParser } from 'file/FileParser'

export type TilemapMetadata = {
  customTiles: Array<TilemapMetadataCustomTile>
}

type TilemapMetadataCustomTile = {
  id: number
  shape: string
  color: string
}

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
    const [tilemap, metadata] = FileParser.stringToTilemap(fileContent)
    this.tilemapEditor = new TilemapEditor(tilemap, metadata)
    this.rootElement?.appendChild(this.tilemapEditor.root())
  }

  public onEditModeChanged(isEditMode: boolean): void {
    this.tilemapEditor?.setEditmode(isEditMode)
  }

  public onEditTiles(): void {}

  public getContentToSave(): [success: boolean, content: string] {
    if (this.tilemap && this.metadata) {
      return [true, FileParser.tilemapToString(this.tilemap, this.metadata)]
    }
    return [false, '']
  }
}
