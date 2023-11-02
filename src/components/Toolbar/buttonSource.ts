import type { CSSProperties, RefObject, Tilemap } from 'types'
import React from 'react'
import ClickAction from './ClickAction'

type ButtonSource = {
  child: JSX.Element
  onTilemapClicked: (rowKey: number, cellKey: number, tileSize: number) => void
  onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => void
}

export function getButtonSources(
  tilemap: Tilemap,
  tilemapRendererRef: RefObject<HTMLDivElement>,
  classesAndStyles: ReadonlyArray<[string, CSSProperties]>,
  forceUpdate: React.DispatchWithoutAction
): ReadonlyArray<ButtonSource> {
  const buttonSources = getCustomButtonSources(tilemap, tilemapRendererRef, classesAndStyles, forceUpdate)
  buttonSources.push({
    child: React.createElement('span', {}, 'Delete'),
    onTilemapClicked: (rowKey, cellKey, tileSize) => {
      ClickAction.deleteElement(tilemap, tilemapRendererRef, rowKey, cellKey, tileSize)
      forceUpdate()
    },
    onSpaceClicked: () => {}
  })

  return buttonSources
}

function getCustomButtonSources(
  tilemap: Tilemap,
  tilemapRendererRef: RefObject<HTMLDivElement>,
  classesAndStyles: ReadonlyArray<[string, CSSProperties]>,
  forceUpdate: React.DispatchWithoutAction
): Array<ButtonSource> {
  return classesAndStyles.map(([className, styleProps]) => {
    const onTilemapClicked = (rowKey: number, cellKey: number) => {
      ClickAction.setElement(tilemap, className, rowKey, cellKey)
      forceUpdate()
    }
    const onSpaceClicked = (offsetX: number, offsetY: number, tileSize: number) => {
      const [rowKey, cellKey] = ClickAction.expandTilemap(tilemap, tilemapRendererRef, offsetX, offsetY, tileSize)
      onTilemapClicked(rowKey, cellKey)
    }
    return {
      child: React.createElement('div', { style: styleProps }),
      onTilemapClicked,
      onSpaceClicked
    }
  })
}
