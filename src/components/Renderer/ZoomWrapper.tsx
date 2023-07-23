import type { FC, RefObject, TouchEvent } from 'types'
import React, { useState, useLayoutEffect } from 'react'
import { cn } from 'helper/className'

type ZoomWrapperProps = {
  children: FC<{ zoomFactor: number; tilemapRendererDiv: HTMLDivElement }>
  tilemapRendererRef: RefObject<HTMLDivElement>
  isEditMode: boolean
}

export const ZoomWrapper: FC<ZoomWrapperProps> = ({ children, tilemapRendererRef, isEditMode }) => {
  const [tilemapRendererDiv, setTilemapRendererDiv] = useState<HTMLDivElement | null>(null)
  const [prevTouchDistance, setPrevTouchDistance] = useState(0)
  const [size, setSize] = useState(30)

  useLayoutEffect(() => {
    setTilemapRendererDiv(tilemapRendererRef.current)
  }, [])

  const onTouchEvent = (e: TouchEvent) => {
    const tA = e.touches[0]
    const tB = e.touches[1]

    if (e.touches.length === 2 && tA && tB && tilemapRendererDiv) {
      const distance = getDistance(tA.pageX, tA.pageY, tB.pageX, tB.pageY)

      const sizeFactor = prevTouchDistance === 0 ? 1 : (1 / prevTouchDistance) * distance

      setSize(size * sizeFactor)
      setPrevTouchDistance(distance)
    } else {
      setPrevTouchDistance(0)
    }
  }

  return (
    <div
      ref={tilemapRendererRef}
      className={cn('tilemap-renderer', isEditMode && 'edit')}
      onTouchStart={onTouchEvent}
      onTouchMove={onTouchEvent}
      onTouchEnd={onTouchEvent}
      onTouchCancel={onTouchEvent}
    >
      {tilemapRendererDiv && children({ zoomFactor: size, tilemapRendererDiv })}
    </div>
  )
}

const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const y = x2 - x1
  const x = y2 - y1
  return Math.sqrt(x * x + y * y)
}
