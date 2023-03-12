import React, { FC, useCallback } from 'react'
import { EditStyle } from 'src/styles/EditStyle'
import { MainStyle } from 'src/styles/MainStyle'
import { Tilemap } from 'src/types/tilemap'
import { Renderer } from '../Renderer'

interface TilemapEditorProps {
  tilemap: Tilemap
  isEditMode: boolean
  onTilemapChanged: (t: Tilemap) => void
}

export const TilemapEditor: FC<TilemapEditorProps> = ({ tilemap, isEditMode, onTilemapChanged }) => {
  return (
    <>
      <MainStyle>
        <Renderer tilemap={tilemap} isEditMode={isEditMode} onTilemapChanged={onTilemapChanged} />
      </MainStyle>
      {isEditMode && <Edit />}
    </>
  )
}

const Edit: FC = () => <EditStyle>EditorPanel</EditStyle>
