import type { FC, ToolbarAction } from 'types'
import { toolbarActions } from 'types/enums'
import React from 'react'
import { cn } from 'helper/className'

type ToolbarProps = {
  toolbarAction: ToolbarAction
  onToolbarActionChange: (t: ToolbarAction) => void
}

export const Toolbar: FC<ToolbarProps> = ({ toolbarAction, onToolbarActionChange }) => (
  <div className={'tilemap-toolbar'}>
    <button
      className={cn('tilemap-toolbar-button', toolbarAction === toolbarActions.tile && 'selected')}
      onClick={() => onToolbarActionChange(toolbarActions.tile)}
    >
      <div className={'tile'}></div>
    </button>
    <button
      className={cn('tilemap-toolbar-button', toolbarAction === toolbarActions.circle && 'selected')}
      onClick={() => onToolbarActionChange(toolbarActions.circle)}
    >
      <div className={'circle'}></div>
    </button>
    <button
      className={cn('tilemap-toolbar-button', toolbarAction === toolbarActions.delete && 'selected')}
      onClick={() => onToolbarActionChange(toolbarActions.delete)}
    >
      DELETE
    </button>
  </div>
)
