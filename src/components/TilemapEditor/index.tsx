import type { FC, TilemapMetadata } from 'types'
import React, { useRef } from 'react'
import { Renderer } from 'components/Renderer'
import { Toolbar } from 'components/Toolbar'

type TilemapEditorProps = {
  tilemap: HTMLElement
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
        {({ styleMap, onSpaceClicked }) => (
          <Renderer
            tilemapRendererRef={tilemapRendererRef}
            tilemap={tilemap}
            styleMap={styleMap}
            isEditMode={isEditMode}
            onSpaceClicked={onSpaceClicked}
          />
        )}
      </Toolbar>
    </div>
  )
}
