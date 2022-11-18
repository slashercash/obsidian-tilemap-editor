import { WorkspaceLeaf, FileView, TFile, Notice } from 'obsidian'
import { createRoot, Root } from 'react-dom/client'
import Editor from './editor/Editor'

export const TILE_FILE_EXTENSIONS = ['html']
export const VIEW_TYPE_TILE = 'tile-view'

export class TilemapEditorView extends FileView {
  allowNoFile: false

  private editAction_Element: HTMLElement
  private readAction_Element: HTMLElement
  private saveAction_Element: HTMLElement
  private isEditMode: boolean = false
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
    this.root.render(Editor({ view: this.fileContent, isEditMode: this.isEditMode, onViewChanged: this.onViewChanged }))
  }

  onViewChanged = (newView: string): void => {
    this.fileContent = newView
    this.root.render(Editor({ view: this.fileContent, isEditMode: this.isEditMode, onViewChanged: this.onViewChanged }))
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
      this.app.vault.modify(this.file, this.fileContent)
    })

    this.readAction_Element.hide()
    this.saveAction_Element.hide()
  }

  async onLoadFile(): Promise<void> {
    this.fileContent = await this.app.vault.read(this.file)
    this.root.render(Editor({ view: this.fileContent, isEditMode: this.isEditMode, onViewChanged: this.onViewChanged }))
  }

  async onunload(): Promise<void> {
    this.editAction_Element.remove()
    this.readAction_Element.remove()
    this.saveAction_Element.remove()
    this.root.unmount()
  }
}
