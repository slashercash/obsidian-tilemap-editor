import type { CSSProperties } from 'types'

export type ToolbarActionType = 'add' | 'delete'

export type ToolbarAction = {
  type: ToolbarActionType
  className?: string
  styleProps?: CSSProperties
}
