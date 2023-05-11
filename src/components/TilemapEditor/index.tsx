import type { FC, ToolbarAction, Tilemap, TilemapRow, TilemapCell, TilemapElement } from 'types'
import { toolbarActions } from 'types/enums'
import React, { useState } from 'react'
import { Renderer } from 'components/Renderer'
import { Toolbar } from 'components/Toolbar'

type TilemapEditorProps = {
  tilemap: Tilemap
  isEditMode: boolean
}

export const TilemapEditor: FC<TilemapEditorProps> = ({ tilemap, isEditMode }) => {
  const [internalTilemap, setInternalTilemap] = useState(tilemap)
  const [toolbarAction, setToolbarAction] = useState<ToolbarAction>(toolbarActions.tile)

  function onTilemapClicked(rowKey: number, cellKey: number) {
    if (isEditMode) {
      handle[toolbarAction](tilemap, rowKey, cellKey)
      setInternalTilemap({ ...tilemap })
    }
  }

  function onSpaceClicked(offsetX: number, offsetY: number): void {
    if (isEditMode) {
      expandTilemap(tilemap, offsetX, offsetY)
      handle[toolbarAction](tilemap, Math.max(offsetY, 0), Math.max(offsetX, 0))
      setInternalTilemap({ ...tilemap })
    }
  }

  return (
    <div className={'tilemap-editor'}>
      <Renderer
        tilemap={internalTilemap}
        isEditMode={isEditMode}
        onTilemapClicked={onTilemapClicked}
        onSpaceClicked={onSpaceClicked}
      />
      {isEditMode && <Toolbar toolbarAction={toolbarAction} onToolbarActionChange={setToolbarAction} />}
    </div>
  )
}

type HandleFn = (tilemap: Tilemap, rowKey: number, cellKey: number) => void

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

function deleteElement(tilemap: Tilemap, rowKey: number, cellKey: number): void {
  const cell = getCell(tilemap, rowKey, cellKey)
  if (cell) {
    cell.elements = []
  }
  const tilesCountVertical = tilemap.rows.length
  const tilesCountHorizontal = tilemap.rows[0]?.cells.length ?? 0
  const isOnEdge =
    rowKey === 0 || cellKey === 0 || rowKey + 1 === tilesCountVertical || cellKey + 1 === tilesCountHorizontal

  if (isOnEdge) {
    trimTilemap(tilemap)
  }
}

function getCell(tilemap: Tilemap, rowKey: number, cellKey: number): TilemapCell | undefined {
  const row = tilemap.rows[rowKey]
  if (row) {
    return row.cells[cellKey]
  }
}

function expandTilemap(tilemap: Tilemap, offsetX: number, offsetY: number): void {
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

type TrimValue = {
  top: number
  right: number
  bottom: number
  left: number
}

function trimTilemap(tilemap: Tilemap): void {
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

  console.log(trim)
}
