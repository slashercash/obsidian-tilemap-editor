import type { FC, RefObject, CSSProperties } from 'types'
import React from 'react'
import { ZoomWrapper } from './ZoomWrapper'
import { SpaceWrapper } from './SpaceWrapper'

type RendererProps = {
  tilemapRendererRef: RefObject<HTMLDivElement>
  tilemap: HTMLElement
  styleMap: Map<string, CSSProperties>
  isEditMode: boolean
  onSpaceClicked: (offsetX: number, offsetY: number, tileSize: number) => void
}

export const Renderer: FC<RendererProps> = ({ tilemapRendererRef, tilemap, styleMap, isEditMode, onSpaceClicked }) => (
  <ZoomWrapper tilemapRendererRef={tilemapRendererRef} isEditMode={isEditMode}>
    {({ tileSize, tilemapRendererDiv }) => (
      <SpaceWrapper
        tilemapRendererDiv={tilemapRendererDiv}
        tilesCountVertical={tilemap.children.length}
        tilesCountHorizontal={tilemap.children[0]?.children.length ?? 0}
        tileSize={tileSize}
        onSpaceClicked={onSpaceClicked}
      >
        <Tilemap styleMap={styleMap} tileSize={tileSize}>
          {tilemap.children}
        </Tilemap>
      </SpaceWrapper>
    )}
  </ZoomWrapper>
)

type TilemapProps = {
  children: HTMLCollection
  styleMap: Map<string, CSSProperties>
  tileSize: number
}

const Tilemap: FC<TilemapProps> = ({ children, styleMap, tileSize }) => (
  <div
    className={'tilemap'}
    ref={(ref) =>
      ref?.replaceChildren(
        ...Array.from(children).map((row, rowIndex) => {
          const newCells = Array.from(row.children).map((cell, cellIndex) => {
            const newElements = Array.from(cell.children).map((element) => {
              const st = styleMap.get(element.className)
              if (st) {
                element.setAttribute(
                  'style',
                  `background-color:${st.backgroundColor};border-radius:${st.borderRadius};box-shadow:${st.boxShadow};`
                )
              }
              return element
            })
            cell.replaceChildren(...newElements)
            cell.setAttribute('style', `width:${tileSize}px;height:${tileSize}px;`)
            return cell
          })
          row.replaceChildren(...newCells)
          return row.cloneNode(true)
        })
      )
    }
  />
)
