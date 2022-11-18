import { WorkspaceLeaf, FileView, TFile, Notice } from 'obsidian'
import React from 'react'
import { createRoot, Root } from 'react-dom/client'

export const TILE_FILE_EXTENSIONS = ['html']
export const VIEW_TYPE_TILE = 'tile-view'

export class TileView extends FileView {
  allowNoFile: false

  private editToggleAction_Element: HTMLElement
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

  async onload(): Promise<void> {
    this.root = createRoot(this.containerEl.children[1])

    this.editToggleAction_Element = this.addAction(
      'pencil',
      'Current view: reading\nClick to edit',
      () => new Notice('Not implemented')
    )
  }

  async onLoadFile(file: TFile): Promise<void> {
    const fileContent = await this.app.vault.read(file)
    this.root.render(<Display fileContent={fileContent} />)
  }

  async onunload(): Promise<void> {
    this.editToggleAction_Element.remove()
    this.root.unmount()
  }
}

interface IDisplay {
  fileContent: string
}

const Display = ({ fileContent }: IDisplay) => <main dangerouslySetInnerHTML={{ __html: fileContent }} />
