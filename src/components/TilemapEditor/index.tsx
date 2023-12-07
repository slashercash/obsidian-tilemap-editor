import type { FC, TilemapMetadata } from 'types'
import React, { useRef } from 'react'
import { Renderer } from 'components/Renderer'
import { Toolbar } from 'components/Toolbar'

type TilemapEditorProps = {
  tilemap: Element
  metadata: TilemapMetadata
  isEditMode: boolean
  editTiles: boolean
}

export const TilemapEditor: FC<TilemapEditorProps> = ({ tilemap, metadata, isEditMode, editTiles }) => {
  const tilemapRendererRef = useRef<HTMLDivElement>(null)

  return (
    <div className={'tilemap-editor'}>
      <Toolbar
        isEditMode={isEditMode}
        editTiles={editTiles}
        tilemapRendererRef={tilemapRendererRef}
        tilemap={tilemap}
        metadata={metadata}
      >
        {({ onSpaceClicked }) => (
          <Renderer
            tilemapRendererRef={tilemapRendererRef}
            tilemap={tilemap}
            isEditMode={isEditMode}
            onSpaceClicked={onSpaceClicked}
          />
        )}
      </Toolbar>
    </div>
  )
}
