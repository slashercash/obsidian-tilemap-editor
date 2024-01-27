export default class ClickAction {
  static setElement = setElement
  static deleteElement = deleteElement
  static prepareTilemap = prepareTilemap
}

function setElement(tilemap: Element, className: string, rowIndex: number, cellIndex: number) {
  const cell = getCell(tilemap, rowIndex, cellIndex)
  if (cell) {
    const child = document.createElement('div')
    child.className = className
    cell.replaceChildren(child)
  }
}

function deleteElement(
  tilemap: Element,
  rowIndex: number,
  cellIndex: number,
  updateTilemapSize: (scrollDeltaTop: number, scrollDeltaLeft: number, newRows: ReadonlyArray<Element>) => void
): void {
  const cell = getCell(tilemap, rowIndex, cellIndex)
  if (!cell) {
    return
  }

  cell.replaceChildren()

  const isOnEdge =
    rowIndex === 0 ||
    cellIndex === 0 ||
    rowIndex === tilemap.children.length - 1 ||
    cellIndex === (tilemap.children[0]?.children.length ?? 0) - 1

  if (isOnEdge) {
    const [scrollDeltaLeft, scrollDeltaTop, newRows] = trimTilemap(tilemap)
    updateTilemapSize(scrollDeltaTop, scrollDeltaLeft, newRows)
  }
}

function getCell(tilemap: Element, rowIndex: number, cellIndex: number): Element | undefined {
  const row = tilemap.children[rowIndex]
  if (row) {
    return row.children[cellIndex]
  }
}

function prepareTilemap(
  tilemap: Element,
  offsetX: number,
  offsetY: number,
  updateTilemapSize: (scrollDeltaTop: number, scrollDeltaLeft: number, newRows: ReadonlyArray<Element>) => void
): [rowKey: number, cellKey: number] {
  const tilemapWidth = tilemap.children[0]?.children.length ?? 0
  const tilemapHeight = tilemap.children.length

  if (tilemapWidth === 0 && tilemapHeight === 0) {
    updateTilemapSize(-offsetY, -offsetX, [newRow(1)])
    return [0, 0]
  }

  const addHorizontally = getAddValue(offsetX, tilemapWidth)
  const addVertically = getAddValue(offsetY, tilemapHeight)

  if (addVertically != 0) {
    const newRows: ReadonlyArray<Element> = [...Array(Math.abs(addVertically))].map(() => newRow(tilemapWidth))
    const existingRows = Array.from(tilemap.children)
    if (addVertically < 0) {
      updateTilemapSize(-offsetY, 0, [...newRows, ...existingRows])
    } else {
      updateTilemapSize(0, 0, [...existingRows, ...newRows])
    }
  }

  if (addHorizontally != 0) {
    const newRows = Array.from(tilemap.children).map((existingRow) => {
      const newCells = [...Array(Math.abs(addHorizontally))].map(newCell)
      const existingCells = Array.from(existingRow.cloneNode(true).childNodes)
      const row = newRow()
      row.replaceChildren(...(addHorizontally < 0 ? [...newCells, ...existingCells] : [...existingCells, ...newCells]))
      return row
    })
    updateTilemapSize(0, addHorizontally < 0 ? -offsetX : 0, newRows)
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

export function trimTilemap(
  tilemap: Element
): [scrollDeltaLeft: number, scrollDeltaTop: number, newRows: ReadonlyArray<Element>] {
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

  return [-trim.left, -trim.top, newRows]
}

function newRow(cellsCount = 0): HTMLDivElement {
  const row = document.createElement('div')
  row.className = 'row'
  const newCells = [...Array(Math.abs(cellsCount))].map(newCell)
  row.replaceChildren(...newCells)
  return row
}

function newCell(): HTMLDivElement {
  const cell = document.createElement('div')
  cell.className = 'cell'
  return cell
}
