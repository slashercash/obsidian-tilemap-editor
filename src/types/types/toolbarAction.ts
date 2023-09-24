const ToolbarActionTile = 'tileOld'
const ToolbarActionCircle = 'circleOld'
const ToolbarActionDelete = 'delete'

type ToolbarActions = {
  tile: ToolbarAction
  circle: ToolbarAction
  delete: ToolbarAction
}

export const toolbarActions: ToolbarActions = {
  tile: ToolbarActionTile,
  circle: ToolbarActionCircle,
  delete: ToolbarActionDelete
}

export type ToolbarAction = typeof ToolbarActionTile | typeof ToolbarActionCircle | typeof ToolbarActionDelete
