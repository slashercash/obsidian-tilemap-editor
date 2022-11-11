import { Menu, MenuItem, Notice, Plugin } from 'obsidian'
import { TileView, VIEW_TYPE_TILE, TILE_FILE_EXTENSIONS } from './TileView'

export default class MyPlugin extends Plugin {
  async onload() {
    this.registerView(VIEW_TYPE_TILE, (leaf) => new TileView(leaf))

    this.registerEvent(
      this.app.workspace.on('file-menu', (menu: Menu) => {
        menu.addItem((item: MenuItem) => {
          item
            .setTitle('Create new Tilemap')
            .setIcon('dice')
            .onClick(() => new Notice('Not implemented'))
        })
      })
    )

    this.registerExtensions(TILE_FILE_EXTENSIONS, VIEW_TYPE_TILE)
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_TILE)
  }
}
