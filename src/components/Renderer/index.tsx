import type { FC, RefObject, Tilemap } from 'types'
import React from 'react'
import { SpaceWrapper } from './SpaceWrapper'

type RendererProps = {
  tilemapRendererRef: RefObject<HTMLDivElement>
  tilemap: Tilemap
  isEditMode: boolean
  onTilemapClicked: (rowKey: number, cellKey: number, zoomFactor: number) => void
  onSpaceClicked: (offsetX: number, offsetY: number, zoomFactor: number) => void
}

export const Renderer: FC<RendererProps> = ({
  tilemapRendererRef,
  tilemap,
  isEditMode,
  onTilemapClicked,
  onSpaceClicked
}) => {
  return (
    <ZoomWrapper>
      {({ zoomFactor }) => (
        <SpaceWrapper
          tilemapRendererRef={tilemapRendererRef}
          isEditMode={isEditMode}
          tilesCountVertical={tilemap.rows.length}
          tilesCountHorizontal={tilemap.rows[0]?.cells.length ?? 0}
          zoomFactor={zoomFactor}
          onSpaceClicked={onSpaceClicked}
        >
          <div className={'tilemap'}>
            {tilemap.rows.map((row, rowKey) => (
              <div key={rowKey} className='tilemap-row'>
                {row.cells.map((cell, cellKey) => (
                  <div
                    key={cellKey}
                    className='tilemap-cell'
                    style={{ width: zoomFactor + 'px', height: zoomFactor + 'px' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTilemapClicked(rowKey, cellKey, zoomFactor)
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
      )}
    </ZoomWrapper>
  )
}

type ZoomWrapperProps = {
  children: FC<{ zoomFactor: number }>
}

const ZoomWrapper: FC<ZoomWrapperProps> = ({ children }) => {
  return children({ zoomFactor: 50 })
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
