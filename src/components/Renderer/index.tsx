import type { FC, RefObject, Tilemap } from 'types'
import React, { useLayoutEffect, useState } from 'react'
import { SpaceWrapper } from './SpaceWrapper'
import { cn } from 'helper/className'

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
    <ZoomWrapper tilemapRendererRef={tilemapRendererRef} isEditMode={isEditMode}>
      {({ zoomFactor, tilemapRendererDiv }) => (
        <SpaceWrapper
          tilemapRendererDiv={tilemapRendererDiv}
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
  children: FC<{ zoomFactor: number; tilemapRendererDiv: HTMLDivElement }>
  tilemapRendererRef: RefObject<HTMLDivElement>
  isEditMode: boolean
}

const ZoomWrapper: FC<ZoomWrapperProps> = ({ children: Children, tilemapRendererRef, isEditMode }) => {
  const [prevTouchDistance, setPrevTouchDistance] = useState(0)
  const [size, setSize] = useState(30)

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    let y = x2 - x1
    let x = y2 - y1
    return Math.sqrt(x * x + y * y)
  }

  const setTouches = (touches: React.TouchList) => {
    const tA = touches[0]
    const tB = touches[1]

    if (touches.length === 2 && tA && tB) {
      const distance = getDistance(tA.pageX, tA.pageY, tB.pageX, tB.pageY)

      const sizeFactor = prevTouchDistance === 0 ? 1 : (1 / prevTouchDistance) * distance

      setSize(size * sizeFactor)
      setPrevTouchDistance(distance)
    } else {
      setPrevTouchDistance(0)
    }
  }

  const [tilemapRendererDiv, setTilemapRendererDiv] = useState<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    setTilemapRendererDiv(tilemapRendererRef.current)
  }, [])

  return (
    <div
      ref={tilemapRendererRef}
      className={cn('tilemap-renderer', isEditMode && 'edit')}
      onTouchStart={(e) => setTouches(e.touches)}
      onTouchMove={(e) => setTouches(e.touches)}
      onTouchEnd={(e) => setTouches(e.touches)}
      onTouchCancel={(e) => setTouches(e.touches)}
    >
      {tilemapRendererDiv && <Children zoomFactor={size} tilemapRendererDiv={tilemapRendererDiv} />}
    </div>
  )
}
