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
  private rootElement?: HTMLElement
  private tilemap?: Element
  private metadata?: TilemapMetadata
  private isEditMode: boolean = false
  private editTiles: boolean = false

  public onLoaded(rootElement: HTMLElement): void {
    this.rootElement = rootElement
  }

  public onUnloaded(): void {
    // this.rootElement && ReactDOM.unmountComponentAtNode(this.rootElement)
  }

  public onFileLoaded(fileContent: string): void {
    const [tilemap, metadata] = FileParser.stringToTilemap(fileContent)
    this.tilemap = tilemap
    this.metadata = metadata
    this.renderTilemapEditor()
  }

  public onEditModeChanged(isEditMode: boolean): void {
    this.isEditMode = isEditMode
    this.renderTilemapEditor()
  }

  public onEditTiles(): void {
    this.editTiles = !this.editTiles
    this.renderTilemapEditor()
  }

  public getContentToSave(): [success: boolean, content: string] {
    if (this.tilemap && this.metadata) {
      return [true, FileParser.tilemapToString(this.tilemap, this.metadata)]
    }
    return [false, '']
  }

  private renderTilemapEditor() {
    const tilemap = this.tilemap
    const metadata = this.metadata
    const rootElement = this.rootElement
    if (tilemap && metadata && rootElement) {
      const tilemapEditor = TilemapEditor()
      rootElement.replaceChildren(tilemapEditor)

      // const tilemapEditor = React.createElement(() =>
      //   TilemapEditor({ tilemap, metadata, isEditMode: this.isEditMode, editTiles: this.editTiles })
      // )
      // ReactDOM.render(tilemapEditor, rootElement)
    }
  }
}
