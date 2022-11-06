import { Menu, MenuItem, Notice, Plugin } from 'obsidian'
import { ExampleView, VIEW_TYPE_EXAMPLE } from './ExampleView'

export default class MyPlugin extends Plugin {
  async onload() {
    this.addRibbonIcon('dice', 'Open example view', async () => {
      this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE)

      await this.app.workspace.getRightLeaf(false).setViewState({
        type: VIEW_TYPE_EXAMPLE,
        active: true
      })

      this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0])
    })

    this.registerView(VIEW_TYPE_EXAMPLE, (leaf) => new ExampleView(leaf))

    this.registerEvent(this.app.workspace.on('file-menu', fileMenuHandlerCreateNewTilemap))
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE)
  }
}

const fileMenuHandlerCreateNewTilemap = (menu: Menu) => {
  menu.addItem((item: MenuItem) => {
    item
      .setTitle('Create new Tilemap')
      .setIcon('dice')
      .onClick(() => new Notice('Not yet implemented'))
  })
}
