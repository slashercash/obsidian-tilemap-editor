import { WorkspaceLeaf, FileView, Notice } from 'obsidian'
import { createRoot, Root } from 'react-dom/client'
import Editor from './editor/Editor'
import { Tilemap } from './types/tilemap'
import { Parser } from './Parser'

export const TILE_FILE_EXTENSIONS = ['html']
export const VIEW_TYPE_TILE = 'tile-view'

export class TilemapEditorView extends FileView {
  allowNoFile: false

  private editAction_Element: HTMLElement
  private readAction_Element: HTMLElement
  private saveAction_Element: HTMLElement
  private isEditMode: boolean = false
  private tilemap: Tilemap
  private root: Root

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  getViewType(): string {
    return VIEW_TYPE_TILE
  }

  getIcon(): string {
    return 'dice'
  }

  renderEditor() {
    this.root.render(
      Editor({ tilemap: this.tilemap, isEditMode: this.isEditMode, onTilemapChanged: this.onTilemapChanged })
    )
  }

  setIsEditMode = (targetIsEditMode: boolean): void => {
    this.isEditMode = targetIsEditMode
    if (this.isEditMode) {
      this.editAction_Element.hide()
      this.saveAction_Element.show()
      this.readAction_Element.show()
    } else {
      this.saveAction_Element.hide()
      this.readAction_Element.hide()
      this.editAction_Element.show()
    }
    this.renderEditor()
  }

  onTilemapChanged = (tilemap: Tilemap): void => {
    this.tilemap = tilemap
    this.renderEditor()
  }

  async onload(): Promise<void> {
    this.root = createRoot(this.containerEl.children[1])

    this.editAction_Element = this.addAction('pencil', 'Current view: reading\nClick to edit', () =>
      this.setIsEditMode(true)
    )

    this.readAction_Element = this.addAction('cross', 'Current view: editing\nClick to read', () =>
      this.setIsEditMode(false)
    )

    this.saveAction_Element = this.addAction('checkmark', 'Save', () => {
      const newFileContent = Parser.tilemapToString(this.tilemap)
      this.app.vault.modify(this.file, newFileContent)
      new Notice('File saved')
    })

    this.readAction_Element.hide()
    this.saveAction_Element.hide()
  }

  async onLoadFile(): Promise<void> {
    const fileContent = await this.app.vault.read(this.file)
    this.tilemap = Parser.stringToTilemap(fileContent)
    this.renderEditor()
  }

  async onunload(): Promise<void> {
    this.editAction_Element.remove()
    this.readAction_Element.remove()
    this.saveAction_Element.remove()
    this.root.unmount()
  }
}
