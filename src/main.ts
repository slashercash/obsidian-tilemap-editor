import { Menu, MenuItem, Plugin, TAbstractFile, TFile, TFolder } from 'obsidian'
import { VIEW_TYPE_TILE, TILE_FILE_EXTENSION } from 'app/TilemapEditorViewBase'
import { TilemapEditorView } from 'app/TilemapEditorView'
import { FileCreator } from 'app/FileCreator'

export default class TilemapEditorPlugin extends Plugin {
  async onload() {
    this.registerView(VIEW_TYPE_TILE, (leaf) => new TilemapEditorView(leaf))

    this.registerEvent(
      this.app.workspace.on('file-menu', (menu: Menu, folder: TAbstractFile) => {
        if (folder instanceof TFolder) {
          menu.addItem((item: MenuItem) => {
            item
              .setTitle('New Tilemap')
              .setIcon('dice')
              .onClick(() => this.app.vault.create(getPath(folder), FileCreator.newFile()))
          })
        }
      })
    )

    this.registerExtensions([TILE_FILE_EXTENSION], VIEW_TYPE_TILE)

    const fileToOpen = this.app.vault.getFiles().find((f) => f.name === 'Untitled.tile')
    if (fileToOpen) this.app.workspace.getLeaf().openFile(fileToOpen)
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_TILE)
  }
}

function getPath(folder: TFolder) {
  const existingFilenames = folder.children.reduce<Array<string>>((acc, child) => {
    if (child instanceof TFile && child.extension === TILE_FILE_EXTENSION) {
      acc.push(child.basename)
    }
    return acc
  }, [])

  const filenameBase = 'Untitled'
  let filename = filenameBase
  let count = 1

  while (count) {
    if (existingFilenames.contains(filename)) {
      filename = `${filenameBase} ${count}`
      count++
    } else {
      count = 0
    }
  }

  return `${folder.path}/${filename}.${TILE_FILE_EXTENSION}`
}
