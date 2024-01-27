import { FileView, WorkspaceLeaf } from 'obsidian'

export const TILE_FILE_EXTENSION = 'tile'
export const VIEW_TYPE_TILE = 'tile-view'

export abstract class TilemapEditorBaseView extends FileView {
  public allowNoFile = false

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  abstract onLoaded(rootElement: HTMLElement): void
  abstract onFileLoaded(fileContent: string): void

  public async onload(): Promise<void> {
    const rootElement = this.containerEl.children[1] as HTMLElement
    rootElement.addClass('view-content--tilemap-editor')

    this.hideMobileNavBar()
    this.onLoaded(rootElement)
  }

  public async onLoadFile(): Promise<void> {
    const fileContent = await this.app.vault.read(this.file)
    this.onFileLoaded(fileContent)
  }

  public async onunload(): Promise<void> {
    this.showMobileNavBar()
  }

  public getViewType(): string {
    return VIEW_TYPE_TILE
  }

  public getIcon(): string {
    return 'dice'
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
