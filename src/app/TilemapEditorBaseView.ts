import { FileView, WorkspaceLeaf, Notice } from 'obsidian'

export const TILE_FILE_EXTENSIONS = ['html']
export const VIEW_TYPE_TILE = 'tile-view'

export abstract class TilemapEditorBaseView extends FileView {
  public allowNoFile: false

  private editAction_Element: HTMLElement
  private readAction_Element: HTMLElement
  private saveAction_Element: HTMLElement

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  abstract onLoaded(rootElement: HTMLElement): void
  abstract onUnloaded(): void
  abstract onFileLoaded(fileContent: string): void
  abstract onEditModeChanged(isEditMode: boolean): void
  abstract getContentToSave(): string

  public async onload(): Promise<void> {
    this.editAction_Element = this.addAction('pencil', 'Current view: reading\nClick to edit', () =>
      this.setIsEditMode(true)
    )
    this.readAction_Element = this.addAction('cross', 'Current view: editing\nClick to read', () =>
      this.setIsEditMode(false)
    )
    this.saveAction_Element = this.addAction('checkmark', 'Save', () => this.save())

    this.readAction_Element.hide()
    this.saveAction_Element.hide()

    const rootElement = this.containerEl.children[1] as HTMLElement
    rootElement.addClass('view-content-tilemap-editor')
    this.onLoaded(rootElement)
  }

  public async onLoadFile(): Promise<void> {
    const fileContent = await this.app.vault.read(this.file)
    this.onFileLoaded(fileContent)
  }

  public async onunload(): Promise<void> {
    this.editAction_Element.remove()
    this.readAction_Element.remove()
    this.saveAction_Element.remove()
    this.onUnloaded()
  }

  public getViewType(): string {
    return VIEW_TYPE_TILE
  }

  public getIcon(): string {
    return 'dice'
  }

  private setIsEditMode = (isEditMode: boolean): void => {
    if (isEditMode) {
      this.editAction_Element.hide()
      this.saveAction_Element.show()
      this.readAction_Element.show()
    } else {
      this.saveAction_Element.hide()
      this.readAction_Element.hide()
      this.editAction_Element.show()
    }
    this.onEditModeChanged(isEditMode)
  }

  private save = (): void => {
    const contentToSave = this.getContentToSave()
    this.app.vault.modify(this.file, contentToSave)
    new Notice('File saved')
  }
}
