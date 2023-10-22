import type { FC, ToolbarAction } from 'types'
import React, { useState } from 'react'
import { cn } from 'helper/className'

type ToolbarProps = {
  actions: ReadonlyArray<ToolbarAction>
  selectedActionIndex: number
  setSelectedActionIndex: (i: number) => void
}

export const Toolbar: FC<ToolbarProps> = ({ actions, selectedActionIndex, setSelectedActionIndex }) => {
  const [editTile, setEditTile] = useState(false)

  const actionButtons = actions.map((action, i) => (
    <ActionButton
      key={i}
      selected={i === selectedActionIndex}
      toolbarAction={action}
      onClick={() => setSelectedActionIndex(i)}
      setEditTile={setEditTile}
    />
  ))

  return (
    <div className={'tilemap-toolbar-overlay'}>
      <div className={'tilemap-toolbar-button-container'}>{actionButtons}</div>
      {editTile && <EditTileSheet onCancel={() => setEditTile(false)} />}
    </div>
  )
}

type ActionButtonProps = {
  selected: boolean
  toolbarAction: ToolbarAction
  onClick: () => void
  setEditTile: (b: boolean) => void
}

export const ActionButton: FC<ActionButtonProps> = ({ selected, toolbarAction, onClick, setEditTile }) => (
  <button
    className={cn('tilemap-toolbar-button', selected && 'selected')}
    onClick={onClick}
    onContextMenu={() => {
      onClick()
      setEditTile(true)
    }}
  >
    {toolbarAction.type === 'delete' ? 'DELETE' : <div style={toolbarAction.styleProps}></div>}
  </button>
)

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
