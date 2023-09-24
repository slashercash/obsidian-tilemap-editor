import type { FC, ToolbarAction } from 'types'
import { toolbarActions } from 'types/enums'
import React, { useState } from 'react'
import { cn } from 'helper/className'

type ToolbarProps = {
  toolbarAction: ToolbarAction
  onToolbarActionChange: (t: ToolbarAction) => void
}

export const Toolbar: FC<ToolbarProps> = ({ toolbarAction, onToolbarActionChange }) => {
  const [editTile, setEditTile] = useState(false)

  return (
    <div className={'tilemap-toolbar-overlay'}>
      <div className={'tilemap-toolbar-button-container'}>
        <button
          className={cn('tilemap-toolbar-button', toolbarAction === toolbarActions.tile && 'selected')}
          onClick={() => onToolbarActionChange(toolbarActions.tile)}
          onContextMenu={() => {
            onToolbarActionChange(toolbarActions.tile)
            setEditTile(true)
          }}
        >
          <div className={'tileOld'}></div>
        </button>
        <button
          className={cn('tilemap-toolbar-button', toolbarAction === toolbarActions.circle && 'selected')}
          onClick={() => onToolbarActionChange(toolbarActions.circle)}
          onContextMenu={() => {
            onToolbarActionChange(toolbarActions.circle)
            setEditTile(true)
          }}
        >
          <div className={'circleOld'}></div>
        </button>
        <button
          className={cn('tilemap-toolbar-button', toolbarAction === toolbarActions.delete && 'selected')}
          onClick={() => onToolbarActionChange(toolbarActions.delete)}
          onContextMenu={() => {
            setEditTile(true)
            onToolbarActionChange(toolbarActions.delete)
          }}
        >
          DELETE
        </button>
      </div>
      {editTile && <EditTileSheet onCancel={() => setEditTile(false)} />}
    </div>
  )
}

type EditTileSheetProps = {
  onCancel: () => void
}

const EditTileSheet: FC<EditTileSheetProps> = ({ onCancel }) => (
  <div className={'tilemap-toolbar-edit-tile'}>
    {/* <div>
      <label>Name:</label>
      <input type={'text'}></input>
    </div> */}
    <div>
      <label>Shape:</label>
    </div>
    {/* <div>
      <label>Border:</label>
    </div> */}
    <div>
      <label>Color:</label>
    </div>
    {/* <div>
      <label>Border color:</label>
    </div> */}
    <button onClick={onCancel}>Cancel</button>
  </div>
)
