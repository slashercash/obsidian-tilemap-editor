import type {
  CSSProperties,
  FC,
  RefObject,
  Tilemap,
  TilemapCell,
  TilemapElement,
  TilemapMetadataCustomTile,
  TilemapRow,
  ToolbarAction
} from 'types'
import React, { useReducer, useState } from 'react'
import { cn } from 'helper/className'
import EditTileSheet from './EditTileSheet'

type ToolbarProps = {
  children: FC<{
    styleMap: Map<string, CSSProperties>
    onTilemapClicked: (rowKey: number, cellKey: number, tileSize: number) => void
    onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => void
  }>
  isEditMode: boolean
  tilemapRendererRef: RefObject<HTMLDivElement>
  tilemap: Tilemap
}

export const Toolbar: FC<ToolbarProps> = ({ children, isEditMode, tilemapRendererRef, tilemap }) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const [selectedActionIndex, setSelectedActionIndex] = useState(0)
  const [editTile, setEditTile] = useState<TilemapMetadataCustomTile | null>(null)

  const classesAndStyles = tilemap.metadata.customTiles.map(getClassAndStyle)
  const actions: Array<ToolbarAction> = classesAndStyles.map(([className, styleProps]) => ({
    type: 'add',
    className,
    styleProps
  }))
  actions.push({ type: 'delete' })

  const actionButtons = actions.map((action, i) => (
    <ActionButton
      key={i}
      selected={i === selectedActionIndex}
      toolbarAction={action}
      onClick={() => {
        setSelectedActionIndex(i)
        if (editTile) setEditTile(tilemap.metadata.customTiles[i] ?? null)
      }}
      onClickRight={() => {
        setSelectedActionIndex(i)
        setEditTile(tilemap.metadata.customTiles[i] ?? null)
      }}
    />
  ))

  function onTilemapClicked(rowKey: number, cellKey: number, tileSize: number) {
    if (isEditMode) {
      const action = actions[selectedActionIndex]
      if (action) {
        handle(action, tilemap, rowKey, cellKey, tilemapRendererRef, tileSize)
        forceUpdate()
      }
    }
  }

  function onSpaceClicked(offsetX: number, offsetY: number, tileSize: number): void {
    if (isEditMode) {
      const action = actions[selectedActionIndex]
      if (action && action.type != 'delete') {
        const [rowKey, cellKey] = expandTilemap(tilemap, offsetX, offsetY, tilemapRendererRef, tileSize)
        handle(action, tilemap, rowKey, cellKey, tilemapRendererRef, tileSize)
        forceUpdate()
      }
    }
  }

  return (
    <>
      {isEditMode && (
        <div className={'tilemap-toolbar-overlay'}>
          <div className={'tilemap-toolbar-button-container'}>{actionButtons}</div>
          {editTile && <EditTileSheet tile={editTile} onCancel={() => setEditTile(null)} />}
        </div>
      )}
      {children({ styleMap: new Map(classesAndStyles), onSpaceClicked, onTilemapClicked })}
    </>
  )
}

type ActionButtonProps = {
  selected: boolean
  toolbarAction: ToolbarAction
  onClick: () => void
  onClickRight: () => void
}

export const ActionButton: FC<ActionButtonProps> = ({ selected, toolbarAction, onClick, onClickRight }) => (
  <button
    className={cn('tilemap-toolbar-button', selected && 'selected')}
    onClick={onClick}
    onContextMenu={onClickRight}
  >
    {toolbarAction.type === 'delete' ? 'DELETE' : <div style={toolbarAction.styleProps}></div>}
  </button>
)

type HandleFn = (
  tilemap: Tilemap,
  rowKey: number,
  cellKey: number,
  tilemapRendererRef: RefObject<HTMLDivElement>,
  tileSize: number
) => void

function handle(
  action: ToolbarAction,
  tilemap: Tilemap,
  rowKey: number,
  cellKey: number,
  tilemapRendererRef: RefObject<HTMLDivElement>,
  tileSize: number
): void {
  ;({
    add: setElement({ className: action.className ?? '' }),
    delete: deleteElement
  })[action.type](tilemap, rowKey, cellKey, tilemapRendererRef, tileSize)
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
  tilemapRendererRef: RefObject<HTMLDivElement>,
  tileSize: number
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
      tilemapRendererRef.current.scrollLeft += scrollX * -tileSize
    }
    if (scrollY > 0) {
      tilemapRendererRef.current.scrollTop += scrollY * -tileSize
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
  tilemapRendererRef: RefObject<HTMLDivElement>,
  tileSize: number
): [rowKey: number, cellKey: number] {
  const tilemapWidth = tilemap.rows[0]?.cells.length ?? 0
  const tilemapHeight = tilemap.rows.length

  if (tilemapWidth === 0 && tilemapHeight === 0) {
    tilemap.rows = [{ cells: [{ elements: [] }] }]
    if (tilemapRendererRef.current) {
      tilemapRendererRef.current.scrollLeft += offsetX * -tileSize
      tilemapRendererRef.current.scrollTop += offsetY * -tileSize
    }
    return [0, 0]
  }

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

  if (tilemapRendererRef.current) {
    if (offsetX < 0) {
      tilemapRendererRef.current.scrollLeft += offsetX * -tileSize
    }
    if (offsetY < 0) {
      tilemapRendererRef.current.scrollTop += offsetY * -tileSize
    }
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

function getClassAndStyle(tile: TilemapMetadataCustomTile): [string, CSSProperties] {
  const className = `custom-tile-${tile.id}`
  const style = {
    backgroundColor: tile.color,
    borderRadius: tile.shape == 'circle' ? '50%' : undefined,
    boxShadow: 'inset 0 0 0 1px black'
  }
  return [className, style]
}
