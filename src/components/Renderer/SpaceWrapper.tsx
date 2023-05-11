import type { FC, ReactNode } from 'types'
import React, { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { cn } from 'helper/className'

type SpaceWrapperProps = {
  children: ReactNode
  isEditMode: boolean
  tilesCountVertical: number
  tilesCountHorizontal: number
  onSpaceClicked: (offsetX: number, offsetY: number) => void
}

export const SpaceWrapper: FC<SpaceWrapperProps> = ({
  children,
  isEditMode,
  tilesCountVertical,
  tilesCountHorizontal,
  onSpaceClicked
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [spaceTilesCount, setSpaceTilesCount] = useState({ horizontal: 0, vertical: 0 })
  const [doCenter, setDoCenter] = useState<boolean>(true)

  useLayoutEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      if (entry) {
        setSpaceTilesCount({
          horizontal: Math.floor(entry.contentRect.width / 30),
          vertical: Math.floor(entry.contentRect.height / 30)
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
        width={(spaceTilesCount.horizontal * 2 + tilesCountHorizontal) * 30}
        height={(spaceTilesCount.vertical * 2 + tilesCountVertical) * 30}
        onSpaceClicked={(spaceTileX, spaceTileY) => {
          const offsetX = spaceTileX - spaceTilesCount.horizontal
          const offsetY = spaceTileY - spaceTilesCount.vertical
          onSpaceClicked(offsetX, offsetY)
          if (isEditMode && ref.current) {
            if (offsetX < 0) {
              ref.current.scrollLeft += offsetX * -30
            }
            if (offsetY < 0) {
              ref.current.scrollTop += offsetY * -30
            }
          }
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
  onSpaceClicked: (spaceTileX: number, spaceTileY: number) => void
}

const ScrollGrid: FC<ScrollGridProps> = ({ children, width, height, onSpaceClicked }) => (
  <div
    style={{ width: width + 'px', height: height + 'px', position: 'relative' }}
    onClick={(e) => {
      const parent = e.currentTarget.parentElement
      if (parent) {
        const boundingClientRect = parent.getBoundingClientRect()
        const spaceTileX = Math.floor((e.clientX - boundingClientRect.left + parent.scrollLeft) / 30)
        const spaceTileY = Math.floor((e.clientY - boundingClientRect.top + parent.scrollTop) / 30)
        onSpaceClicked(spaceTileX, spaceTileY)
      }
    }}
  >
    <svg width='100%' height='100%'>
      <defs>
        <pattern id='grid' width='30' height='30' patternUnits='userSpaceOnUse'>
          <path d='M 30 0 L 0 0 0 30' fill='none' stroke='gray' strokeWidth='1' />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#grid)' />
    </svg>
    {children}
  </div>
)
