import type { TilemapMetadata } from 'TilemapEditorView'

export class TilemapEditor {
  readonly tilemapEditor: HTMLElement

  constructor(rootElement: HTMLElement) {
    this.tilemapEditor = document.createElement('div')
    this.tilemapEditor.className = 'tilemap-editor'
    this.tilemapEditor.innerText = 'Hello World\nEdit mode is off'
    rootElement.appendChild(this.tilemapEditor)
  }

  public setData(tilemap: Element, metadata: TilemapMetadata) {}

  public setIsEditmode(isEditMode: boolean) {
    this.tilemapEditor.innerText = 'Hello World\nEdit mode is ' + (isEditMode ? 'on' : 'off')
  }
}
