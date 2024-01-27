import { type Tile } from 'TilemapEditor/func/parseFileContent'

// TODO: Is this the right name?
export default class FileHandler {
  private tilemapStr: string
  private styleStr: string
  private metadataStr: string

  constructor(tilemap: Element, customTiles: Array<Tile>) {
    this.tilemapStr = toTilemapStr(tilemap)
    this.styleStr = toCustomTilesStyle(customTiles)
    this.metadataStr = this.metadataStr = JSON.stringify({ customTiles }, undefined, 2)
  }

  public setTilemap(t: Element): void {
    this.tilemapStr = toTilemapStr(t)
  }

  public setCustomTiles(customTiles: Array<Tile>): void {
    this.styleStr = toCustomTilesStyle(customTiles)
    this.metadataStr = this.metadataStr = JSON.stringify({ customTiles }, undefined, 2)
  }

  // TODO: improve style so open as html uses full space
  public getContent(): string {
    return `<html>
  <head>
    <style>
      main {
        display: flex;
        justify-content: center;
      }
      .row {
        display: flex;
      }
      .cell {
        display: grid;
        height: 30px;
        width: 30px;
      }
${this.styleStr}
    </style>
  </head>
  <body>
${this.tilemapStr}
  </body>
</html>

<!-- <metadata>
${this.metadataStr}
</metadata> -->
`
  }
}

function toTilemapStr(html: Element): string {
  return format(html.cloneNode(true) as Element).outerHTML
}

// TODO: fix intent
function format(node: Element, level: number = 1): Element {
  var indentBefore = new Array(level++ + 1).join('  '),
    indentAfter = new Array(level - 1).join('  '),
    textNode

  for (var i = 0; i < node.children.length; i++) {
    textNode = document.createTextNode('\n' + indentBefore)
    node.insertBefore(textNode, node.children[i] ?? null)

    const child = node.children[i]
    if (child !== undefined) {
      format(child, level)
    }

    if (node.lastElementChild == node.children[i]) {
      textNode = document.createTextNode('\n' + indentAfter)
      node.appendChild(textNode)
    }
  }

  return node
}

// TODO: This may be duplicated code
function toCustomTilesStyle(customTiles: Array<Tile>): string {
  return customTiles
    .map(
      (tile) => `      .tile-${tile.id} {
        background-color: ${tile.color};
        box-shadow: inset 0 0 0 1px black;${
          tile.shape == 'circle'
            ? `
        border-radius: 50%;`
            : ''
        }
      }`
    )
    .join('\n')
}
