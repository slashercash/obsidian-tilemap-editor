import type { FC, ReactNode } from 'types'
import React, { useLayoutEffect, useEffect, useState } from 'react'

type SpaceWrapperProps = {
  children: ReactNode
  tilemapRendererDiv: HTMLDivElement
  tilesCountVertical: number
  tilesCountHorizontal: number
  zoomFactor: number
  onSpaceClicked: (offsetX: number, offsetY: number, zoomFactor: number) => void
}

export const SpaceWrapper: FC<SpaceWrapperProps> = ({
  children,
  tilemapRendererDiv,
  tilesCountVertical,
  tilesCountHorizontal,
  zoomFactor,
  onSpaceClicked
}) => {
  const [spaceTilesCount, setSpaceTilesCount] = useState({ horizontal: 0, vertical: 0 })
  const [margin, setMargin] = useState({ horizontal: 0, vertical: 0 })
  const [doCenter, setDoCenter] = useState<boolean>(true)

  useLayoutEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      if (entry) {
        const horizontal = entry.contentRect.width / zoomFactor
        const vertical = entry.contentRect.height / zoomFactor

        setSpaceTilesCount({
          horizontal: Math.floor(horizontal) - 1,
          vertical: Math.floor(vertical) - 1
        })
        setMargin({
          horizontal: horizontal % 1,
          vertical: vertical % 1
        })
      }
    })
    obs.observe(tilemapRendererDiv)
    return () => {
      obs.disconnect()
    }
  }, [zoomFactor])

  useEffect(() => {
    if (doCenter && spaceTilesCount.horizontal != 0 && spaceTilesCount.vertical != 0) {
      setDoCenter(false)
      tilemapRendererDiv.scrollLeft = (tilemapRendererDiv.scrollWidth - tilemapRendererDiv.clientWidth) / 2
      tilemapRendererDiv.scrollTop = (tilemapRendererDiv.scrollHeight - tilemapRendererDiv.clientHeight) / 2
    }
  }, [spaceTilesCount])

  return (
    <ScrollGrid
      width={spaceTilesCount.horizontal * 2 + tilesCountHorizontal}
      height={spaceTilesCount.vertical * 2 + tilesCountVertical}
      marginHorizontal={margin.horizontal}
      marginVertical={margin.vertical}
      zoomFactor={zoomFactor}
      onSpaceClicked={(spaceTileX, spaceTileY) => {
        const offsetX = spaceTileX - spaceTilesCount.horizontal
        const offsetY = spaceTileY - spaceTilesCount.vertical
        onSpaceClicked(offsetX, offsetY, zoomFactor)
      }}
    >
      {children}
    </ScrollGrid>
  )
}

type ScrollGridProps = {
  children: ReactNode
  width: number
  height: number
  marginHorizontal: number
  marginVertical: number
  zoomFactor: number
  onSpaceClicked: (spaceTileX: number, spaceTileY: number) => void
}

const ScrollGrid: FC<ScrollGridProps> = ({
  children,
  width,
  height,
  marginHorizontal,
  marginVertical,
  zoomFactor,
  onSpaceClicked
}) => (
  <div
    style={{
      width: width * zoomFactor + 'px',
      height: height * zoomFactor + 'px',
      position: 'relative',
      margin: `${marginVertical * zoomFactor}px ${marginHorizontal * zoomFactor}px`
    }}
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
