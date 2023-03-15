import React, { FC, useState } from 'react'
import { Tilemap } from 'src/types/tilemap'
import { Renderer } from '../Renderer'
import { Toolbar } from '../Toolbar'

interface TilemapEditorProps {
  tilemap: Tilemap
  isEditMode: boolean
}

export const TilemapEditor: FC<TilemapEditorProps> = ({ tilemap, isEditMode }) => {
  const [internalTilemap, setInternalTilemap] = useState(tilemap)

  return (
    <div className={'tilemap-editor'}>
      <Renderer tilemap={internalTilemap} isEditMode={isEditMode} onTilemapChanged={setInternalTilemap} />
      {isEditMode && <Toolbar />}
    </div>
  )
}
