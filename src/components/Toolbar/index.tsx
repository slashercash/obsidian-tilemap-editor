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
  editTiles: boolean
  tilemapRendererRef: RefObject<HTMLDivElement>
  tilemap: Tilemap
}

export const Toolbar: FC<ToolbarProps> = ({ children, isEditMode, editTiles, tilemapRendererRef, tilemap }) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0)
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
        <ActionButton key={i} selected={i === selectedButtonIndex} onClick={() => setSelectedButtonIndex(i)}>
          {buttonSource.child}
        </ActionButton>
      )
      return [onTilemapClicked, onSpaceClicked, buttons]
    },
    [() => {}, () => {}, []]
  )

  function onCustomTileChanged(tile: TilemapMetadataCustomTile) {
    const index = tilemap.metadata.customTiles.findIndex((t) => t.id === tile.id)
    if (index != -1) {
      tilemap.metadata.customTiles[index] = tile
      forceUpdate()
    }
  }

  const editTile = editTiles && tilemap.metadata.customTiles[selectedButtonIndex]

  return (
    <>
      {isEditMode && (
        <div className={'tilemap-toolbar-overlay'}>
          <div className={'tilemap-toolbar-button-container'}>{buttons}</div>
          {editTile && <EditTileSheet tile={editTile} onChange={onCustomTileChanged} />}
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
}

export const ActionButton: FC<ActionButtonProps> = ({ children, selected, onClick }) => (
  <button className={cn('tilemap-toolbar-button', selected && 'selected')} onClick={onClick}>
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
