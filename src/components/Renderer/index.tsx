import type { FC, RefObject } from 'types'
import React from 'react'
import { ZoomWrapper } from './ZoomWrapper'
import { SpaceWrapper } from './SpaceWrapper'

type RendererProps = {
  tilemapRendererRef: RefObject<HTMLDivElement>
  tilemap: Element
  isEditMode: boolean
  onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => void
}

export const Renderer: FC<RendererProps> = ({ tilemapRendererRef, tilemap, isEditMode, onSpaceClicked }) => (
  <ZoomWrapper tilemapRendererRef={tilemapRendererRef} isEditMode={isEditMode}>
    {({ tileSize, tilemapRendererDiv }) => (
      <div
        ref={(ref) =>
          ref &&
          SpaceWrapper(
            ref,
            tilemap,
            tilemapRendererDiv,
            tilemap.children.length,
            tilemap.children[0]?.children.length ?? 0,
            tileSize,
            onSpaceClicked
          )
        }
      />
    )}
  </ZoomWrapper>
)
