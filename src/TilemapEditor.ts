import type { TilemapMetadata } from 'TilemapEditorView'
import { Renderer } from 'components/Renderer'
import { SpaceWrapper } from 'components/SpaceWrapper'
import { Toolbar } from 'components/Toolbar'

export class TilemapEditor {
  private readonly tilemapEditor: HTMLElement
  private readonly toolbar = new Toolbar()
  private readonly renderer = new Renderer()

  constructor() {
    this.tilemapEditor = document.createElement('div')
    this.tilemapEditor.className = 'tilemap-editor'
    this.toolbar.asChildOf(this.tilemapEditor)
    this.renderer.asChildOf(this.tilemapEditor)
  }

  public asChildOf(parentElement: HTMLElement) {
    parentElement.appendChild(this.tilemapEditor)
  }

  public setData(tilemap: Element, metadata: TilemapMetadata) {
    const tileSize = 30

    const space = new SpaceWrapper(
      this.renderer.renderer,
      tilemap.children.length,
      tilemap.children[0]?.children.length ?? 0,
      tileSize
    )
    space.setData(tilemap, metadata)
  }

  public setEditmode(isEditMode: boolean) {
    isEditMode ? this.toolbar.show() : this.toolbar.hide()
  }
}
