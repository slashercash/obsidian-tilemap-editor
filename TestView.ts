import { WorkspaceLeaf, FileView, TFile, Notice } from 'obsidian'

export const HTML_FILE_EXTENSIONS = ['html', 'htm']
export const VIEW_TYPE_HTML = 'html-view-2'

export class TestView extends FileView {
  allowNoFile: false

  private linkAction_Element: HTMLElement

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  getViewType() {
    return VIEW_TYPE_HTML
  }

  getIcon() {
    return 'dice'
  }

  async onLoadFile(file: TFile): Promise<void> {
    this.linkAction_Element = this.addAction(
      'pencil',
      'Current view: reading\nClick to edit',
      (ev) => new Notice('Not implemented')
    )
  }

  async onUnloadFile(file: TFile): Promise<void> {
    this.linkAction_Element.remove()
  }
}
