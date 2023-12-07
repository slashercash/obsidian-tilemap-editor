import { TilemapEditor } from 'TilemapEditor'
import { TilemapEditorBaseView } from 'TilemapEditorViewBase'
import { FileParser } from 'FileParser'

export type TilemapMetadata = {
  customTiles: Array<TilemapMetadataCustomTile>
}

type TilemapMetadataCustomTile = {
  id: number
  shape: string
  color: string
}

export class TilemapEditorView extends TilemapEditorBaseView {
  private tilemapEditor = new TilemapEditor()
  private tilemap?: Element
  private metadata?: TilemapMetadata

  public onLoaded(rootElement: HTMLElement): void {
    this.tilemapEditor.asChildOf(rootElement)
  }

  public onFileLoaded(fileContent: string): void {
    const [tilemap, metadata] = FileParser.stringToTilemap(fileContent)
    this.tilemapEditor.setData(tilemap, metadata)
  }

  public onEditModeChanged(isEditMode: boolean): void {
    this.tilemapEditor.setEditmode(isEditMode)
  }

  public onEditTiles(): void {}

  public getContentToSave(): [success: boolean, content: string] {
    if (this.tilemap && this.metadata) {
      return [true, FileParser.tilemapToString(this.tilemap, this.metadata)]
    }
    return [false, '']
  }
}
