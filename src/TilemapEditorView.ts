import { TilemapEditorBaseView } from './TilemapEditorBaseView'
import { Tilemap } from './types/tilemap'
import { Parser } from './Parser'
import { Editor } from './editor/Editor'
import { createRoot, Root } from 'react-dom/client'

export class TilemapEditorView extends TilemapEditorBaseView {
  private reactRoot: Root
  private tilemap: Tilemap
  private isEditMode: boolean = false

  public onLoaded(rootElement: HTMLElement): void {
    this.reactRoot = createRoot(rootElement)
  }

  public onUnloaded(): void {
    this.reactRoot.unmount()
  }

  public onFileLoaded(fileContent: string): void {
    this.tilemap = Parser.stringToTilemap(fileContent)
    this.renderEditor()
  }

  public onEditModeChanged(isEditMode: boolean): void {
    this.isEditMode = isEditMode
    this.renderEditor()
  }

  public getContentToSave(): string {
    return Parser.tilemapToString(this.tilemap)
  }

  private onTilemapChanged = (tilemap: Tilemap): void => {
    this.tilemap = tilemap
    this.renderEditor()
  }

  private renderEditor() {
    this.reactRoot.render(
      Editor({ tilemap: this.tilemap, isEditMode: this.isEditMode, onTilemapChanged: this.onTilemapChanged })
    )
  }
}
