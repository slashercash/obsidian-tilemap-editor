import type { FC, Tilemap } from 'types'
import React, { useRef } from 'react'
import { Renderer } from 'components/Renderer'
import { Toolbar } from 'components/Toolbar'

type TilemapEditorProps = {
  tilemap: Tilemap
  isEditMode: boolean
  editTiles: boolean
}

export const TilemapEditor: FC<TilemapEditorProps> = ({ tilemap, isEditMode, editTiles }) => {
  const tilemapRendererRef = useRef<HTMLDivElement>(null)

  return (
    <div className={'tilemap-editor'}>
      <Toolbar isEditMode={isEditMode} editTiles={editTiles} tilemapRendererRef={tilemapRendererRef} tilemap={tilemap}>
        {({ styleMap, onTilemapClicked, onSpaceClicked }) => (
          <Renderer
            tilemapRendererRef={tilemapRendererRef}
            tilemap={tilemap}
            styleMap={styleMap}
            isEditMode={isEditMode}
            onTilemapClicked={onTilemapClicked}
            onSpaceClicked={onSpaceClicked}
          />
        )}
      </Toolbar>
    </div>
  )
}
