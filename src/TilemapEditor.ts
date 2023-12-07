import type { TilemapMetadata } from 'TilemapEditorView'
import { Renderer } from 'components/Renderer'
import { Toolbar } from 'components/Toolbar'

export class TilemapEditor {
  private readonly tilemapEditor: HTMLElement
  private readonly toolbar: Toolbar
  private readonly renderer: Renderer

  constructor(rootElement: HTMLElement) {
    this.tilemapEditor = document.createElement('div')
    this.tilemapEditor.className = 'tilemap-editor'
    this.toolbar = new Toolbar(this.tilemapEditor)
    this.renderer = new Renderer(this.tilemapEditor)
    rootElement.appendChild(this.tilemapEditor)
  }

  public setData(tilemap: Element, metadata: TilemapMetadata) {}

  public setEditmode(isEditMode: boolean) {
    isEditMode ? this.toolbar.show() : this.toolbar.hide()
  }
}
