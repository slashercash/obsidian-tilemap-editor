import React, { FC } from 'react'
import { Tilemap } from 'src/types/tilemap'
import { Renderer } from '../Renderer'
import { Toolbar } from '../Toolbar'

interface TilemapEditorProps {
  tilemap: Tilemap
  isEditMode: boolean
  onTilemapChanged: (t: Tilemap) => void
}

export const TilemapEditor: FC<TilemapEditorProps> = ({ tilemap, isEditMode, onTilemapChanged }) => {
  // const [tilemapee, setTilemap] = React.useState(5)

  return (
    <div className={'tilemap-editor'}>
      <Renderer tilemap={tilemap} isEditMode={isEditMode} onTilemapChanged={onTilemapChanged} />
      {isEditMode && <Toolbar />}
    </div>
  )
}
