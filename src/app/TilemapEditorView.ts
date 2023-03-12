import { createRoot, Root } from 'react-dom/client'
import { TilemapEditor } from 'src/components/TilemapEditor'
import { Tilemap } from 'src/types/tilemap'
import { TilemapEditorBaseView } from './TilemapEditorBaseView'
import { FileParser } from './FileParser'

export class TilemapEditorView extends TilemapEditorBaseView {
  private reactRoot?: Root
  private tilemap?: Tilemap
  private isEditMode: boolean = false

  public onLoaded(rootElement: HTMLElement): void {
    this.reactRoot = createRoot(rootElement)
  }

  public onUnloaded(): void {
    this.reactRoot?.unmount()
  }

  public onFileLoaded(fileContent: string): void {
    this.tilemap = FileParser.stringToTilemap(fileContent)
    this.renderTilemapEditor()
  }

  public onEditModeChanged(isEditMode: boolean): void {
    this.isEditMode = isEditMode
    this.renderTilemapEditor()
  }

  public getContentToSave(): [success: boolean, content: string] {
    if (this.tilemap) {
      return [true, FileParser.tilemapToString(this.tilemap)]
    }
    return [false, '']
  }

  private onTilemapChanged = (tilemap: Tilemap): void => {
    this.tilemap = tilemap
    this.renderTilemapEditor()
  }

  private renderTilemapEditor() {
    if (this.tilemap && this.reactRoot) {
      const tilemapEditor = TilemapEditor({
        tilemap: this.tilemap,
        isEditMode: this.isEditMode,
        onTilemapChanged: this.onTilemapChanged
      })
      // console.log('render tilemapEditor')
      this.reactRoot?.render(tilemapEditor)
    }
  }
}
