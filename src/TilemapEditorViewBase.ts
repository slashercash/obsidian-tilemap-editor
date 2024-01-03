import { FileView, WorkspaceLeaf, Notice } from 'obsidian'

export const TILE_FILE_EXTENSION = 'tile'
export const VIEW_TYPE_TILE = 'tile-view'

export type Mode = 'navigate' | 'addTile' | 'removeTile' | 'editTile'

export abstract class TilemapEditorBaseView extends FileView {
  public allowNoFile = false

  // ICONS: https://lucide.dev/icons/
  private rmvButton = this.addAction('x-square', 'Remove Tiles', () => this.changeMode('removeTile', this.rmvButton))
  private edtButton = this.addAction('pen-square', 'Edit Tiles', () => this.changeMode('editTile', this.edtButton))
  private addButton = this.addAction('square', 'Add Tiles', () => this.changeMode('addTile', this.addButton))
  private navButton = this.addAction('mouse-pointer-2', 'Navigate', () => this.changeMode('navigate', this.navButton))

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
    this.navButton.addClass('is-active')
  }

  abstract onLoaded(rootElement: HTMLElement): void
  abstract onFileLoaded(fileContent: string): void
  abstract onModeChanged(mode: Mode): void
  abstract getContentToSave(): [success: boolean, content: string]

  public async onload(): Promise<void> {
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
    this.rmvButton.remove()
    this.edtButton.remove()
    this.addButton.remove()
    this.navButton.remove()
    this.showMobileNavBar()
  }

  public getViewType(): string {
    return VIEW_TYPE_TILE
  }

  public getIcon(): string {
    return 'dice'
  }

  private changeMode(mode: Mode, actionButton: HTMLElement) {
    this.rmvButton.removeClass('is-active')
    this.edtButton.removeClass('is-active')
    this.addButton.removeClass('is-active')
    this.navButton.removeClass('is-active')
    actionButton.addClass('is-active')
    this.onModeChanged(mode)
  }

  private save(): void {
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
