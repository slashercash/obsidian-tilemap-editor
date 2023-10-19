import type { FC, RefObject, Tilemap, TilemapMetadata, CSSProperties } from 'types'
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
  const styleMap = createStyleMap(tilemap.metadata)

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
                      <div key={elementKey} style={styleMap.get(element.className)}></div>
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

function createStyleMap(metadata: TilemapMetadata) {
  return new Map(
    metadata.customTiles.map((tile) => {
      const className = `custom-tile-${tile.id}`
      const style: CSSProperties = {
        backgroundColor: tile.color,
        borderRadius: tile.shape == 'circle' ? '50%' : undefined,
        boxShadow: 'inset 0 0 0 1px black'
      }
      return [className, style]
    })
  )
}

// function createStyleStr(metadata: TilemapMetadata) {
//   return metadata.customTiles
//     .map((tile) => {
//       const className = `.custom-tile-${tile.id}`
//       const borderRadius = tile.shape == 'circle' ? '\n  border-radius: 50%;' : ''
//       return `${className} {
//   background-color: ${tile.color};
//   box-shadow: inset 0 0 0 1px black;${borderRadius}
// }`
//     })
//     .join('\n')
// }
