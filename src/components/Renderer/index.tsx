import type { FC, RefObject } from 'types'
import React from 'react'
import { ZoomWrapper } from './ZoomWrapper'
import { SpaceWrapper } from './SpaceWrapper'

type RendererProps = {
  tilemapRendererRef: RefObject<HTMLDivElement>
  tilemap: HTMLElement
  isEditMode: boolean
  onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => void
}

export const Renderer: FC<RendererProps> = ({ tilemapRendererRef, tilemap, isEditMode, onSpaceClicked }) => (
  <ZoomWrapper tilemapRendererRef={tilemapRendererRef} isEditMode={isEditMode}>
    {({ tileSize, tilemapRendererDiv }) => (
      <SpaceWrapper
        tilemapRendererDiv={tilemapRendererDiv}
        tilesCountVertical={tilemap.children.length}
        tilesCountHorizontal={tilemap.children[0]?.children.length ?? 0}
        tileSize={tileSize}
        onSpaceClicked={onSpaceClicked}
      >
        <div
          className={'tilemap'}
          ref={(ref) => ref?.replaceChildren(...Array.from(tilemap.children).map((row) => row.cloneNode(true)))}
        />
      </SpaceWrapper>
    )}
  </ZoomWrapper>
)
