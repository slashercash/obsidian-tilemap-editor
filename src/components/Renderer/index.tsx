import type { FC, Tilemap, TilemapRow, TilemapCell, TilemapElement, ToolbarAction } from 'types'
import React from 'react'
import { SpaceWrapper } from 'components/SpaceWrapper'

type RendererProps = {
  tilemap: Tilemap
  isEditMode: boolean
  toolbarAction: ToolbarAction
  onTilemapChanged: (t: Tilemap) => void
}

export const Renderer: FC<RendererProps> = ({ tilemap, isEditMode, toolbarAction, onTilemapChanged }) => {
  const updateTile = (rowKey: number, cellKey: number) => {
    if (isEditMode) {
      handle[toolbarAction](tilemap, rowKey, cellKey)
      onTilemapChanged({ ...tilemap })
    }
  }

  const enlargeTilemap = (offsetX: number, offsetY: number) => {
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
    onTilemapChanged({ ...tilemap })
  }

  return (
    <SpaceWrapper
      isEditMode={isEditMode}
      tilesCountVertical={tilemap.rows.length}
      tilesCountHorizontal={tilemap.rows[0]?.cells.length ?? 0}
      onSpaceClicked={enlargeTilemap}
    >
      <div className={'tilemap'}>
        {tilemap.rows.map((row, rowKey) => (
          <div key={rowKey} className='tilemap-row'>
            {row.cells.map((cell, cellKey) => (
              <div
                key={cellKey}
                className='tilemap-cell'
                onClick={(e) => {
                  e.stopPropagation()
                  updateTile(rowKey, cellKey)
                }}
              >
                {cell.elements.map((element, elementKey) => (
                  <div key={elementKey} className={element.className}></div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </SpaceWrapper>
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

function getAddValue(offset: number, distance: number): number {
  if (offset < 0) {
    return offset
  }
  if (offset >= distance) {
    return offset - distance + 1
  }
  return 0
}

// type InnerHtmlProps = {
//   view: string
// }

// const InnerHtml: FC<InnerHtmlProps> = ({ view }) => {
//   const [prevTouchDistance, setPrevTouchDistance] = useState(0)
//   const [size, setSize] = useState(1)

//   const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
//     let y = x2 - x1
//     let x = y2 - y1
//     return Math.sqrt(x * x + y * y)
//   }

//   const setTouches = (touches: React.TouchList) => {
//     if (touches.length === 2) {
//       const tA = touches[0]
//       const tB = touches[1]
//       const distance = getDistance(tA.pageX, tA.pageY, tB.pageX, tB.pageY)

//       const sizeFactor = prevTouchDistance === 0 ? 1 : (1 / prevTouchDistance) * distance

//       setSize(size * sizeFactor)

//       setPrevTouchDistance(distance)
//     } else {
//       setPrevTouchDistance(0)
//     }
//   }

//   return (
//     <>
//       <div
//         style={{ transform: `scale(${size})` }}
//         dangerouslySetInnerHTML={{ __html: view }}
//         onTouchStart={(e) => setTouches(e.touches)}
//         onTouchMove={(e) => setTouches(e.touches)}
//         onTouchEnd={(e) => setTouches(e.touches)}
//         onTouchCancel={(e) => setTouches(e.touches)}
//       />
//       <p>{`Distance --> ${prevTouchDistance}`}</p>
//       <p>{`Size --> ${size}`}</p>
//     </>
//   )
// }
