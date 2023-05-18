import type { FC, RefObject, ToolbarAction, Tilemap, TilemapRow, TilemapCell, TilemapElement } from 'types'
import { toolbarActions } from 'types/enums'
import React, { useRef, useState } from 'react'
import { Renderer } from 'components/Renderer'
import { Toolbar } from 'components/Toolbar'

type TilemapEditorProps = {
  tilemap: Tilemap
  isEditMode: boolean
}

export const TilemapEditor: FC<TilemapEditorProps> = ({ tilemap, isEditMode }) => {
  const tilemapRendererRef = useRef<HTMLDivElement>(null)
  const [internalTilemap, setInternalTilemap] = useState(tilemap)
  const [toolbarAction, setToolbarAction] = useState<ToolbarAction>(toolbarActions.tile)

  function onTilemapClicked(rowKey: number, cellKey: number) {
    if (isEditMode) {
      handle[toolbarAction](tilemap, rowKey, cellKey, tilemapRendererRef)
      setInternalTilemap({ ...tilemap })
    }
  }

  function onSpaceClicked(offsetX: number, offsetY: number): void {
    if (isEditMode && toolbarAction != toolbarActions.delete) {
      expandTilemap(tilemap, offsetX, offsetY, tilemapRendererRef)
      handle[toolbarAction](tilemap, Math.max(offsetY, 0), Math.max(offsetX, 0), tilemapRendererRef)
      setInternalTilemap({ ...tilemap })
    }
  }

  return (
    <div className={'tilemap-editor'}>
      <Renderer
        tilemapRendererRef={tilemapRendererRef}
        tilemap={internalTilemap}
        isEditMode={isEditMode}
        onTilemapClicked={onTilemapClicked}
        onSpaceClicked={onSpaceClicked}
      />
      {isEditMode && <Toolbar toolbarAction={toolbarAction} onToolbarActionChange={setToolbarAction} />}
    </div>
  )
}

type HandleFn = (
  tilemap: Tilemap,
  rowKey: number,
  cellKey: number,
  tilemapRendererRef: RefObject<HTMLDivElement>
) => void

const handle: { [Key in ToolbarAction]: HandleFn } = {
  tile: setElement({ className: 'tile' }),
  circle: setElement({ className: 'circle' }),
  delete: deleteElement
}

function setElement(element: TilemapElement): HandleFn {
  return (tilemap: Tilemap, rowKey: number, cellKey: number) => {
    const cell = getCell(tilemap, rowKey, cellKey)
    if (cell) {
      cell.elements = [element]
    }
  }
}

function deleteElement(
  tilemap: Tilemap,
  rowKey: number,
  cellKey: number,
  tilemapRendererRef: RefObject<HTMLDivElement>
): void {
  const cell = getCell(tilemap, rowKey, cellKey)
  if (cell) {
    cell.elements = []
  }

  const isOnEdge =
    rowKey === 0 ||
    cellKey === 0 ||
    rowKey === tilemap.rows.length - 1 ||
    cellKey === (tilemap.rows[0]?.cells.length ?? 0) - 1

  if (isOnEdge) {
    const [scrollX, scrollY] = trimTilemap(tilemap)
    if (!tilemapRendererRef.current) {
      return
    }
    if (scrollX > 0) {
      tilemapRendererRef.current.scrollLeft += scrollX * -30
    }
    if (scrollY > 0) {
      tilemapRendererRef.current.scrollTop += scrollY * -30
    }
  }
}

function getCell(tilemap: Tilemap, rowKey: number, cellKey: number): TilemapCell | undefined {
  const row = tilemap.rows[rowKey]
  if (row) {
    return row.cells[cellKey]
  }
}

function expandTilemap(
  tilemap: Tilemap,
  offsetX: number,
  offsetY: number,
  tilemapRendererRef: RefObject<HTMLDivElement>
): void {
  const tilemapWidth = tilemap.rows[0]?.cells.length ?? 0
  const tilemapHeight = tilemap.rows.length

  const addHorizontally = getAddValue(offsetX, tilemapWidth)
  const addVertically = getAddValue(offsetY, tilemapHeight)

  if (addVertically != 0) {
    const newRows: ReadonlyArray<TilemapRow> = [...Array(Math.abs(addVertically))].map(() => ({
      cells: [...Array(Math.abs(tilemapWidth))].map(() => ({ elements: [] }))
    }))
    tilemap.rows = addVertically < 0 ? [...newRows, ...tilemap.rows] : [...tilemap.rows, ...newRows]
  }

  if (addHorizontally != 0) {
    tilemap.rows = tilemap.rows.map((row) => {
      const newCells: Array<TilemapCell> = [...Array(Math.abs(addHorizontally))].map(() => ({ elements: [] }))
      return { cells: addHorizontally < 0 ? [...newCells, ...row.cells] : [...row.cells, ...newCells] }
    })
  }

  if (!tilemapRendererRef.current) {
    return
  }
  if (offsetX < 0) {
    tilemapRendererRef.current.scrollLeft += offsetX * -30
  }
  if (offsetY < 0) {
    tilemapRendererRef.current.scrollTop += offsetY * -30
  }
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

function trimTilemap(tilemap: Tilemap): [scrollX: number, scrollY: number] {
  const tilesCountVertical = tilemap.rows.length
  const tilesCountHorizontal = tilemap.rows[0]?.cells.length ?? 0

  const trim = tilemap.rows.reduce(
    (trim, row, rowIndex) => {
      const trimCells = row.cells.reduce(
        (trimCells, cell, cellIndex) => {
          if (cell.elements.length > 0) {
            trimCells.left = Math.min(trimCells.left, cellIndex)
            trimCells.right = Math.min(trimCells.right, row.cells.length - 1 - cellIndex)
          }
          return trimCells
        },
        { left: tilesCountHorizontal, right: tilesCountHorizontal }
      )
      if (trimCells.left < tilesCountHorizontal) {
        trim.top = Math.min(trim.top, rowIndex)
        trim.bottom = Math.min(trim.bottom, tilemap.rows.length - 1 - rowIndex)
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

  tilemap.rows = tilemap.rows.reduce<ReadonlyArray<TilemapRow>>((acc, row, i) => {
    if (trim.top <= i && tilesCountVertical - trim.bottom > i) {
      row.cells = row.cells.slice(trim.left, tilesCountHorizontal - trim.right)
      acc = [...acc, row]
    }
    return acc
  }, [])

  return [trim.left, trim.top]
}
