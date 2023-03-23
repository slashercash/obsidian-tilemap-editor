import { Menu, MenuItem, Notice, Plugin } from 'obsidian'
import { VIEW_TYPE_TILE, TILE_FILE_EXTENSIONS } from './app/TilemapEditorBaseView'
import { TilemapEditorView } from './app/TilemapEditorView'

export default class TilemapEditorPlugin extends Plugin {
  async onload() {
    this.registerView(VIEW_TYPE_TILE, (leaf) => new TilemapEditorView(leaf))

    this.registerEvent(
      this.app.workspace.on('file-menu', (menu: Menu) => {
        menu.addItem((item: MenuItem) => {
          item
            .setTitle('New Tilemap')
            .setIcon('dice')
            .onClick(() => new Notice('Not implemented'))
        })
      })
    )

    this.registerExtensions(TILE_FILE_EXTENSIONS, VIEW_TYPE_TILE)

    const fileToOpen = this.app.vault.getFiles().find((f) => f.basename === 'prototype-V0')
    if (fileToOpen) this.app.workspace.getLeaf().openFile(fileToOpen)
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_TILE)
  }
}
