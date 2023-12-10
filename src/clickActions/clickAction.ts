export default class ClickAction {
  static setElement = setElement
  static deleteElement = deleteElement
  static prepareTilemap = prepareTilemap
}

function setElement(tilemap: Element, className: string, rowKey: number, cellKey: number) {
  const cell = getCell(tilemap, rowKey, cellKey)
  if (cell) {
    const child = document.createElement('div')
    child.className = className
    cell.replaceChildren(child)
  }
}

function deleteElement(
  tilemap: Element,
  renderer: HTMLElement,
  rowKey: number,
  cellKey: number,
  tileSize: number
): void {
  const cell = getCell(tilemap, rowKey, cellKey)
  if (!cell) {
    return
  }

  cell.replaceChildren()

  const isOnEdge =
    rowKey === 0 ||
    cellKey === 0 ||
    rowKey === tilemap.children.length - 1 ||
    cellKey === (tilemap.children[0]?.children.length ?? 0) - 1

  if (isOnEdge) {
    const [scrollX, scrollY] = trimTilemap(tilemap)
    if (scrollX > 0) {
      renderer.scrollLeft += scrollX * -tileSize
    }
    if (scrollY > 0) {
      renderer.scrollTop += scrollY * -tileSize
    }
  }
}

function getCell(tilemap: Element, rowKey: number, cellKey: number): Element | undefined {
  const row = tilemap.children[rowKey]
  if (row) {
    return row.children[cellKey]
  }
}

function prepareTilemap(
  tilemap: Element,
  renderer: HTMLElement,
  offsetX: number,
  offsetY: number,
  tileSize: number
): [rowKey: number, cellKey: number] {
  const tilemapWidth = tilemap.children[0]?.children.length ?? 0
  const tilemapHeight = tilemap.children.length

  if (tilemapWidth === 0 && tilemapHeight === 0) {
    tilemap.replaceChildren(newRow(1))
    renderer.scrollLeft += offsetX * -tileSize
    renderer.scrollTop += offsetY * -tileSize
    return [0, 0]
  }

  const addHorizontally = getAddValue(offsetX, tilemapWidth)
  const addVertically = getAddValue(offsetY, tilemapHeight)

  if (addVertically != 0) {
    const newRows: ReadonlyArray<Element> = [...Array(Math.abs(addVertically))].map(() => newRow(tilemapWidth))
    const prefScrollTop = renderer.scrollTop
    if (addVertically < 0) {
      tilemap.prepend(...newRows)
      renderer.scrollTop = prefScrollTop - offsetY * tileSize
    } else {
      tilemap.append(...newRows)
      renderer.scrollTop = prefScrollTop
    }
  }

  if (addHorizontally != 0) {
    const newRows = Array.from(tilemap.children).map((existingRow) => {
      const newCells = [...Array(Math.abs(addHorizontally))].map(newCell)
      const existingCells = Array.from(existingRow.children)
      const row = newRow()
      row.replaceChildren(...(addHorizontally < 0 ? [...newCells, ...existingCells] : [...existingCells, ...newCells]))
      return row
    })
    tilemap.replaceChildren(...newRows)
  }

  if (offsetX < 0) {
    renderer.scrollLeft += offsetX * -tileSize
  }

  return [Math.max(offsetY, 0), Math.max(offsetX, 0)]
}

function getAddValue(offset: number, distance: number): number {
  if (offset < 0) {
    return offset
  }
  if (offset >= distance) {
    return offset - distance + 1
  }
  return 0
}

export function trimTilemap(tilemap: Element): [scrollX: number, scrollY: number] {
  const tilesCountVertical = tilemap.children.length
  const tilesCountHorizontal = tilemap.children[0]?.children.length ?? 0

  const trim = Array.from(tilemap.children).reduce(
    (trim, row, rowIndex) => {
      const trimCells = Array.from(row.children).reduce(
        (trimCells, cell, cellIndex) => {
          if (cell.children.length > 0) {
            trimCells.left = Math.min(trimCells.left, cellIndex)
            trimCells.right = Math.min(trimCells.right, row.children.length - 1 - cellIndex)
          }
          return trimCells
        },
        { left: tilesCountHorizontal, right: tilesCountHorizontal }
      )
      if (trimCells.left < tilesCountHorizontal) {
        trim.top = Math.min(trim.top, rowIndex)
        trim.bottom = Math.min(trim.bottom, tilemap.children.length - 1 - rowIndex)
      }
      trim.right = Math.min(trim.right, trimCells.right)
      trim.left = Math.min(trim.left, trimCells.left)
      return trim
    },
    {
      top: tilesCountVertical,
      right: tilesCountHorizontal,
      bottom: tilesCountVertical,
      left: tilesCountHorizontal
    }
  )

  const newRows = Array.from(tilemap.children).reduce<ReadonlyArray<Element>>((acc, row, i) => {
    if (trim.top <= i && tilesCountVertical - trim.bottom > i) {
      const newCells = Array.from(row.children).slice(trim.left, tilesCountHorizontal - trim.right)
      row.replaceChildren(...newCells)
      acc = [...acc, row]
    }
    return acc
  }, [])

  tilemap.replaceChildren(...newRows)
  return [trim.left, trim.top]
}

function newRow(cellsCount = 0): HTMLDivElement {
  const row = document.createElement('div')
  row.className = 'tilemap-row'
  const newCells = [...Array(Math.abs(cellsCount))].map(newCell)
  row.replaceChildren(...newCells)
  return row
}

function newCell(): HTMLDivElement {
  const cell = document.createElement('div')
  cell.className = 'tilemap-cell'
  return cell
}
