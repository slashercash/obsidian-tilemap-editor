import type { FC } from 'types'
import React, { useLayoutEffect, useEffect, useState } from 'react'
import { Space } from './Space'
import { SpaceGrid } from './SpaceGrid'

type SpaceWrapperProps = {
  tilemap: Element
  tilemapRendererDiv: HTMLDivElement
  tilesCountVertical: number
  tilesCountHorizontal: number
  tileSize: number
  onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => void
}

export const SpaceWrapper: FC<SpaceWrapperProps> = ({
  tilemap,
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

  const space = Space(
    (spaceTilesCount.horizontal * 2 + tilesCountHorizontal) * tileSize,
    (spaceTilesCount.vertical * 2 + tilesCountVertical) * tileSize,
    overflow.horizontal,
    overflow.vertical,
    tileSize,
    (spaceTileX, spaceTileY) => {
      const offsetX = spaceTileX - spaceTilesCount.horizontal
      const offsetY = spaceTileY - spaceTilesCount.vertical
      onSpaceClicked(offsetX, offsetY, tileSize)
    }
  )

  const spaceGrid = SpaceGrid(
    (spaceTilesCount.horizontal * 2 + tilesCountHorizontal) * tileSize,
    (spaceTilesCount.vertical * 2 + tilesCountVertical) * tileSize,
    overflow.horizontal,
    overflow.vertical,
    tileSize
  )

  space.appendChild(spaceGrid)
  space.appendChild(tilemap)

  return <div ref={(ref) => ref?.replaceChildren(space)} />
}
