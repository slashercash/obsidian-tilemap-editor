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
      enlargeTilemap(tilemap, offsetX, offsetY)
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
}

function getCell(tilemap: Tilemap, rowKey: number, cellKey: number): TilemapCell | undefined {
  const row = tilemap.rows[rowKey]
  if (row) {
    return row.cells[cellKey]
  }
}

function enlargeTilemap(tilemap: Tilemap, offsetX: number, offsetY: number): void {
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
