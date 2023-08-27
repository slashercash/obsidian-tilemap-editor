import type { FC, RefObject, TouchEvent, WheelEvent } from 'types'
import React, { useState, useLayoutEffect } from 'react'
import { cn } from 'helper/className'

type ZoomWrapperProps = {
  children: FC<{ tileSize: number; tilemapRendererDiv: HTMLDivElement }>
  tilemapRendererRef: RefObject<HTMLDivElement>
  isEditMode: boolean
}

export const ZoomWrapper: FC<ZoomWrapperProps> = ({ children, tilemapRendererRef, isEditMode }) => {
  const [tilemapRendererDiv, setTilemapRendererDiv] = useState<HTMLDivElement | null>(null)
  const [prevTouchDistance, setPrevTouchDistance] = useState(0)
  const [tileSize, setTileSize] = useState(30)

  useLayoutEffect(() => {
    setTilemapRendererDiv(tilemapRendererRef.current)
  }, [])

  const onTouchEvent = (e: TouchEvent) => {
    const tA = e.touches[0]
    const tB = e.touches[1]

    if (e.touches.length === 2 && tA && tB && tilemapRendererDiv) {
      const distance = getDistance(tA.pageX, tA.pageY, tB.pageX, tB.pageY)

      const zoomFactor = prevTouchDistance === 0 ? 1 : (1 / prevTouchDistance) * distance

      setTileSize(tileSize * zoomFactor)
      setPrevTouchDistance(distance)
    } else {
      setPrevTouchDistance(0)
    }
  }

  const onWheel = (e: WheelEvent) => {
    if (!e.ctrlKey) {
      return
    }

    if (e.deltaY > 0) {
      setTileSize(tileSize * 0.95)
    }

    if (e.deltaY < 0) {
      setTileSize(tileSize * 1.05)
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
      onWheel={onWheel}
    >
      {tilemapRendererDiv && children({ tileSize, tilemapRendererDiv })}
    </div>
  )
}

function getDistance(x1: number, y1: number, x2: number, y2: number) {
  const y = x2 - x1
  const x = y2 - y1
  return Math.sqrt(x * x + y * y)
}
