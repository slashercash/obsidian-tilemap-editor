import { WorkspaceLeaf, FileView, TFile, Notice, setIcon } from 'obsidian'
import { createRoot, Root } from 'react-dom/client'
import Editor from './editor/Editor'

export const TILE_FILE_EXTENSIONS = ['html']
export const VIEW_TYPE_TILE = 'tile-view'

export class TilemapEditorView extends FileView {
  allowNoFile: false

  private editAction_Element: HTMLElement
  private readAction_Element: HTMLElement
  private isEditMode: boolean = true
  private fileContent: string

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

  setIsEditMode(targetIsEditMode: boolean): void {
    this.isEditMode = targetIsEditMode
    if (this.isEditMode) {
      this.editAction_Element.hide()
      this.readAction_Element.show()
    } else {
      this.readAction_Element.hide()
      this.editAction_Element.show()
    }
    this.root.render(Editor({ fileContent: this.fileContent, isEditMode: this.isEditMode }))
  }

  async onload(): Promise<void> {
    this.root = createRoot(this.containerEl.children[1])

    this.editAction_Element = this.addAction('pencil', 'Current view: reading\nClick to edit', () =>
      this.setIsEditMode(true)
    )

    this.readAction_Element = this.addAction('checkmark', 'Current view: editing\nClick to read', () =>
      this.setIsEditMode(false)
    )

    this.readAction_Element.hide()
  }

  async onLoadFile(file: TFile): Promise<void> {
    this.fileContent = await this.app.vault.read(file)
    this.root.render(Editor({ fileContent: this.fileContent, isEditMode: this.isEditMode }))
  }

  async onunload(): Promise<void> {
    this.editAction_Element.remove()
    this.readAction_Element.remove()
    this.root.unmount()
  }
}
