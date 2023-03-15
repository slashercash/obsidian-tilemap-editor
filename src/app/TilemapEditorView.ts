import React from 'react'
import ReactDOM from 'react-dom'
import { TilemapEditor } from 'src/components/TilemapEditor'
import { Tilemap } from 'src/types/tilemap'
import { TilemapEditorBaseView } from './TilemapEditorBaseView'
import { FileParser } from './FileParser'

export class TilemapEditorView extends TilemapEditorBaseView {
  private rootElement?: HTMLElement
  private tilemap?: Tilemap
  private isEditMode: boolean = false

  public onLoaded(rootElement: HTMLElement): void {
    this.rootElement = rootElement
  }

  public onUnloaded(): void {
    this.rootElement && ReactDOM.unmountComponentAtNode(this.rootElement)
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

  private renderTilemapEditor() {
    const tilemap = this.tilemap
    const rootElement = this.rootElement
    if (tilemap && rootElement) {
      const tilemapEditor = React.createElement(() => TilemapEditor({ tilemap, isEditMode: this.isEditMode }))
      ReactDOM.render(tilemapEditor, rootElement)
    }
  }
}
