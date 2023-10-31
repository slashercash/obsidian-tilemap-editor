import type { FC, Tilemap } from 'types'
import React, { useRef } from 'react'
import { Renderer } from 'components/Renderer'
import { Toolbar } from 'components/Toolbar'

type TilemapEditorProps = {
  tilemap: Tilemap
  isEditMode: boolean
}

export const TilemapEditor: FC<TilemapEditorProps> = ({ tilemap, isEditMode }) => {
  const tilemapRendererRef = useRef<HTMLDivElement>(null)

  return (
    <div className={'tilemap-editor'}>
      <Toolbar isEditMode={isEditMode} tilemapRendererRef={tilemapRendererRef} tilemap={tilemap}>
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
