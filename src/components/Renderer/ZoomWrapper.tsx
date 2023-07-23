import type { FC, RefObject } from 'types'
import React, { useState, useLayoutEffect } from 'react'
import { cn } from 'helper/className'

type ZoomWrapperProps = {
  children: FC<{ zoomFactor: number; tilemapRendererDiv: HTMLDivElement }>
  tilemapRendererRef: RefObject<HTMLDivElement>
  isEditMode: boolean
}

export const ZoomWrapper: FC<ZoomWrapperProps> = ({ children, tilemapRendererRef, isEditMode }) => {
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
      {tilemapRendererDiv && children({ zoomFactor: size, tilemapRendererDiv })}
    </div>
  )
}
