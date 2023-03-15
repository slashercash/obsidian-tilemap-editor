import React, { FC, useState } from 'react'
import { Tilemap } from 'src/types/tilemap'
import { ToolbarAction, toolbarActions } from 'src/types/toolbarAction'
import { Renderer } from '../Renderer'
import { Toolbar } from '../Toolbar'

type TilemapEditorProps = {
  tilemap: Tilemap
  isEditMode: boolean
}

export const TilemapEditor: FC<TilemapEditorProps> = ({ tilemap, isEditMode }) => {
  const [internalTilemap, setInternalTilemap] = useState(tilemap)
  const [toolbarAction, setToolbarAction] = useState<ToolbarAction>(toolbarActions.tile)

  return (
    <div className={'tilemap-editor'}>
      <Renderer
        tilemap={internalTilemap}
        isEditMode={isEditMode}
        toolbarAction={toolbarAction}
        onTilemapChanged={setInternalTilemap}
      />
      {isEditMode && <Toolbar toolbarAction={toolbarAction} onToolbarActionChange={setToolbarAction} />}
    </div>
  )
}
