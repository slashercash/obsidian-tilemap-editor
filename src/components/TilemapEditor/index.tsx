import type { FC, ToolbarAction, Tilemap } from 'types'
import { toolbarActions } from 'types/enums'
import React, { useState } from 'react'
import { Renderer } from 'components/Renderer'
import { Toolbar } from 'components/Toolbar'

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
