import type { TilemapMetadata } from 'TilemapEditorView'
import { Renderer } from 'components/Renderer'
import { SpaceWrapper } from 'components/SpaceWrapper'
import { Toolbar } from 'components/Toolbar'

export class TilemapEditor {
  private readonly tilemapEditor: HTMLElement
  private readonly toolbar = new Toolbar()
  private readonly renderer = new Renderer()
  private readonly space = new SpaceWrapper(30, 30, 30)

  constructor() {
    this.tilemapEditor = document.createElement('div')
    this.tilemapEditor.className = 'tilemap-editor'
    this.toolbar.asChildOf(this.tilemapEditor)
    this.renderer.asChildOf(this.tilemapEditor)
    this.space.asChildOf(this.renderer.renderer)
  }

  public asChildOf(parentElement: HTMLElement) {
    parentElement.appendChild(this.tilemapEditor)
  }

  public setData(tilemap: Element, metadata: TilemapMetadata) {
    this.space.setData(tilemap, metadata)
  }

  public setEditmode(isEditMode: boolean) {
    isEditMode ? this.toolbar.show() : this.toolbar.hide()
  }
}
