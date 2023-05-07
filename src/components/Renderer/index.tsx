import type { FC, Tilemap, TilemapCell, TilemapElement, ToolbarAction } from 'types'
import React, { useCallback } from 'react'
import { SpaceWrapper } from 'components/SpaceWrapper'

type RendererProps = {
  tilemap: Tilemap
  isEditMode: boolean
  toolbarAction: ToolbarAction
  onTilemapChanged: (t: Tilemap) => void
}

export const Renderer: FC<RendererProps> = ({ tilemap, isEditMode, toolbarAction, onTilemapChanged }) => {
  const updateTile = useCallback(
    (rowKey: number, cellKey: number) => {
      if (isEditMode) {
        handle[toolbarAction](tilemap, rowKey, cellKey)
        onTilemapChanged({ ...tilemap })
      }
    },
    [tilemap, isEditMode, toolbarAction, onTilemapChanged]
  )

  return (
    <SpaceWrapper
      isEditMode={isEditMode}
      tilesCountVertical={tilemap.rows.length}
      tilesCountHorizontal={tilemap.rows[0]?.cells.length ?? 0}
      onSpaceClicked={(x, y) => console.log(x, y)}
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
