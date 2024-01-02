import { FileView, WorkspaceLeaf, Notice } from 'obsidian'

export const TILE_FILE_EXTENSION = 'tile'
export const VIEW_TYPE_TILE = 'tile-view'

export abstract class TilemapEditorBaseView extends FileView {
  public allowNoFile = false

  private editAction_Element?: HTMLElement
  private readAction_Element?: HTMLElement
  private saveAction_Element?: HTMLElement
  private editTilesAction_Element?: HTMLElement

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  abstract onLoaded(rootElement: HTMLElement): void
  abstract onFileLoaded(fileContent: string): void
  abstract onEditModeChanged(isEditMode: boolean): void
  abstract onEditTiles(): void
  abstract onDeleteTiles(): void
  abstract getContentToSave(): [success: boolean, content: string]

  public async onload(): Promise<void> {
    this.editAction_Element = this.addAction('pencil', 'Current view: reading\nClick to edit', () =>
      this.setIsEditMode(true)
    )
    this.readAction_Element = this.addAction('cross', 'Current view: editing\nClick to read', () =>
      this.setIsEditMode(false)
    )
    this.saveAction_Element = this.addAction('checkmark', 'Save', () => this.save())
    this.editTilesAction_Element = this.addAction('edit', 'Edit Tiles', () => this.onEditTiles())
    this.addAction('trash', 'Delete Tiles', () => {
      this.setIsEditMode(false)
      this.onDeleteTiles()
    })

    this.readAction_Element.hide()
    this.saveAction_Element.hide()
    this.editTilesAction_Element.hide()

    const rootElement = this.containerEl.children[1] as HTMLElement
    rootElement.addClass('view-content-tilemap-editor')

    this.hideMobileNavBar()
    this.onLoaded(rootElement)
  }

  public async onLoadFile(): Promise<void> {
    const fileContent = await this.app.vault.read(this.file)
    this.onFileLoaded(fileContent)
  }

  public async onunload(): Promise<void> {
    this.editAction_Element?.remove()
    this.readAction_Element?.remove()
    this.saveAction_Element?.remove()
    this.editTilesAction_Element?.remove()
    this.showMobileNavBar()
  }

  public getViewType(): string {
    return VIEW_TYPE_TILE
  }

  public getIcon(): string {
    return 'dice'
  }

  private setIsEditMode = (isEditMode: boolean): void => {
    if (isEditMode) {
      this.editAction_Element?.hide()
      this.saveAction_Element?.show()
      this.readAction_Element?.show()
      this.editTilesAction_Element?.show()
    } else {
      this.saveAction_Element?.hide()
      this.readAction_Element?.hide()
      this.editAction_Element?.show()
      this.editTilesAction_Element?.hide()
    }
    this.onEditModeChanged(isEditMode)
  }

  private save = (): void => {
    const [success, content] = this.getContentToSave()
    if (success) {
      this.app.vault.modify(this.file, content)
      new Notice('File saved')
    } else {
      new Notice('Error while saving')
    }
  }

  private hideMobileNavBar() {
    const mobileNavbar = document.getElementsByClassName('mobile-navbar')[0]
    if (mobileNavbar && mobileNavbar instanceof HTMLElement) {
      mobileNavbar.style.display = 'none'
    }
  }

  private showMobileNavBar() {
    const mobileNavbar = document.getElementsByClassName('mobile-navbar')[0]
    if (mobileNavbar && mobileNavbar instanceof HTMLElement) {
      mobileNavbar.style.display = 'unset'
    }
  }
}
