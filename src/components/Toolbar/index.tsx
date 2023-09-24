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
          <div className={'tile'}></div>
        </button>
        <button
          className={cn('tilemap-toolbar-button', toolbarAction === toolbarActions.circle && 'selected')}
          onClick={() => onToolbarActionChange(toolbarActions.circle)}
          onContextMenu={() => {
            onToolbarActionChange(toolbarActions.circle)
            setEditTile(true)
          }}
        >
          <div className={'circle'}></div>
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
      {editTile && (
        <div className={'tilemap-toolbar-edit-tile'}>
          <button onClick={() => setEditTile(false)}>Cancel</button>
        </div>
      )}
    </div>
  )
}
