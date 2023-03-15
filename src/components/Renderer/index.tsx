import React, { FC, useCallback } from 'react'
import { cn } from 'src/helper/className'
import { Tilemap } from 'src/types/tilemap'

type RendererProps = {
  tilemap: Tilemap
  isEditMode: boolean
  onTilemapChanged: (t: Tilemap) => void
}

export const Renderer: FC<RendererProps> = ({ tilemap, isEditMode, onTilemapChanged }) => {
  const updateTile = useCallback(
    (rowKey: number, cellKey: number) => {
      const hasTile = tilemap.rows[rowKey].cells[cellKey].elements.length > 0
      tilemap.rows[rowKey].cells[cellKey].elements = hasTile ? [] : [{ className: 'tile' }]
      onTilemapChanged({ ...tilemap })
    },
    [tilemap, onTilemapChanged]
  )

  return (
    <div className={cn('tilemap-renderer', isEditMode && 'edit')}>
      <div className={'tilemap'}>
        {tilemap.rows.map((row, rowKey) => (
          <div key={rowKey} className='tilemap-row'>
            {row.cells.map((cell, cellKey) => (
              <div key={cellKey} className='tilemap-cell' onClick={() => isEditMode && updateTile(rowKey, cellKey)}>
                {cell.elements.map((element, elementKey) => (
                  <div key={elementKey} className={element.className}></div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
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
