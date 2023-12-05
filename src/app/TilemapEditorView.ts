import type { Tilemap } from 'types'
import React from 'react'
import ReactDOM from 'react-dom'
import { TilemapEditor } from 'components/TilemapEditor'
import { TilemapEditorBaseView } from 'app/TilemapEditorBaseView'
import { FileParser } from 'app/FileParser'

export class TilemapEditorView extends TilemapEditorBaseView {
  private rootElement?: HTMLElement
  private tilemap?: Tilemap
  private isEditMode: boolean = false
  private editTiles: boolean = false

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

  public onEditTiles(): void {
    this.editTiles = !this.editTiles
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
      const tilemapEditor = React.createElement(() =>
        TilemapEditor({ tilemap, isEditMode: this.isEditMode, editTiles: this.editTiles })
      )
      ReactDOM.render(tilemapEditor, rootElement)
    }
  }
}
