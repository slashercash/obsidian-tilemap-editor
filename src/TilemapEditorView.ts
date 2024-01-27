import { TilemapEditorBaseView } from 'TilemapEditorViewBase'
import TilemapEditor from 'TilemapEditor'

export class TilemapEditorView extends TilemapEditorBaseView {
  private rootElement?: HTMLElement
  private tilemapEditor?: TilemapEditor

  public onLoaded(rootElement: HTMLElement): void {
    this.rootElement = rootElement
  }

  public onFileLoaded(fileContent: string): void {
    if (!this.rootElement) {
      // failed to load
      return
    }

    this.tilemapEditor = new TilemapEditor(fileContent, (c) => this.save(c))
    this.tilemapEditor.root.hide()
    this.rootElement?.replaceChildren(this.tilemapEditor.root)

    // Setting zero-timeout before centerView() is necessary to give control to
    // the browser so it can draw the nodes and knows the dimensions to center
    setTimeout(() => {
      this.tilemapEditor?.root.show()
      this.tilemapEditor?.centerView()
    }, 0)
  }

  private save(content: string) {
    // TODO: handle this async function
    this.app.vault.modify(this.file, content)
  }
}
