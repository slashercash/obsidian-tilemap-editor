import type { CSSProperties, FC, RefObject, Tilemap, TilemapMetadataCustomTile } from 'types'
import React, { useReducer, useState } from 'react'
import { cn } from 'helper/className'
import EditTileSheet from './EditTileSheet'
import { getButtonSources } from './buttonSource'

type OnTilemapClickedFn = (rowKey: number, cellKey: number, tileSize: number) => void
type OnSpaceClickedFn = (offsetX: number, offsetY: number, tileSize: number) => void

type ToolbarProps = {
  children: FC<{
    styleMap: Map<string, CSSProperties>
    onTilemapClicked: OnTilemapClickedFn
    onSpaceClicked: OnSpaceClickedFn
  }>
  isEditMode: boolean
  tilemapRendererRef: RefObject<HTMLDivElement>
  tilemap: Tilemap
}

export const Toolbar: FC<ToolbarProps> = ({ children, isEditMode, tilemapRendererRef, tilemap }) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0)
  const [editTile, setEditTile] = useState<TilemapMetadataCustomTile | null>(null)
  const classesAndStyles: ReadonlyArray<[string, CSSProperties]> = tilemap.metadata.customTiles.map(getClassAndStyle)

  const [onTilemapClicked, onSpaceClicked, buttons] = getButtonSources(
    tilemap,
    tilemapRendererRef,
    classesAndStyles,
    forceUpdate
  ).reduce<[OnTilemapClickedFn, OnSpaceClickedFn, Array<JSX.Element>]>(
    ([onTilemapClicked, onSpaceClicked, buttons], buttonSource, i) => {
      if (isEditMode && i === selectedButtonIndex) {
        onTilemapClicked = buttonSource.onTilemapClicked
        onSpaceClicked = buttonSource.onSpaceClicked
      }
      buttons.push(
        <ActionButton
          key={i}
          selected={i === selectedButtonIndex}
          onClick={() => {
            setSelectedButtonIndex(i)
            if (editTile) setEditTile(tilemap.metadata.customTiles[i] ?? null)
          }}
          onClickRight={() => {
            setSelectedButtonIndex(i)
            setEditTile(tilemap.metadata.customTiles[i] ?? null)
          }}
        >
          {buttonSource.child}
        </ActionButton>
      )
      return [onTilemapClicked, onSpaceClicked, buttons]
    },
    [() => {}, () => {}, []]
  )

  function onCustomTileChanged(tile: TilemapMetadataCustomTile) {
    const index = tilemap.metadata.customTiles.findIndex((tile) => tile.id === tile.id)
    if (index != -1) {
      tilemap.metadata.customTiles[index] = tile
      setEditTile({ ...tile })
    }
  }

  return (
    <>
      {isEditMode && (
        <div className={'tilemap-toolbar-overlay'}>
          <div className={'tilemap-toolbar-button-container'}>{buttons}</div>
          {editTile && (
            <EditTileSheet tile={editTile} onChange={onCustomTileChanged} onCancel={() => setEditTile(null)} />
          )}
        </div>
      )}
      {children({ styleMap: new Map(classesAndStyles), onTilemapClicked, onSpaceClicked })}
    </>
  )
}

type ActionButtonProps = {
  children: JSX.Element
  selected: boolean
  onClick: () => void
  onClickRight: () => void
}

export const ActionButton: FC<ActionButtonProps> = ({ children, selected, onClick, onClickRight }) => (
  <button
    className={cn('tilemap-toolbar-button', selected && 'selected')}
    onClick={onClick}
    onContextMenu={onClickRight}
  >
    {children}
  </button>
)

function getClassAndStyle(tile: TilemapMetadataCustomTile): [string, CSSProperties] {
  const className = `custom-tile-${tile.id}`
  const style = {
    backgroundColor: tile.color,
    borderRadius: tile.shape == 'circle' ? '50%' : undefined,
    boxShadow: 'inset 0 0 0 1px black'
  }
  return [className, style]
}
