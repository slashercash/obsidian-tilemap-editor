import type { FC, ReactNode } from 'types'
import React, { useLayoutEffect, useEffect, useState } from 'react'

type SpaceWrapperProps = {
  children: ReactNode
  tilemapRendererDiv: HTMLDivElement
  tilesCountVertical: number
  tilesCountHorizontal: number
  tileSize: number
  onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => void
}

export const SpaceWrapper: FC<SpaceWrapperProps> = ({
  children,
  tilemapRendererDiv,
  tilesCountVertical,
  tilesCountHorizontal,
  tileSize,
  onSpaceClicked
}) => {
  const [spaceTilesCount, setSpaceTilesCount] = useState({ horizontal: 0, vertical: 0 })
  const [overflow, setOverflow] = useState({ horizontal: 0, vertical: 0 })
  const [doCenter, setDoCenter] = useState<boolean>(true)

  useLayoutEffect(() => {
    const obs = new ResizeObserver(([entry]) => {
      if (entry) {
        const horizontal = entry.contentRect.width / tileSize
        const vertical = entry.contentRect.height / tileSize

        setSpaceTilesCount({
          horizontal: Math.floor(horizontal),
          vertical: Math.floor(vertical)
        })
        setOverflow({
          horizontal: (horizontal % 1) * tileSize,
          vertical: (vertical % 1) * tileSize
        })
      }
    })
    obs.observe(tilemapRendererDiv)
    return () => {
      obs.disconnect()
    }
  }, [tileSize])

  useEffect(() => {
    if (doCenter && spaceTilesCount.horizontal != 0 && spaceTilesCount.vertical != 0) {
      setDoCenter(false)
      tilemapRendererDiv.scrollLeft = (tilemapRendererDiv.scrollWidth - tilemapRendererDiv.clientWidth) / 2
      tilemapRendererDiv.scrollTop = (tilemapRendererDiv.scrollHeight - tilemapRendererDiv.clientHeight) / 2
    }
  }, [spaceTilesCount])

  return (
    <ScrollGrid
      width={(spaceTilesCount.horizontal * 2 + tilesCountHorizontal) * tileSize}
      height={(spaceTilesCount.vertical * 2 + tilesCountVertical) * tileSize}
      overflowHorizontal={overflow.horizontal}
      overflowVertical={overflow.vertical}
      tileSize={tileSize}
      onSpaceClicked={(spaceTileX, spaceTileY) => {
        const offsetX = spaceTileX - spaceTilesCount.horizontal
        const offsetY = spaceTileY - spaceTilesCount.vertical
        onSpaceClicked(offsetX, offsetY, tileSize)
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
  overflowHorizontal: number
  overflowVertical: number
  tileSize: number
  onSpaceClicked: (spaceTileX: number, spaceTileY: number) => void
}

const ScrollGrid: FC<ScrollGridProps> = ({
  children,
  width,
  height,
  overflowHorizontal,
  overflowVertical,
  tileSize,
  onSpaceClicked
}) => {
  const overflowHorizontalInverted = tileSize - overflowHorizontal
  const overflowVerticalInverted = tileSize - overflowVertical

  return (
    <div
      style={{
        width: width - 2 * overflowHorizontalInverted + 'px',
        height: height - 2 * overflowVerticalInverted + 'px',
        position: 'relative'
      }}
      onClick={(e) => {
        const parent = e.currentTarget.parentElement
        if (parent) {
          const boundingClientRect = parent.getBoundingClientRect()
          const spaceTileX = Math.floor(
            (e.clientX - boundingClientRect.left + overflowHorizontalInverted + parent.scrollLeft) / tileSize
          )
          const spaceTileY = Math.floor(
            (e.clientY - boundingClientRect.top + overflowVerticalInverted + parent.scrollTop) / tileSize
          )
          onSpaceClicked(spaceTileX, spaceTileY)
        }
      }}
    >
      <svg width='100%' height='100%'>
        <defs>
          <pattern id='grid' width={tileSize} height={tileSize} patternUnits='userSpaceOnUse'>
            <path d={`M ${tileSize} 0 L 0 0 0 ${tileSize}`} fill='none' stroke='gray' strokeWidth='1' />
          </pattern>
        </defs>
        <g transform={`translate(${overflowHorizontal - tileSize}, ${overflowVertical - tileSize})`}>
          <rect width={width} height={height} fill='url(#grid)' />
        </g>
      </svg>
      {children}
    </div>
  )
}
