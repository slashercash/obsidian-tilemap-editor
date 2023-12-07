import type { TilemapMetadata } from 'types'
import React from 'react'
import ReactDOM from 'react-dom'
import { TilemapEditor } from 'components/TilemapEditor'
import { TilemapEditorBaseView } from 'app/TilemapEditorViewBase'
import { FileParser } from 'app/FileParser'

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
    this.rootElement && ReactDOM.unmountComponentAtNode(this.rootElement)
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
      const tilemapEditor = React.createElement(() =>
        TilemapEditor({ tilemap, metadata, isEditMode: this.isEditMode, editTiles: this.editTiles })
      )
      ReactDOM.render(tilemapEditor, rootElement)
    }
  }
}
