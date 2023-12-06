import type { FC, RefObject, TilemapMetadata, TilemapMetadataCustomTile } from 'types'
import React, { useReducer, useState } from 'react'
import { cn } from 'helper/className'
import EditTileSheet from './EditTileSheet'
import ClickAction, { trimTilemap } from './ClickAction'

type OnSpaceClickedFn = (offsetX: number, offsetY: number, tileSize: number) => void

type ButtonSource = {
  child: JSX.Element
  onSpaceClicked: OnSpaceClickedFn
}

type ToolbarProps = {
  children: FC<{ onSpaceClicked: OnSpaceClickedFn }>
  isEditMode: boolean
  editTiles: boolean
  tilemapRendererRef: RefObject<HTMLDivElement>
  tilemap: HTMLElement
  metadata: TilemapMetadata
}

export const Toolbar: FC<ToolbarProps> = ({
  children,
  isEditMode,
  editTiles,
  tilemapRendererRef,
  tilemap,
  metadata
}) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0)

  const buttonSources: Array<ButtonSource> = metadata.customTiles
    .map(({ id }) => `custom-tile-${id}`)
    .map((className) => ({
      child: React.createElement('div', { className }),
      onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => {
        const [rowKey, cellKey] = ClickAction.prepareTilemap(tilemap, tilemapRendererRef, offsetX, offsetY, tileSize)
        ClickAction.setElement(tilemap, className, rowKey, cellKey)
        forceUpdate()
      }
    }))

  if (!editTiles) {
    buttonSources.push({
      child: React.createElement('span', {}, 'Delete'),
      onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => {
        const [rowKey, cellKey] = ClickAction.prepareTilemap(tilemap, tilemapRendererRef, offsetX, offsetY, tileSize)
        ClickAction.deleteElement(tilemap, tilemapRendererRef, rowKey, cellKey, tileSize)
        forceUpdate()
      }
    })
  }

  const [onSpaceClicked, buttons] = buttonSources.reduce<[OnSpaceClickedFn, Array<JSX.Element>]>(
    ([onSpaceClicked, buttons], buttonSource, i) => {
      if (isEditMode && !editTiles && i === selectedButtonIndex) {
        onSpaceClicked = buttonSource.onSpaceClicked
      }
      buttons.push(
        <ActionButton key={i} selected={i === selectedButtonIndex} onClick={() => setSelectedButtonIndex(i)}>
          {buttonSource.child}
        </ActionButton>
      )
      return [onSpaceClicked, buttons]
    },
    [() => {}, []]
  )

  if (editTiles) {
    buttons.push(
      <ActionButton
        key={buttons.length}
        selected={false}
        onClick={() => {
          metadata.customTiles.push({
            id: metadata.customTiles.reduce((p, v) => (p < v.id ? v.id : p), 0) + 1,
            shape: 'circle',
            color: 'red'
          })
          forceUpdate()
        }}
      >
        <>Create</>
      </ActionButton>
    )
  }

  function onCustomTileChanged(tile: TilemapMetadataCustomTile) {
    const index = metadata.customTiles.findIndex((t) => t.id === tile.id)
    if (index != -1) {
      metadata.customTiles[index] = tile
      forceUpdate()
    }
  }

  const editTile = editTiles && metadata.customTiles[selectedButtonIndex]

  function onDeleteCustomTile() {
    if (!editTile) {
      return
    }
    Array.from(tilemap.children).forEach((row, rowIndex) => {
      Array.from(row.children).forEach((cell, cellIndex) => {
        const newElements = Array.from(cell.children).filter(
          (element) => element.className != `custom-tile-${editTile.id}`
        )
        tilemap.children[rowIndex]?.children[cellIndex]?.replaceChildren(...newElements)
      })
    })
    trimTilemap(tilemap)
    metadata.customTiles.splice(selectedButtonIndex, 1)
    forceUpdate()
  }

  return (
    <>
      {isEditMode && (
        <div className={'tilemap-toolbar-overlay'}>
          <div className={'tilemap-toolbar-button-container'}>{buttons}</div>
          {editTile && (
            <EditTileSheet tile={editTile} onChange={onCustomTileChanged} onDeleteCustomTile={onDeleteCustomTile} />
          )}
        </div>
      )}
      {children({ onSpaceClicked })}
      <style>
        {metadata.customTiles
          .map((tile) => {
            const className = `.view-content-tilemap-editor .custom-tile-${tile.id}`
            const borderRadius = tile.shape == 'circle' ? '\n  border-radius: 50%;' : ''
            return `${className} {
  background-color: ${tile.color};
  box-shadow: inset 0 0 0 1px black;${borderRadius}
}`
          })
          .join('\n')}
      </style>
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
