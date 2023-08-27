import type { FC, RefObject, Tilemap } from 'types'
import React from 'react'
import { ZoomWrapper } from './ZoomWrapper'
import { SpaceWrapper } from './SpaceWrapper'

type RendererProps = {
  tilemapRendererRef: RefObject<HTMLDivElement>
  tilemap: Tilemap
  isEditMode: boolean
  onTilemapClicked: (rowKey: number, cellKey: number, tileSize: number) => void
  onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => void
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
      {({ tileSize, tilemapRendererDiv }) => (
        <SpaceWrapper
          tilemapRendererDiv={tilemapRendererDiv}
          tilesCountVertical={tilemap.rows.length}
          tilesCountHorizontal={tilemap.rows[0]?.cells.length ?? 0}
          tileSize={tileSize}
          onSpaceClicked={onSpaceClicked}
        >
          <div className={'tilemap'}>
            {tilemap.rows.map((row, rowKey) => (
              <div key={rowKey} className='tilemap-row'>
                {row.cells.map((cell, cellKey) => (
                  <div
                    key={cellKey}
                    className='tilemap-cell'
                    style={{ width: tileSize + 'px', height: tileSize + 'px' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTilemapClicked(rowKey, cellKey, tileSize)
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
