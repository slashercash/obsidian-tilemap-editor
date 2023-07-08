import type { FC, RefObject, ReactNode } from 'types'
import React, { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { cn } from 'helper/className'

type SpaceWrapperProps = {
  children: ReactNode
  tilemapRendererRef: RefObject<HTMLDivElement>
  isEditMode: boolean
  tilesCountVertical: number
  tilesCountHorizontal: number
  zoomFactor: number
  onSpaceClicked: (offsetX: number, offsetY: number, zoomFactor: number) => void
}

export const SpaceWrapper: FC<SpaceWrapperProps> = ({
  children,
  tilemapRendererRef: ref,
  isEditMode,
  tilesCountVertical,
  tilesCountHorizontal,
  zoomFactor,
  onSpaceClicked
}) => {
  const [spaceTilesCount, setSpaceTilesCount] = useState({ horizontal: 0, vertical: 0 })
  const [doCenter, setDoCenter] = useState<boolean>(true)

  useLayoutEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      if (entry) {
        setSpaceTilesCount({
          horizontal: Math.floor(entry.contentRect.width / zoomFactor),
          vertical: Math.floor(entry.contentRect.height / zoomFactor)
        })
      }
    })
    if (ref.current) {
      obs.observe(ref.current)
    }
    return () => {
      obs.disconnect()
    }
  }, [])

  useEffect(() => {
    if (doCenter && spaceTilesCount.horizontal != 0 && spaceTilesCount.vertical != 0 && ref.current) {
      setDoCenter(false)
      ref.current.scrollLeft = (ref.current.scrollWidth - ref.current.clientWidth) / 2
      ref.current.scrollTop = (ref.current.scrollHeight - ref.current.clientHeight) / 2
    }
  }, [spaceTilesCount])

  return (
    <div ref={ref} className={cn('tilemap-renderer', isEditMode && 'edit')}>
      <ScrollGrid
        width={spaceTilesCount.horizontal * 2 + tilesCountHorizontal}
        height={spaceTilesCount.vertical * 2 + tilesCountVertical}
        zoomFactor={zoomFactor}
        onSpaceClicked={(spaceTileX, spaceTileY) => {
          const offsetX = spaceTileX - spaceTilesCount.horizontal
          const offsetY = spaceTileY - spaceTilesCount.vertical
          onSpaceClicked(offsetX, offsetY, zoomFactor)
        }}
      >
        {children}
      </ScrollGrid>
    </div>
  )
}

type ScrollGridProps = {
  children: ReactNode
  width: number
  height: number
  zoomFactor: number
  onSpaceClicked: (spaceTileX: number, spaceTileY: number) => void
}

const ScrollGrid: FC<ScrollGridProps> = ({ children, width, height, zoomFactor, onSpaceClicked }) => (
  <div
    style={{ width: width * zoomFactor + 'px', height: height * zoomFactor + 'px', position: 'relative' }}
    onClick={(e) => {
      const parent = e.currentTarget.parentElement
      if (parent) {
        const boundingClientRect = parent.getBoundingClientRect()
        const spaceTileX = Math.floor((e.clientX - boundingClientRect.left + parent.scrollLeft) / zoomFactor)
        const spaceTileY = Math.floor((e.clientY - boundingClientRect.top + parent.scrollTop) / zoomFactor)
        onSpaceClicked(spaceTileX, spaceTileY)
      }
    }}
  >
    <svg width='100%' height='100%'>
      <defs>
        <pattern id='grid' width={zoomFactor} height={zoomFactor} patternUnits='userSpaceOnUse'>
          <path d={`M ${zoomFactor} 0 L 0 0 0 ${zoomFactor}`} fill='none' stroke='gray' strokeWidth='1' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#grid)' />
    </svg>
    {children}
  </div>
)
